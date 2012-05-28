<?php 
require_once("{$_SERVER['DOCUMENT_ROOT']}/src/php/Site.php");

class comic extends Module
{
	protected $name = 'comic';
	
	public function __construct($args=null)
	{
		parent::__construct($args);
		$this->registerModule('comic_nav');
		$this->registerModule('comic_panel');
	}
	
	public function render()
	{
		parent::render();
		
		$this->Smarty->assign($this->name, array(
			 'nav'   => $this->comic_nav
			,'panel' => $this->comic_panel
		));
		
		$this->Smarty->assign('module_id', $this->name);
		$this->Smarty->assign('module_class', 'mainContent');
		
		return $this->Smarty->fetch('src/php/Module.tpl');
	}
}

if (strpos($_SERVER['REQUEST_URI'], 'module/comic'))
{
	new comic();
}
?>
