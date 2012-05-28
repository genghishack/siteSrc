<?php 
class main extends Module
{
	protected $name = 'main';
    
	public function init()
	{
		parent::init();
	}
    
	public function process()
	{
		parent::process();
		
		$user = User::find(1);
		
		$this->Page->registerDebugVar($user, 'User Record', true);
	}
    
	public function render()
	{
		parent::render();
    	
		$this->Smarty->assign('module_id', $this->name);
		$this->Smarty->assign('module_class', 'mainContent');
		
		return $this->Smarty->fetch('src/php/Module.tpl');
	}
}
?>