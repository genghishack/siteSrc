/*
 * header.js
 */
function header_Class()
{
	this.init();
}

header_Class.prototype.init = function()
{
	this.loginShowHideSpeed = 500;
	this._setEvents();
}

header_Class.prototype._setEvents = function()
{
	$('#header .logo').click(function() {
		location.href = Site.baseUrl;
	});
	
	$('#header .menuItem').click(function(oEvent) {
		this._handleMenuItem(oEvent);
	}.Context(this));
	
	// Click event on the login Submit button. Using an id, for now.
	$('#hdrLoginSubmit').click(this._handleLoginSubmit.Context(this));
	
	// Pressing 'return' when in one of the login fields causes the form to submit.
	$('#hdrUsername, #hdrPassword, #hdrLoginSubmit').keyup(function(oEvent) {
			if (oEvent.keyCode == '13') {
				this._handleLoginSubmit(oEvent);
			}
		}.Context(this)
	);
	
	// When the screen is clicked anywhere but inside the login area, the login box should disappear.
	$('body').click(function(oEvent) 
		{
			var clickedItem = $(oEvent.target);

			if (clickedItem.hasClass('login')
			||  clickedItem.hasClass('loginDiv')
			||  clickedItem.parents('.loginDiv').length) 
			{
				return false;
			}
			else 
			{
				$('#header .loginDiv').hide(this.loginShowHideSpeed);
			}
		}
	);
}

header_Class.prototype._handleMenuItem = function(oEvent)
{
	var itemClicked = $(oEvent.target);
	
	if (itemClicked.attr('view')) 
	{
		location.href = Site.baseUrl + '/' + itemClicked.attr('view') + '.php';
	}
	
	if (itemClicked.attr('action'))
	{
		switch (itemClicked.attr('action'))
		{
		case 'login':
			// Display the login div.
			$('#header .loginDiv').show(this.loginShowHideSpeed);
			break;
			
		case 'logout':
			this._handleLogout();
			break;
			
		default:
			
		}
	}
}

header_Class.prototype._handleLoginSubmit = function(oEvent)
{
	
	// This is an AJAX script call to authenticate the user and establish login status.
	$.ajax({
		url : Site.baseUrl + '/src/ajax/login.php',
		data : {
			username : $('#hdrUsername').val(),
			password : $('#hdrPassword').val()
		},
		dataType : 'json',
		success : function(response) 
		{
			// If the login succeeds, reload the current page.
			if (response.success) 
			{
				location.reload();
			}
			// If the login fails, display the error.
			else 
			{
				alert(response.msg);
			}
		}
	});
}

header_Class.prototype._handleLogout = function()
{
	// Log the user out and redirect to the main page.
	$.ajax({
		url : Site.baseUrl + '/src/ajax/logout.php',
		dataType: 'json',
		success: function() {
			location.href = Site.baseUrl;
		}
	});
}
