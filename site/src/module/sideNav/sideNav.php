<?php 
class sideNav extends Module
{
	protected $name = 'sideNav';
	
	public function init($params)
	{
		parent::init();
		
		$this->pageName   = (isSet($params['pageName']))   ? $params['pageName']   : '';
		$this->parentName = (isSet($params['parentName'])) ? $params['parentName'] : '';
		
		$this->Page->registerJsTrailing(array(
			'var sideNav = new sideNav();'
		));
	}
	
	public function process($params)
	{
		parent::process();
		
		$this->navList = array(
			 'index'            => array('label' => 'Home')
			,'likedudeman'      => array('label' => 'Like, Dude Man')
			,'genghishack_page' => array('label' => 'Genghishack')
			,'kimmie'           => array('label' => 'Kimmie')
			,'admin'	        => array(
				 'label'	=> 'Admin'
				,'expand'   => true
				,'access'   => 'admin'
				,'children' => array(
					 'admin_users'		      => array('label' => 'Users')
					,'admin_likedudeman_page' => array('label' => 'Like, Dude Man')
				)
			)
//			,'navLevel1'      => array(
//				 'label' => 'Nav Level 1'
//				,'children' => array(
//					 'navLevel2Item1' => array('label' => 'Nav Level 2 Item 1')
//					,'navLevel2Item2' => array('label' => 'Nav Level 2 Item 2')
//				)
//				,'expand' => true
//			)
//			,'about'          => array('label' => 'About Us')
//			,'contact'        => array('label' => 'Contact Us')
//			,'whatICanDo'     => array(
//				 'label' => 'Look What I Can Do'
//				,'children' => array(
//					 'coolThing1' => array('label' => 'Cool Thing 1')
//					,'coolThing2' => array('label' => 'Cool Thing 2')
//					,'portfolio' => array('label' => 'Portfolio')
//				)
//				,'expand' => true
//			)
//			,'stuffILike'     => array('label' => 'Stuff I Like')
//			,'about' => array('label' => 'About Us')
//			,'contact' => array('label' => 'Contact Us')
			,'editable' => array('label' => 'Editable Content')
		);

//		$this->Page->registerDebugVar($this->navList, 'navList');
	}
    
	public function render()
	{
		parent::render();
		
		$rNavItems = array();
    	
    	/*
    	 * TODO: rewrite this into a recursive function.  This is a mess.
    	 */
		
		// documenting for rewrite...
		
		// adding a ul element to the array.  first step in the recursive function
    	array_push($rNavItems, '<ul class="level1">');
    	
    	//parse through the nav list...
    	forEach ($this->navList as $sPageName => $array) 
    	{
    		// I'm considering whether I should make each page (and layout) a subclass of $Page.
    		// This would keep the naming of modules and pages from stepping on each other.
    		
    		// $this->pageName is passed as a parameter.  Determine whether the current iteration is the page we're looking at.
    		$selectedClass = ($sPageName == $this->pageName) ? 'selected' : '';
    		
    		// 
    		$sPageName = (isSet($array['expand']) && $array['expand']) ? '' : $sPageName;
    		if ( !isset($array['access']) || ($this->User->hasAccess($array['access'])) )
    		{
	    		array_push($rNavItems, "<li class=\"level1 $selectedClass\" view=\"$sPageName\">{$array['label']}</li>");
	    		if (isSet($array['children'])) 
	    		{
	    			$displayStyle = ($sPageName != $this->parentName) ? 'display:none;' : '';
	    			array_push($rNavItems, "<ul class=\"level2 $sPageName\" style=\"$displayStyle\">");
	    			forEach ($array['children'] as $subView => $subArray) 
	    			{
	    				$selectedClass = ($subView == $this->pageName) ? 'selected' : '';
	    				array_push($rNavItems, "<li class=\"level2 $selectedClass\" view=\"$subView\">{$subArray['label']}</li>");
	    			}
	    			array_push($rNavItems, '</ul>');
	    		}
    		}
    	}
    	
		// close the outer ul element. last step in the recursive function
		array_push($rNavItems, '</ul>');
    	
		$sNavItems = implode("\n", $rNavItems);

		$this->Smarty->assign('sideNav', array(
			'sNavItems' => $sNavItems
		));
		
		$this->Smarty->assign('module_id', $this->name);
		$this->Smarty->assign('module_class', '');
		
		return $this->Smarty->fetch('src/php/Module.tpl');
    }
}
?>