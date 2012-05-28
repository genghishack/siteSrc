<?php 
require_once("{$_SERVER['DOCUMENT_ROOT']}/src/php/Site.php");

class kimmie_main extends Module
{
	protected $name = 'kimmie_main';
	
	public function __construct($args=null)
	{
		parent::__construct($args);
		$this->registerModule('kimmie_nav');
		$this->registerModule('kimmie_panel');
	}
	
	public function render()
	{
		parent::render();
		
		$this->Smarty->assign('kimmie_main', array(
			 'kimmie_nav'   => $this->kimmie_nav
			,'kimmie_panel' => $this->kimmie_panel
		));
		
		$this->Smarty->assign('module_id', $this->name);
		$this->Smarty->assign('module_class', 'mainContent');
		
		return $this->Smarty->fetch('src/php/Module.tpl');
	}
}

if (strpos($_SERVER['REQUEST_URI'], 'module/kimmie_main'))
{
	new kimmie_main();
}
?>
