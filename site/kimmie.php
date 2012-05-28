<?php 
require_once('src/php/Site.php');

class Content extends Layout2
{
    protected $name = 'kimmie';

    function __construct()
    {
        parent::__construct();
        
        $this->registerModule('kimmie_main');
    }
    
    public function render()
    {
    	parent::render();

		$bodyContent = <<<EOT
		
{$this->topContent}
{$this->kimmie_main}
{$this->bottomContent}

EOT;
		
		$this->Page->registerBodyContent($bodyContent);
    }
}

$Page->render(new Content());
?>
