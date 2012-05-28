<?php
/*
 * $Id: Site.php 71 2012-01-03 14:02:45Z genghishack $
 *
 * @author Chris Wade <chrisw@intermundomedia.com>
 *
 * This is basically a configuration file for the site.  The parent Site_Class acts as
 * a bootstrap, grabbing anything required that's not declared here.  Each project that
 * uses this framework must have this Site.php file configured for the project.
 */

// TODO: Improve the browser detection logic for Site_1.1

// If a user tries to navigate directly to this file, they get redirected to the index page
if (strpos($_SERVER['REQUEST_URI'], 'Site.php')) {
	header ("Location: /index.php");
}

// If you want to override the default versions of the version-numbered
// library files required by the parent Site_Class, put them BELOW this line:

// For example:
// require_once ('php/classes/Page/Page_2.1.php');

// But ABOVE this line.  The parent Site_Class needs to be included after
// the overrides in order for them to work.  If you're fine with using the
// default versions of the parent classes, or you don't know what I'm talking
// about, ignore this.
require_once ('/var/www/lib/php/Site/Site_Class.php');

class Site extends Site_Class
{
	protected $blnDebug         = true;
	protected $blnShowComments  = true;
	protected $blnIsFacebookApp = false;
	protected $blnNoCache       = true;

	protected $strTitle = 'siteSrc';
	
	protected $dbUser = 'siteSrc';
	protected $dbPass = 'siteSrc';
	protected $dbName = 'siteSrc';
	protected $dbHost = 'localhost';
	protected $dbPort = '3306';
	
	public $arrPerformance = array();

	/**
	 * extension of getRequiredFiles
	 *
	 * include any addional classes here that are dependent on having the main
	 * framework classes included first.  If there are no dependencies, you can
	 * include them up above the class declaration.
	 *
	 * @return void
	 */
	protected function getRequiredFiles()
	{
		set_include_path('.' . PATH_SEPARATOR . '/var/www/lib' . PATH_SEPARATOR . get_include_path());

		parent::getRequiredFiles();

		require_once ('php/UserActions.php');
		
		require_once ('layout/Layout1.php'); 
		require_once ('layout/Layout2.php'); 
	}
	
	public function init()
	{
		parent::init();
		
		$this->registerUser();
	}
	
	protected function registerUser()
	{
		$this->registerPerformance('Site registerUser()');
		
		global $User;
		
		if (class_exists('UserActions'))
		{
			$User = new UserActions();
		}
		
		$this->registerPerformance('Site registerUser()', 'stop');
	}
	
	public function registerCKEditor()
	{
		$this->Page->registerJsFile('http://lib/vendor/cksource/ckeditor_3.6.1/ckeditor.js');
		$this->Page->registerJsFile('http://lib/vendor/cksource/ckeditor_3.6.1/adapters/jquery.js');
	}
	
}

$Site = new Site();
$Site->init();  // This has to be done here rather than in the constructor.
                // $Site will not be properly registered in the $GLOBALS array until its object is finished instantiating,
                // and the other objects that will be registered in this step need to be able to find it there.
?>
