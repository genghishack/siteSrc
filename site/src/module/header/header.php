<?php 
class header extends Module
{
	protected $name = 'header';
	
	public function init($params)
	{
		parent::init();
		
		$this->parentName = (isSet($params['parentName'])) ? $params['parentName'] : '';
		$this->Page->registerJsTrailing("
			var header = new header_Class();
		");
	}
	
	public function process($params)
	{
		parent::process();
		
		if ($this->User->isLoggedIn()) {
			$this->userMenu = <<<EOT
				<div class = "menu">
					<span class  = "menuText">
						logged in as 
						<span class = "menuUser">
							{$this->User->getName()}
						</span>
					</span>
					<span class  = "menuDivider">|</span>
					<span class  = "menuItem"
					      action = "account">my account</span>
					<span class  = "menuDivider">|</span>
					<span class  = "menuItem logout"
					      action = "logout">logout</span>
				</div>
				
EOT;
		}
		else {
			$this->userMenu = <<<EOT
				<div class = "menu">
					<span class  = "menuItem login" 
					      action = "login">login</span>
				</div>
				
EOT;
		}
		
	}
	
	public function render()
	{
		parent::render();
		
		/*
		 * TODO:
		 * - put a spinner on the login div - create a general one that can fit over any div
		 * - make it so that the return key works to make the button submit, and also so that the tab index goes
		 * to the button after the two form fields
		 * - error handling for bad logins
		 * - forgot password?
		 * - forgot username? (both require email address and ability to send)
		 */
		
		$this->Smarty->assign('header', array(
			'userMenu' => $this->userMenu
		));

		$this->Smarty->assign('module_id', $this->name);
		$this->Smarty->assign('module_class', '');
		
		return $this->Smarty->fetch('src/php/Module.tpl');
	}
}
?>