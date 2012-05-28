<?php 
class footer extends Module
{
	protected $name = 'footer';
    
	public function init()
	{
		parent::init();
	}
    
	public function process()
	{
		parent::process();
		
		$this->year = date('Y');
	}
	
	public function render()
	{
		parent::render();
		
		$this->Smarty->assign('footer', array(
			 'year' => $this->year
		));
		
		$this->Smarty->assign('module_id', $this->name);
		$this->Smarty->assign('module_class', '');
		
		return $this->Smarty->fetch('src/php/Module.tpl');
	}
}
?>