<?php 
class Layout1 extends Module
{
    function __construct()
    {
        parent::__construct();
    	$this->registerModule('header');
    	$this->registerModule('footer');
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
    
EOT;

        $this->bottomContent = <<<EOT
    
    </div>
    {$this->footer}

</div>
EOT;
		
    }
}

?>