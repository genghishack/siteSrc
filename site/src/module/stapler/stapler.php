<?php 
require_once("{$_SERVER['DOCUMENT_ROOT']}/src/php/Site.php");

class stapler extends Module
{
	protected $name = 'stapler';
	
	public function __construct($args=null)
	{
		parent::__construct($args);
	}
	
	public function render()
	{
		parent::render();
		
		$this->Smarty->assign('module_id', $this->name);
		$this->Smarty->assign('module_class', 'mainContent');
		
		return $this->Smarty->fetch('src/php/Module.tpl');
	}
}

if (strpos($_SERVER['REQUEST_URI'], 'module/stapler'))
{
	new stapler();
}
?>
