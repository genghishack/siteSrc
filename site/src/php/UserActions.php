<?php

class UserActions
{
	/*
	 * TODO:
	 * createUser() - with public account creation page
	 * deleteUser() - with admin page
	 * updateUser() - with user account page
	 * 
	 * "lost password" functionality (means storing email address)
	 * 
	 * Standardized error messages - store in constants
	 */
	
	// I need to learn how to use those magic __get and __set methods.
	
	// Declare properties
	protected $userID;
	protected $userName;
	protected $groupID;
	public $Model;
	
	public function __construct()
	{
		global $Site;
		
		session_start();

		$this->init();
		
		$this->checkSession(); // Checks to see if the user is already logged in
	}
	
	protected function init()
	{
		$this->userID = 0; // Guest (normal, non-logged in) user
		$this->userName = '';
		// We don't remove the 'isLoggedIn' Session variable in the init because it needs to remain
		// so we can check the session after init'ing.  
	}
	
	// Wrapper for init()
	public function logout()
	{
		$this->init();
		
		// Other stuff can go here about removing session variables, etc.
		unset($_SESSION['isLoggedIn']);
		
		// returning true for now, because there's nothing to error handle.
		return true;
	}
	
	public function createUser($oArgs = array())
	{
		// needs to check to see if user exists
	}
	
	public function deleteUser($id = null)
	{
		// needs to delete dependencies as well
	}
	
	protected function checkSession()
	{
//		echo "what?";
//		print_r($_SESSION);
		if (isset($_SESSION['userID']) && isset($_SESSION['isLoggedIn']))
		{
//			echo "huh?";
			if (!$user = User::find($_SESSION['userID']))
			{
//				echo "there";
//				unset($_SESSION['userID']); // We can't find the user, so get rid of the userID session variable.
				$this->init(); // return to logged-out state
				// TODO: This doesn't really work, because it still looks like the user is logged in.
				// (user menu persists as logged-in view)
			}
			else {
//				echo "here";
				// set the username and ID
				$this->userID = $_SESSION['userID'];
				$this->userName = $user->username;
				$this->email = $user->email;
				$this->groupID = $user->group_id;
				$_SESSION['isLoggedIn'] = true;
			}
		}
	}
	
	public function getID() 
	{
		return $this->userID;
	}
	
	public function getName()
	{
		return $this->userName;
	}
	
	public function isLoggedIn()
	{
		return (isSet($_SESSION['isLoggedIn'])) ? $_SESSION['isLoggedIn'] : false;
	}
	
	public function checkUserExists($username = '')
	{
		if ('' == trim($username))  {
			// TODO: error handling for no username.
			// I need some standard response codes set to constants.
		}
		return User::first(array(
			'conditions' => array(
				'username = ?', $username
			)
		));
	}
	
	public function authenticate($username = '', $password = '')
	{
		$user = null;
		
		if ('' == trim($username)) {
			// TODO: error handling for no username.
			// although, they shouldn't get here without one.
			return false;
		}
		elseif('' == trim($password)) {
			// TODO: error handling for no password
			// although, they shouldn't get here without one.
			return false;
		}
		
		if ($this->checkUserExists($username))
		{
			$user = User::first(array(
				'conditions' => array(
					'username = ? AND password = ?', $username, md5($password)
				)
			));
		}

		if (null == $user) {
			/** 
			 * There should be some message here telling the user that they failed to log in.  FAILED.
			 * 
			 * And the messaging should be specific to whether the username or the password was invalid,
			 * which means the query should be more specific.  First do a count(*) where username = 'foo'
			 * on the table, to find out if the user exists.  If it doesn't, the message is that the username
			 * is incorrect.  If the user exists, do the above query.  If it fails then, they've mistyped their
			 * password.  Tie this all in with lost user/pass functionality.  Which means I need an email
			 * address field, and functionality to mail the user their username or password.
			 */
			return false;
		}
		else 
		{
			$this->userID	= $user->id;
			$this->userName	= $user->username;
			$this->email	= $user->email;
			$this->groupID	= $user->group_id;
			
			/*
			 * Store the user's ID in the session and the fact that they're logged in.
			 * We may want to have access to the user's id later, when they're not logged in.
			 * So when the user logs out, we won't erase the session variable with the user's id, 
			 * just the one that says they're logged in...
			 */ 
			$_SESSION['userID'] = $this->userID;
			
			$_SESSION['isLoggedIn'] = true;
			
			return true;
		}
	}
	
	public function hasAccess($groupName)
	{
		/* 
		 * This is a stand-in for future functionality.  
		 * 
		 * In future, this will be a more complex process of checking the permissions of the user's group.
		 * Access requests will also be more complex, having to do more with the object making the request and
		 * whether or not the user's group has permission to access that object.
		 * 
		 * For now, we just check to see if the user is in the requested group.  Groups get requested
		 * by name but are stored in the user table as group id.  Therefore we check to see if the requested
		 * group name matches the user's group id, in the group table.
		 * 
		 * TODO: make it so that the get function can take its parameters as single strings or as arrays.
		 */
		
		if ($this->isLoggedIn()) 
		{
			$group = Group::find($this->groupID);
			
			if ($group->name == $groupName)
			{
				return true;
			}
			else 
			{
				return false;
			}
		}
	}
}
?>
