<?php
require('../../src/php/Site.php');

$username = (isset($_REQUEST['username'])) ? $_REQUEST['username'] : false;
$password = (isset($_REQUEST['password'])) ? $_REQUEST['password'] : false;

$response = array();

if ($username && $password) {
	if ($User->authenticate($username, $password))
	{
		$response['success'] = true;
	}
	else {
		$response['success'] = false;
		$response['msg'] = 'Bad username or password';
	}
}
else {
	$response['success'] = false;
	if (!$username) {
		$response['msg'] = 'no username';
	}
	elseif (!$password) {
		$response['msg'] = 'no password';
	}
}

/*
 * response:
 * {
 *     success: true | false,
 *     msg: 'bad password' | 'no password' | 'bad username' | 'no username' | 'error'
 * }
 */
echo (json_encode($response));
?>