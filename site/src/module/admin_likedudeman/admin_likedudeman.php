<?php 
require_once("{$_SERVER['DOCUMENT_ROOT']}/src/php/Site.php");

class admin_likedudeman extends Module
{
	protected $name = 'admin_likedudeman';
	
	public function __construct($args=null)
	{
		parent::__construct($args);
		
		$this->view = 'browse';
	}
	
	public function process()
	{
		parent::process();
		
		if(isset($_REQUEST['action'])) {
			$this->handleAction();
		}
		
		switch ($this->view) 
		{
			case 'browse':

				$nPage = (isset($_REQUEST['page'])) ? $_REQUEST['page'] : 1;
				$nPageSize = (isset($_REQUEST['pagesize'])) ?$_REQUEST['pagesize'] : 5;
				
				$this->result = LikeDudeMan::getPagedResult($nPage, $nPageSize);
				
				// This is a hack.  Why?  Because it would be better to have a setting where activerecord automatically
				// removes the slashes from a string retrieved from the database, or else smarty should work as it supposed to
				// and allow you to unescape the string as you're putting it onto the page.  Neither is the case, so I'm intervening
				// in the data on a case-by-case basis to remove slashes before displaying the datapoints.  It would even be an 
				// improvement if I could just automatically do this across the board...   Barf.
				foreach($this->result['List'] as &$row) {
					$row->caption_text = stripslashes($row->caption_text);
				}
				
				$this->Page->registerDebugVar($this->result, 'LikeDudeMan PagedResult');
				
				$this->minCount = ($this->result['Page'] -1) * $this->result['PageSize'] + 1;
				$this->maxCount = $this->result['Page'] * $this->result['PageSize'];
				$this->maxCount = ($this->maxCount > $this->result['TotalCount']) ? $this->result['TotalCount'] : $this->maxCount;
				
				$this->prevPage = ($this->result['Page'] > 1) ? $this->result['Page'] - 1 : '';
				$this->nextPage = ($this->result['Page'] < $this->result['TotalPages']) ?  $this->result['Page'] + 1 : '';
				
				break;
				
			case 'thumbnails':
				
				$usedFilenames = LikeDudeMan::getFileNames();				
				$allFilenames = scandir($this->Site->getBasePath() . '/src/files/likedudeman');
				$this->unusedFilenames = array();
				
				foreach($allFilenames as $filename)
				{
					if (substr($filename, 0, 1) != '.' && !in_array($filename, $usedFilenames)) {
						array_push($this->unusedFilenames, $filename);
					}
				}
				
				$this->Page->registerDebugVar($usedFilenames, 'Used Filenames');
				$this->Page->registerDebugVar($allFilenames, 'All Filenames');
				$this->Page->registerDebugVar($this->unusedFilenames, 'Unused Filenames');
								
				break;
				
			case 'form':
				
				break;
		}
		
	}

	protected function handleAction()
	{
		switch ($_REQUEST['action'])
		{
			case 'update':
				$record = LikeDudeMan::find($_REQUEST['rowid']);
				if ($_REQUEST['field'] == 'sequence') {
					$record->updateSequence($_REQUEST['value']);
				} else {
					$record->update_attributes(array($_REQUEST['field'] => $_REQUEST['value']));
				}
				break;
			case 'showImages':
				$this->view = 'thumbnails';
				break;
			case 'showForm':
				$this->view = 'form';
				break;
			case 'insert':
				$this->view = 'browse';
				LikeDudeMan::createNewRecord(
					$_REQUEST['thumbnail'],
					$_REQUEST['date_drawn'], 
					$_REQUEST['caption']
				);
				break;
			case 'delete':
				$record = LikeDudeMan::find($_REQUEST['rowid']);
				$record->deleteRow();
				break;
			default:
				return;
		}
		
	}
	
	public function render()
	{
		parent::render();

		if ($this->view == 'browse') {

			$this->Smarty->assign('admin_likedudeman', array(
				 'view' => 'browse'
				,'rRows' => $this->result['List']
				,'pageSize' => $this->result['PageSize']
				,'prevPage' => $this->prevPage
				,'nextPage' => $this->nextPage
				,'minCount' => $this->minCount
				,'maxCount' => $this->maxCount
				,'totalCount' => $this->result['TotalCount']
			));

		} else if ($this->view == 'thumbnails') {
			
			$this->Smarty->assign('admin_likedudeman', array(
				  'view' => 'thumbnails'
				 ,'thumbnails' => $this->unusedFilenames
			));
			
		} else if ($this->view == 'form') {
			
			$this->Smarty->assign('admin_likedudeman', array(
				   'view' => 'form'
				  ,'thumbnail' => $_REQUEST['image']
				  ,'date' => date('m/d/Y')
			));
			
		}
				
		$this->Smarty->assign('module_id', $this->name);
		$this->Smarty->assign('module_class', 'mainContent');
		
		return $this->Smarty->fetch('src/php/Module.tpl');
	}
}

if (strpos($_SERVER['REQUEST_URI'], 'module/admin_likedudeman'))
{
	new admin_likedudeman();
}
?>
