<?php 
require_once('src/php/Site.php');

class Content extends Layout2
{
    protected $name = 'admin_likedudeman_page';

    function __construct()
    {
        parent::__construct();
        $this->registerModule('admin_likedudeman');
        $this->registerModule('popover_imageUpload');
    }
    
    public function render()
    {
    	parent::render();

		$bodyContent = <<<EOT
		
{$this->topContent}
{$this->admin_likedudeman}
{$this->bottomContent}
{$this->popover_imageUpload}

EOT;
		
		$this->Page->registerBodyContent($bodyContent);
    }
}

$Page->render(new Content());
?>
