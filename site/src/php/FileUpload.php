<?php 
/**
 * @author Ralph Dosser <rd@ralphdosser.com>
 *
 * usage:
 * $uploader = new FileUpload(array(fieldName => 'form_field_upload'));
 * $pathOfUploadedFile = $uploader->save();
 */

/*
 * Our available fields in the _FILES array
 * echo "Error: "     . $_FILES["file"]["error"] . "<br />";
 * echo "Upload: "    . $_FILES["file"]["name"] . "<br />";
 * echo "Type: "      . $_FILES["file"]["type"] . "<br />";
 * echo "Size: "      . ($_FILES["file"]["size"] / 1024) . " Kb<br />";
 * echo "Stored in: " . $_FILES["file"]["tmp_name"];
 */

include_once ($Site->getBasePath() . '/src/php/class/IO/FileSystem.php');

class FileUpload
{
    private $formField;        // @var string the name of the form field used to upload the file
//    private $fileObj;          // @var string the table object associated with the file
    private static $basePath;  // @var string the new file's directory prefix (from filesystem root to our upload root)
    private $relativePath;     // @var string the new file's directory suffix (what comes after our upload root)
    private $baseName;         // @var string the new file's filename only (no path)
    private $maxFileSize = 2097152; // 2MB // @var int maximum file size we will accept
    private $errorMessage;     // @var string error message
    private $fileTypesAllowed; // @var mixed list of mime types we limit to - populated from constructor arguments
    private $fileTypesDenied;  // @var mixed list of mime types we will not allow
    private $uploadedFile;     // @var mixed our target file's array within the global $_FILES array
    
    public function __construct($formField = '', $fileObj = null)
	{
        // set formField if it's provided as an argument
        if($formField)
		{
            // set the value of the uploaded field
            $this->formField = $formField;
            
            // set the value of the file object (db record obj) to use - defaults to Image
//            $this->fileObj = (null != $fileObj) ? $fileObj : new Image();
            
            // make sure we've got an uploaded file to deal with
            if(isset($_FILES) && sizeof($_FILES) && isset($_FILES[$this->formField]) )
			{
                $this->uploadedFile = $_FILES[$this->formField];
                $this->setRelativePath();
                $this->setBaseName();
                return;
            }
        }
    }

	/**
	 * Checks to see if a file was selected in the form post.
	 * @return bool TRUE if file has been selected, FALSE otherwise.
	 **/
	public function hasFile()
	{
		return isset($this->baseName) & $this->baseName != '';
	}
	
	public function saveToDB()
	{
		// not available until 5.3
		//        $finfo = finfo_open(FILEINFO_MIME); // return mime type ala mimetype extension
		//        echo finfo_file($finfo, $this->uploadedFile['tmp_name']) . "\n";
		//        finfo_close($finfo);
		
		// find out if this is an image - if it is, get its characteristics for db insert
		$size = getimagesize($this->uploadedFile['tmp_name']);
		if($size)
		{
			// Object is an image, so use these fields
			if (method_exists($this->fileObj, 'setWidth')) {
				$this->fileObj->setWidth($size[0]);
			}
			if (method_exists($this->fileObj, 'setHeight')) {
				$this->fileObj->setHeight($size[1]);
			}
		}
		else 
		{
			// Object is not an image.  If we're looking for one, return an error.
			if (preg_match('/image/', $this->fileObj->dbTable()))
			{
				$this->errorMessage = "Uploaded file is not an image";
				return;
			}
		}

		// Set these fields in all cases - this is because ia's tables have these properties for uploaded files.
		$this->fileObj->setMimeType($this->uploadedFile['type']);
		$this->fileObj->setUserFilename($this->uploadedFile['name']);
		$this->fileObj->setBytes(filesize($this->uploadedFile['tmp_name']));
		$this->fileObj->setContent(addslashes(file_get_contents($this->uploadedFile['tmp_name'])));
		
		$this->fileObj->dbSave();
		
		return $this->fileObj->getID();
    }
    
