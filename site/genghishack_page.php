<?php 
require_once('src/php/Site.php');

class Content extends Layout2
{
    protected $name = 'genghishack_page';

    function __construct()
    {
        parent::__construct();
        $this->registerModule('genghishack');
    }
    
    public function render()
    {
    	parent::render();

		$bodyContent = <<<EOT
		
{$this->topContent}
{$this->genghishack}
{$this->bottomContent}

EOT;
		
		$this->Page->registerBodyContent($bodyContent);
    }
}

$Page->render(new Content());
?>
