<?php 
require_once('src/php/Site.php');

class Content extends Layout2
{
    protected $name = 'editable';

    function __construct()
    {
        parent::__construct();
        $this->registerModule('editPage');
    }
    
    public function render()
    {
    	parent::render();

		$bodyContent = <<<EOT
		
{$this->topContent}
{$this->editPage}
{$this->bottomContent}

EOT;
		
		$this->Page->registerBodyContent($bodyContent);
    }
}

$Page->render(new Content());
?>
