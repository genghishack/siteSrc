<?php
/**
 * File I/O and Filesystem Access Class
 *
 * @author Ralph Dosser <inspiringapps.com@ralphdosser.com>
 *
 * @todo add binary file support
 * @todo method getSize
 * @todo method getOwnerId
 * @todo method getGroupId
 * @todo method getTimeUpdated
 * @todo method getExtension
 * @todo method getMimeType
 * @todo method getPermissions
 */
class FileSystem {
    
    protected $fullPath;
    protected $mimeType;
    
    public function __construct()
	{
	}
    
    /**
     * Get the base name of our file
     */
    public function baseName($targetFile) 
    {
        return basename($targetFile);
    }
    
    /**
     * Get the containing directory of our file
     */
    public function dirName($targetFile) 
    {
        return dirname($targetFile);
    }
    
    /**
 	 * Wrapper to see if the file exists
 	 * 
 	 * @param string path of entity (optional)
	 * @return bool exists or does not
	 **/
    public function	exists($targetFile) 
    {
        return file_exists($targetFile);
    }
    
    
    /**
 	 * Wrapper to see if the file's containing directory exists
 	 * 
	 * @return bool containing directory exists
	 **/
    public function	pathExists($targetFile) 
    {
        return is_dir($targetFile);
    }
    
	/**
 	 * Wrapper to see if specified path is a directory
 	 * 
 	 * @param string path of entity (optional)
	 * @return bool is directory
	 **/
    public function isDirectory($targetDir) 
    {
        return is_dir($targetDir);
    }
    

    /**
 	 * Wrapper to see if the specified path is writable
 	 * 
	 * @return bool is writable
	 **/
    public function isWritable($targetFile) 
    {
        return is_writable($targetFile);
    }
	
    /**
 	 * Wrapper to set file or directory permissions
 	 * 
 	 * @param int permissions mode (in octal, IE 0755)
 	 * 
	 * @return bool success or failure
	 **/
    public function setPermissions($targetFile, $mode) 
    {
        // make the call
        return chmod($targetFile, $mode);
    }        
    
    /**
 	 * Wrapper to create directory path
 	 * 
 	 * @param int permissions mode (in octal, IE 0755)
 	 * @param bool whether to recurse when creating path
	 * @return bool success or failure
	 **/
    public function createPath($targetDir, $mode = 0755, $recursive = false) 
    {
        // make the call
        return mkdir($targetDir, $mode, $recursive);
    }

    /**
 	 * Wrapper to copy resource
 	 * 
 	 * @param string destination of file to copy to
	 * @return bool success or failure
	 **/
    public function copy($sourceFile, $destinationFile) 
    {
        // make the call
        return copy($sourceFile, $destinationFile);
    }

    
    /**
 	 * Wrapper to relocate or rename resources
 	 * 
     * @param string destination of file to move to
	 * @return bool success or failure
	 **/
    public function move($sourceFile, $destinationFile)
    {
        // make the call
        return rename($sourceFile, $destinationFile);
    }

    /**
 	 * Wrapper to delete resource
 	 * 
	 * @return bool success or failure
	 **/
    public function delete($target) 
    {

//        // check perms
//        if(!$this->isWritable($target)) {
//            trigger_error("Permission denied");
//        }
        
        // if a directory, delete its contents first
        //else 
        if($this->isDirectory($target)) {
            $return = $this->deleteRecursive($target);
        } 
        
        // not a directory, a file - simple unlink
        else {
            $return = unlink($target);
        }
        
        // return our result
        return $return;
    }

    
    /* 
     * Utility function to recurse through a directory's contents and delete everything inside
     * 
     * @param string path of directory to delete
     * @return bool success or failure
     */
    protected function deleteRecursive($dirName) 
    {

        // read directory contents .... 
        $dirContents  = $this->getDirContents($dirName);
        foreach($dirContents as $file) {

            // if this is a file, unlink and return result
            $fullpath = "$dirName/$file";
            if(!is_dir($fullpath)) {
                $tmpIO = new iaIO($fullpath);
                $return = $tmpIO->delete();
                if(!$return) {
                    return;
                }
            }
                
            // if this is a directory, recurse
            else {
                $return = $this->deleteRecursive($fullpath);
                if(!$return) {
                    return;
                }
            }
        }

        // we're done, delete target directory
        return rmdir($dirName);
    }

    /* 
     * Read a directory's contents
     * 
     * @param string path of directory to read
     * @return mixed array of directory contents
     */
    protected function getDirContents($dirName)  {

        $return = array();
        $dirHandle    = opendir($dirName);
        if(!$dirHandle) {
            return $return;
        }
        while($file   = readdir($dirHandle)) {  
            if($file != '.' && $file != '..') {
                $return[] = $file;
            }
        }
        closedir($dirHandle);
        return $return;
    }
    
    /**
 	 * Wrapper to read contents of file
 	 * 
	 * @return string contents of file
	 **/
    public function read($targetFile) 
    {
        // make the call
        return file_get_contents($targetFile);
    }
    
    /**
 	 * Wrapper to write file contents
 	 * 
 	 * @param string contents to write
 	 * @param flags options for write. At present we only support FILE_APPEND (If file filename already exists, append the data to the file instead of overwriting it.)
	 * @return bool success or failure
	 **/
    public function write($targetFile, $contents, $flags = null) 
    {
       // set our return value to blank
        $return = '';

        // if this is a new file and the containing directory does not exist, create it
        if(!$this->exists($targetFile) && !$this->pathExists($targetFile)) {
            $targetPath = $this->dirName($targetFile);
            if(!mkdir($targetPath)) {
                return;
            }
        }

        // if we don't have permission to write, throw an error
        if($this->exists($targetFile) && !$this->isWritable($targetFile)) {
            trigger_error("Permission denied");
        }

        // we have permissions, proceed
        else {
            // only allow the "append" flag (for now)
            if($flags & FILE_APPEND) {
                $flags = FILE_APPEND;
            } else {
                $flags = 0;
            }
            // directory exists - write the file
            $return = file_put_contents($targetFile, $contents, $flags);
        }
            
        // return our result
        return $return;
    }
}

?>
