<?php 
/**
 * Now, in this here class, I'm creating a general layout for the entire site.
 * Shouldn't this be somewhere other than the class folder, since it's user defined?
 * I realize that there may be some standard layouts to keep around, like left nav (this one)
 * or top nav (not written yet, but easy)... 
 * 
 * This should be named "Layout"...
 * 
 * The basic idea is that the main full-page module (e.g. index.php) inherits from the template class, 
 * while the rest of the modules inherit from the module class.  The template class is doing part of the job of the 
 * main module, in that it is defining the HTML that goes above and below the main content on every page.
 * 
 * In this case, the layout involves a header, footer, and sidenav.  Thus the HTML prior to the main page content
 * contains the header div, the sidenav div, and the opening tag of the main content div.  The HTML following the
 * main content closes the main content div, and contains the footer div.  This way, we only have to concern ourselves with
 * creating the main content in our (e.g.) index.php file, sine the rest is being taken care of in the background.
 * 
 * @author genghishack
 *
 */
class Layout2 extends Module
{
    function __construct()
    {
        parent::__construct();
    	$this->registerModule('header');
    	$this->registerModule('footer');
    	$this->registerModule('sideNav');
    }
    
    public function init($oParams=false)
    {
        $initParams = ($oParams) ? $oParams : array(
             'pageName'     => $this->name
            ,'parentName'   => $this->name
        );
        
        parent::init($initParams);
    }
    
    public function render()
    {
    	parent::render();
        
		$this->topContent = <<<EOT
		
<div id="outerContainer" class="contain">
	{$this->header}
    <div id="mainContainer" class="contain">
		{$this->sideNav}
		<div id="contentContainer" class="contain">

EOT;

        $this->bottomContent = <<<EOT

        </div>
    </div>
    {$this->footer}

</div>
EOT;
		
    }
}

?>