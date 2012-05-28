function sideNav()
{
	this.init();
}

sideNav.prototype.init = function()
{
	this._setEvents();
}

sideNav.prototype._setEvents = function()
{
	var that = this;

	$('#sideNav li').click(function(oEvent) {
		var elementClicked = $(oEvent.target).closest('li');
//		console.log(elementClicked.attr('view'));
		if ('' != elementClicked.attr('view')) {
			var view = elementClicked.attr('view') + '.php';
			location.href = view;
		}
		else {
			that._toggleSubNav(oEvent);
		}
	});
	
}

sideNav.prototype._toggleSubNav = function(oEvent)
{
	var elementClicked = $(oEvent.target).closest('li.level1');
	var elementToToggle = elementClicked.next('ul.level2');
	    elementToToggle.slideToggle(200);
}
