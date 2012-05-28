<?php
require('../../src/php/Site.php');

$response = array();

if ($User->logout())
{
	$response['success'] = true;
}
else {
	$response['success'] = false;
}

/*
 * response:
 * {
 *     success: true | false,
 * }
 */
echo (json_encode($response));
?>