<?php 
require('src/php/class/Site.php');

class Content extends Template
{
    protected $name = 'contact';

    function __construct()
    {
        parent::__construct();
        $this->registerModule('contactContent');
    }
    
    public function render()
    {
    	parent::render();
        
        $bodyContent = <<<EOT

{$this->topContent}
{$this->contactContent}
{$this->bottomContent}

EOT;
        
        $this->Page->registerBodyContent($bodyContent);
    }
}

$Page->render(new Content());
?>
