<?php 
require_once('src/php/Site.php');

class Content extends Layout2
{
    protected $name = 'index';

    function __construct()
    {
        parent::__construct();
        $this->registerModule('home');
    }
    
    public function render()
    {
    	parent::render();

		$bodyContent = <<<EOT
		
{$this->topContent}
{$this->home}
{$this->bottomContent}

EOT;
		
		$this->Page->registerBodyContent($bodyContent);
    }
}

$Page->render(new Content());
?>
