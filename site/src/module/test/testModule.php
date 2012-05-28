<?php 
class testModule extends Module
{
	private $name = 'testModule';

	public function init()
	{
		$this->Page->registerStyleSheet('src/module/css/testModule.css');
	}
	
	public function process()
	{
		$this->recordSet = $this->Data->select('SELECT * from user');
		$this->row = $this->recordSet->getRow();
	}
	
	public function render()
	{
		parent::render();
		
		$this->Smarty->assign('testModule', array(
			'username' => $this->row['username']
		));
		
		$this->Smarty->assign('module_id', $this->name);
		$this->Smarty->assign('module_class', 'mainContent');
		
		return $this->Smarty->fetch('src/php/Module.tpl');
	}
}
?>
