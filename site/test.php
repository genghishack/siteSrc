<?php 
$line = '<a href="/users/1234" target="foofoo">Edit Homer\'s profile</a>';

$line = preg_replace('/href="\/(.*)"/', 'href="http://www.visionlink.org/$1" target="_blank"', $line);

echo "<pre>$line</pre>";



// $names needs to be an array since you're using it in a foreach loop below.
$names = array('Homer');

// User is a class and therefore needs to be instantiated, not called like a function.  
// In addition, this line is probably unnecessary because the variable $user is being 
// used again in the foreach loop to re-instantiate the class with an id.
$user = new User();

foreach($names as $name)
{
	// reverse the single and double quotes in order for the var to interpolate properly
	$db->query("select id from user where first_name = '$name'");

	$id = $db->get_result();

	// Again, instantiate with new
	$user = new User($id);

	// escape the single quote in "User's"
	print 'User\'s full name is ' . $user->first_name . ' ' . $user->last_name . '<br />';
	
	// Alternatively, you could replace that last line with this one.
	// The curly braces aren't strictly necessary in this case, but I use them for readability.
	print "User's full name is {$user->first_name} {$user->last_name}<br />";
}

?>
