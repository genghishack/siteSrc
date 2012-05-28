<?php
/*
 * jQuery File Upload Plugin PHP Example 5.2.3
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://creativecommons.org/licenses/MIT/
 */

error_reporting(E_ALL | E_STRICT);

require_once("{$_SERVER['DOCUMENT_ROOT']}/src/php/UploadHandler.php");

$upload_handler = new UploadHandler(array(
	'upload_dir' => $_SERVER['DOCUMENT_ROOT'].'/src/files/likedudeman/',
	'upload_url' => '/src/files/likedudeman/',
	'image_versions' => array(
		'thumbnail' => array(
			'upload_dir' => $_SERVER['DOCUMENT_ROOT'].'/src/files/thumbnails/',
			'upload_url' => '/src/files/thumbnails/',
			'max_width' => 80,
			'max_height' => 80
		)
	)
));

header('Pragma: no-cache');
header('Cache-Control: private, no-cache');
header('Content-Disposition: inline; filename="files.json"');
header('X-Content-Type-Options: nosniff');

switch ($_SERVER['REQUEST_METHOD']) {
    case 'HEAD':
    case 'GET':
        $upload_handler->get();
        break;
    case 'POST':
        $upload_handler->post();
        break;
    case 'DELETE':
        $upload_handler->delete();
        break;
    default:
        header('HTTP/1.0 405 Method Not Allowed');
}
?>