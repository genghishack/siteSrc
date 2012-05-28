<?php 
class editPage extends Module
{
	protected $name = 'editPage';
    
	public function init()
	{
		parent::init();
		
		$this->Site->registerCKEditor();
		
//		$this->Page->registerJsTrailing("$('#editorThingy').ckeditor()");
		$this->Page->registerJsTrailing("CKEDITOR.replace( 'editorThingy' );");
	}
    
	public function process()
	{
		parent::process();
		
		$this->Page->registerVarDisplay($_POST, '_POST');
		
		if (isset($_POST['id'])) 
		{
			$foo = PageContent::find($_POST['id']);
			
			$foo->contents = $_POST['editorThingy'];
			
			$foo->save();
		}
		
		$this->oPageContent = PageContent::getContentByPageName($this->name);
		
    	$this->Page->registerVarDisplay($this->oPageContent, 'Page Content Record');
	}
    
	public function render()
	{
		parent::render();
		
		$this->Smarty->assign('editPage', array(
			 'sPageContent' => $this->oPageContent->contents
			,'sPageId'      => $this->oPageContent->id
		));
    	
		$this->Smarty->assign('module_id', $this->name);
		$this->Smarty->assign('module_class', 'mainContent');
		
		return $this->Smarty->fetch('src/php/Module.tpl');
	}
}
?>