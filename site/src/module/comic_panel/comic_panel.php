<?php 
require_once("{$_SERVER['DOCUMENT_ROOT']}/src/php/Site.php");

class comic_panel extends Module
{
	protected $name = 'comic_panel';
	
	public function init()
	{
		parent::init();
	}
	
	public function process()
	{
		parent::process();
		
		$nComicToShow = (isset($_REQUEST['comic'])) ? $_REQUEST['comic'] : LikeDudeMan::getFirstAndLast()->first;
		$oComicToShow = LikeDudeMan::getComicBySequence($nComicToShow);
		$oComicDate = $oComicToShow->date_drawn;
		
		$this->sComicFileName = $oComicToShow->filename;
		$this->sComicDate = $oComicDate->format('F j, Y');
	}
	
	public function render()
	{
		parent::render();
		
		$this->Smarty->assign('comic_panel', array(
			 'sComicFileName' => $this->sComicFileName
			,'sComicDate'     => $this->sComicDate
		));
		
		$this->Smarty->assign('module_id', $this->name);
		$this->Smarty->assign('module_class', '');
		
		return $this->Smarty->fetch('src/php/Module.tpl');
	}
}

if (strpos($_SERVER['REQUEST_URI'], 'module/comic_panel'))
{
	new comic_panel();
}
?>