    public function getImageDetails()
	{
		// not available until 5.3
		//        $finfo = finfo_open(FILEINFO_MIME); // return mime type ala mimetype extension
		//        echo finfo_file($finfo, $this->uploadedFile['tmp_name']) . "\n";
		//        finfo_close($finfo);
		
		// verify that this is an image - if it is, get its characteristics for db insert
		$size     = getimagesize($this->uploadedFile['tmp_name']);
		if(!$size)
		{
			$this->errorMessage = "Uploaded file is not an image";
			return;
		}


		return array(
			'width'     => $size[0],
			'height'    => $size[1],
			'mimeType'  => $this->uploadedFile['type'],
			'fileName'  => $this->uploadedFile['name'],
			'bytes'     => filesize($this->uploadedFile['tmp_name']),
			'content'   => addslashes(file_get_contents($this->uploadedFile['tmp_name']))
		);
    }
    
    
    /**
     * Writes the temporary file to the filesystem.
     * @param bool $allowOverwrite (optional) Defaults to FALSE
     * @return bool
     */
    public function save($allowOverwrite=FALSE)
	{
        // do we have an entry in the _FILES array?
        if(!$this->uploadedFile)
		{
            // throw an error?
            $this->errorMessage = 'Uploaded file could not be found';
            return false;
        }

        // verify that this is an uploaded file
        $sourceFile = $this->uploadedFile["tmp_name"];  
        if(!is_uploaded_file($sourceFile))
		{
            $this->errorMessage = 'Specified file was not an upload';
            return false;
        }

        // validate the upload
        if(!$this->validateFile() )
        {
            return false; 
        }
        
        // create target directory
        $destDir = $this->getFullPath();
        /*
         * Instantiate here or use the one created by Site?
         * 
         * Should this file be included with include_once by this class file since it's dependent on it?
         */
        $FS = new FileSystem();
        if(!$FS->isDirectory($destDir))
		{
            if(!$FS->createPath($destDir, 0777, true))
			{
                $this->errorMessage = "Could not create directory.";
                return false;
            }
        }
        
        // Create unique filename if !$allowOverwrite
        if(!$allowOverwrite && !$this->setUniqueBaseName())
        {
        	$this->errorMessage = "Could not create a unique basename for the file. Will not overwrite existing file(s).";
        	return false;
        }

        // move source file to destination
        $destFile = $this->getFullName();
        if(!$FS->move($sourceFile, $destFile))
		{
            $this->errorMessage = "Could not move source file to destination.";
            return false;
        }
        
        return $destFile;        
    }
    
    private function setBaseName($baseName = '')
	{
        if(empty($baseName))
		{
            $baseName = $this->uploadedFile['name'];
        } 
        $this->baseName = self::sanitizeFilename($baseName);
    }

    public function getBaseName()
	{
        return $this->baseName;
    }
    
    public function setRelativePath($relativePath = '')
	{
        // set relative path - build from current time and _FILE info
        // yyyy/mm/dd/md5(timestamp_tmpfilename)/original_name
        if(empty($relativePath))
		{
            $relativePath = strftime("%Y/%m/%d/") . md5(time() . '_' . $this->uploadedFile["tmp_name"]);
        }
        $this->relativePath = $relativePath;
    }
    
    public function getRelativePath()
	{
        return $this->relativePath;
    }
    
    public function getRelativeFile()
	{
        return "{$this->relativePath}/{$this->baseName}";
    }
    
    public static function setBasepath($basePath)
	{
        self::$basePath = $basePath;
    }
    
    public function getFullPath()
	{
        return rtrim(self::$basePath, '/') . "/{$this->relativePath}";
    }
    
    public function getFullName()
	{
        return $this->getFullPath() . "/{$this->baseName}";
    }

    public function hasErrorMessage()
	{
        if( ($this->uploadedFile["error"]) || ($this->errorMessage) )
		{
            return true;
        }
        return false;
    }
    
