function popover_imageUpload_Class()
{
	this.init();
}

popover_imageUpload_Class.prototype.init = function()
{
	this.module = $('#popover_imageUpload');
	this.closeBtn = $('#popover_imageUpload .close-btn');
	
	// Make the popover draggable
	this.module.draggable();
	
	// Initialize the jQuery File Upload widget:
	$('#fileupload').fileupload();

    // Load existing files:
    // The getJSON call gets a json-formatted list of file objects from the upload directory,
    // then passes them to a function.
    $.getJSON(
		$('#fileupload form').prop('action'), 
		function (files) {
			// Apparently this data property is created and fleshed out
			// by the file upload plugin.  
			var fu = $('#fileupload').data('fileupload');
//			console.log(fu);
			fu._adjustMaxNumberOfFiles(-files.length);
			fu._renderDownload(files)
				.appendTo($('#fileupload .files'))
            	.fadeIn(function () {
            		// Fix for IE7 and lower:
            		$(this).show();
    		});
		}
	);
    
    this.setEvents();
}

popover_imageUpload_Class.prototype.setEvents = function()
{
	// Open download dialogs via iframes,
	// to prevent aborting current uploads:
	// (I don't quite understand why it does this, but this event doesn't apply to
	// the way image links are currently rendered - all are target=_blank, so they 
	// open in a new window.  changing this selector so that it gets all the links
	// causes them to open in an iframe, but it's invisible, so I don't quite see
	// the point.  Yet.)
	$('#fileupload .files a:not([target^=_blank])').live('click', function (e) {
		e.preventDefault();
		$('<iframe style="display:none;"></iframe>')
			.prop('src', this.href)
			.appendTo('body');
	});
	
	// Close button event
	this.closeBtn.live('click', function(oEvent) {
		this.module.hide();
	}.Context(this));
}

var popover_imageUpload = new popover_imageUpload_Class();