<?php 
require_once('src/php/Site.php');

class Content extends Layout2
{
    protected $name = 'likedudeman';

    function __construct()
    {
        parent::__construct();
        
        $this->registerModule('comic');
    }
    
    public function render()
    {
    	parent::render();

		$bodyContent = <<<EOT
		
{$this->topContent}
{$this->comic}
{$this->bottomContent}

EOT;
		
		$this->Page->registerBodyContent($bodyContent);
    }
}

$Page->render(new Content());
?>
