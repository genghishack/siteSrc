<?php 
/*
 * The cool thing here is, that the form is going to submit to this script through an iframe.  This script
 * will process the form, then send a javascript response back, in the form of "top.admin_likedudeman.refreshModule" or
 * "top.ajaxModule.load('admin_likedudeman', '#admin_likedudeman_container')" or some such.
 * 
 * It's BRILLIANT, I tell you. :)
 */
require_once("{$_SERVER['DOCUMENT_ROOT']}/src/php/Site.php");

/*
 * Sample data:
 * 
 * $_POST = array (
 *  'date_drawn' => 'July 6, 2011',
 *  'title' => 'This is a title',
 *  'caption' => 'This is a caption',
 *  'makeItSo' => '',
 * )
 * 
 * $_FILES = array (
 *  'name' => 'dudeman 14.tiff',
 *  'type' => 'image/tiff',
 *  'tmp_name' => '/Applications/MAMP/tmp/php/phpSZsVTK',
 *  'error' => 0,
 *  'size' => 1054098,
 * )
 */

?>