    public function getErrorMessage()
	{
        if($this->uploadedFile["error"])
		{
            return self::getFileUploadErrorMessage($this->uploadedFile["error"]);   
        }
        if ($this->errorMessage)
		{
            return $this->errorMessage;
        }
    }

    
    public function getMaxFileSize()
	{
        return $this->maxFileSize;
    }
    
    public function setMaxFileSize($maxFileSize)
	{
        $this->maxFileSize = $maxFileSize;
    }
    
    public function getFileTypesAllowed()
	{
        return $this->FileTypesAllowed;
    }
    
    public function setFileTypesAllowed($fileTypesAllowed)
	{
        $this->FileTypesAllowed = $fileTypesAllowed;
    }
    
    public function getFileTypesDenied()
	{
        return $this->FileTypesDenied;
    }
    
    public function setFileTypesDenied($fileTypesDenied)
	{
        $this->FileTypesDenied = $fileTypesDenied;
    }
    
    /** Replaces all special characters with dashes in the filename for
     * more consistency across platforms.
     * @param string $baseName The filename to sanitize e.g. 'Holliday Road.png'
     * @return string $baseName sanitized filename e.g. 'HollidayRoad.png'
     */
    private static function sanitizeFilename($baseName)
    {
        $baseName = strtolower($baseName);
        $baseName = preg_replace("/[^a-z0-9\(\)_\-\.]/", '', $baseName);
        return $baseName;
    }

    public function getSize()
    {
        // use isset before of empty
        if(empty($this->uploadedFile["size"]) )
        {
            return;
        }
        return $this->uploadedFile["size"];   
    }
    
    public function getType()
    {
        // use isset before empty
        if(empty($this->uploadedFile["type"]) )
        {
            return;
        }
        
        return $this->uploadedFile["type"];
    }
    
    public function validateFile()
    {
    	// make sure we're not exceeding our size limit
        if( $this->getSize() <= 0 || $this->getSize() > $this->maxFileSize ){
            $this->errorMessage = "File is too large:" . $this->getSize() . " > {$this->maxFileSize}";
            return false;
        }
        
        // TODO: check against fileTypesAllowed and fileTypesDenied arrays
        
        // all tests passed
        return true;
    }

    public static function getFileUploadErrorMessage($errorCode)
    {
    	switch ($errorCode)
    	{
		case UPLOAD_ERR_INI_SIZE:
			return 'The uploaded file exceeds the upload_max_filesize: ' . ini_get('upload_max_filesize') . 'B';
		case UPLOAD_ERR_FORM_SIZE:
			return 'The uploaded file exceeds the MAX_FILE_SIZE: ';
		case UPLOAD_ERR_PARTIAL:
			return 'The uploaded file was only partially uploaded';
		case UPLOAD_ERR_NO_FILE:
			return 'No file was uploaded';
		case UPLOAD_ERR_NO_TMP_DIR:
			return 'Missing a temporary folder';
		case UPLOAD_ERR_CANT_WRITE:
			return 'Failed to write file to disk';
		case UPLOAD_ERR_EXTENSION:
			return 'File upload stopped by extension';
		default:
			return 'Unknown upload error';
        }
    }
    
    /**
     * Avoids overwriting exiting file on filesystem by
     * appending an int to the filename if file exists.
     * @param int $maxAttempts (optional) The maximum number of attempts to generate 
     *							a unique filename before returning false.
     * @return bool
     */
    protected function setUniqueBaseName($maxAttempts=1000)
    {
    	if( !strlen($this->baseName) ) return FALSE;
    	
    	$original = $this->baseName;
    	$info = pathinfo($this->baseName);
    	
    	$i = 1;
    	while( file_exists($this->getFullName()) )
    	{
    		if( $i >= $maxAttempts )
    		{
    			$this->setBaseName($original);
    			return FALSE;
    		}
    		
    		$this->setBaseName($info['filename'] . "-$i." . $info['extension']);
    		$i++;
    	}
    	
    	return TRUE;
    }
}


?>