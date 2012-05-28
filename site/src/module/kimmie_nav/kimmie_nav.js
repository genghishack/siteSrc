function kimmie_nav_Class()
{
	this.init();
}

kimmie_nav_Class.prototype.init = function()
{
	this.changeComicDivs = $('#kimmie_nav .changeComic');
	this.updateNav();
	this.setEvents();
}

kimmie_nav_Class.prototype.setEvents = function()
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

kimmie_nav_Class.prototype.updateNav = function(index)
{
	var firstDiv = $('#kimmie_nav .firstDiv');
	var prevDiv  = $('#kimmie_nav .prevDiv');
	var nextDiv  = $('#kimmie_nav .nextDiv');
	var lastDiv  = $('#kimmie_nav .lastDiv');
	
	var countIndexSpan = $('#kimmie_nav .countDiv .countIndex');
	
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

kimmie_nav_Class.prototype.changeComic = function(index)
{
	if ('' == index) {
		return false;
	} else {
		// ajax call to kimmie_panel module
		ajaxModule.load({
			module: 'kimmie_panel',
			destination: '#kimmie_main .comicPanelContainer',
			data: {
				comic: index
			},
			empty: 1,
			loader: 1
		});
	}
}
var kimmie_nav = new kimmie_nav_Class();
