<?php 
require('src/php/class/Site.php');

class Content extends Template
{
    protected $name = 'about';

    function __construct()
    {
        parent::__construct();
        $this->registerModule('aboutContent');
    }
    
    public function render()
    {
    	parent::render();
        
        $bodyContent = <<<EOT

{$this->topContent}
{$this->aboutContent}
{$this->bottomContent}

EOT;
        
        $this->Page->registerBodyContent($bodyContent);
    }
}

$Page->render(new Content());
?>
