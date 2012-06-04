function topNav()
{
	this.init();
}

topNav.prototype.init = function()
{
	this._setEvents();
}

topNav.prototype._setEvents = function()
{
	var that = this;

	$('#topNav li').click(function(oEvent) {
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

topNav.prototype._toggleSubNav = function(oEvent)
{
	var elementClicked = $(oEvent.target).closest('li.level1');
	var elementToToggle = elementClicked.next('ul.level2');
	    elementToToggle.slideToggle(200);
}
