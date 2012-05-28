function comic_nav_Class()
{
	this.init();
}

comic_nav_Class.prototype.init = function()
{
	this.changeComicDivs = $('#comic_nav .changeComic');
	this.updateNav();
	this.setEvents();
}

comic_nav_Class.prototype.setEvents = function()
{
	// change Comic events
	this.changeComicDivs.live('click', function(oEvent) {
		var elementClicked = $(oEvent.target);
		
		if (!elementClicked.attr('val'))
		{
			elementClicked = elementClicked.parent('div');
		}
		
		var sequence = elementClicked.attr('val');
		
		if (!elementClicked.hasClass('inactive')) {
			this.changeComic(sequence);
			this.updateNav(sequence);
		}
	}.Context(this));
}

comic_nav_Class.prototype.updateNav = function(index)
{
	var firstDiv = $('#comic_nav .firstDiv');
	var prevDiv  = $('#comic_nav .prevDiv');
	var nextDiv  = $('#comic_nav .nextDiv');
	var lastDiv  = $('#comic_nav .lastDiv');
	
	var countIndexSpan = $('#comic_nav .countDiv .countIndex');
	
	var nFirstInSequence   = firstDiv.attr('val');
	var nLastInSequence    = lastDiv.attr('val');
	var nCurrentInSequence = countIndexSpan.html();
	
	if (null == index)
	{
		index = nCurrentInSequence;
	}
	this.changeComicDivs.removeClass('inactive');
	
	countIndexSpan.html(index);
	
	prevDiv.attr('val', parseInt(index) - 1);
	nextDiv.attr('val', parseInt(index) + 1);
	
	if (nFirstInSequence == index) {
		firstDiv.addClass('inactive');
		prevDiv.addClass('inactive');
	}
	else if (nLastInSequence == index) {
		nextDiv.addClass('inactive');
		lastDiv.addClass('inactive');
	}
}

comic_nav_Class.prototype.changeComic = function(index)
{
	if ('' == index) {
		return false;
	} else {
		// ajax call to comic_panel module
		ajaxModule.load({
			module: 'comic_panel',
			destination: '#comic .comicPanelContainer',
			data: {
				comic: index
			},
			empty: 1,
			loader: 1
		});
	}
}
var comic_nav = new comic_nav_Class();
