<?php 
require_once("{$_SERVER['DOCUMENT_ROOT']}/src/php/Site.php");

class kimmie_panel extends Module
{
	protected $name = 'kimmie_panel';
	
	public function init()
	{
		parent::init();
		
		$nComicToShow = (isset($_REQUEST['comic'])) ? $_REQUEST['comic'] : Kimmie::getFirstAndLast()->last;
		$oComicToShow = Kimmie::getComicBySequence($nComicToShow);
		
		$this->sComicFileName = $oComicToShow->filename;
		
		$oComicDate = $oComicToShow->date_drawn;
		$this->sComicDate = $oComicDate->format('F j, Y');
	}
	
	public function render()
	{
		parent::render();
		
		$this->Smarty->assign('kimmie_panel', array(
			 'sComicFileName' => $this->sComicFileName
			,'sComicDate'     => $this->sComicDate
		));
		
		$this->Smarty->assign('module_id', $this->name);
		$this->Smarty->assign('module_class', '');
		
		return $this->Smarty->fetch('src/php/Module.tpl');
	}
}

if (strpos($_SERVER['REQUEST_URI'], 'module/kimmie_panel'))
{
	new kimmie_panel();
}
?>
