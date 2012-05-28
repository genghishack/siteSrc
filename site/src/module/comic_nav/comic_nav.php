<?php 
require_once("{$_SERVER['DOCUMENT_ROOT']}/src/php/Site.php");

class comic_nav extends Module
{
	protected $name = 'comic_nav';
	
	public function process()
	{
		$this->nComicTotal = LikeDudeMan::count();
		
		$oFirstAndLast    = LikeDudeMan::getFirstAndLast();
		$nFirstInSequence = $oFirstAndLast->first;
		$nLastInSequence  = $oFirstAndLast->last;
		
		$this->nCurrentComic = (isset($_REQUEST['comic'])) ? $_REQUEST['comic'] : $nFirstInSequence;
		
		$this->nPrevComic  = $this->nCurrentComic - 1;
		$this->nNextComic  = $this->nCurrentComic + 1;
		$this->nFirstComic = $nFirstInSequence;
		$this->nLastComic  = $nLastInSequence;
	}
	
	public function render()
	{
		parent::render();
		
		$this->Smarty->assign('comic_nav', array(
			 'nFirstComic'   => $this->nFirstComic
			,'nPrevComic'    => $this->nPrevComic
			,'nCurrentComic' => $this->nCurrentComic
			,'nComicTotal'   => $this->nComicTotal
			,'nNextComic'    => $this->nNextComic
			,'nLastComic'    => $this->nLastComic
		));
		
		$this->Smarty->assign('module_id', $this->name);
		$this->Smarty->assign('module_class', '');
		
		return $this->Smarty->fetch('src/php/Module.tpl');
	}
}

if (strpos($_SERVER['REQUEST_URI'], 'module/comic_nav'))
{
	new comic_nav();
}
?>
