function admin_likedudeman_Class()
{
	this.init();
}

admin_likedudeman_Class.prototype.init = function()
{
	this.openUploader    = $('#admin_likedudeman a.openUploader');
	this.uploader        = $('#popover_imageUpload');
	this.thumbnails      = $('#admin_likedudeman .thumbnail img');
	this.thumbnailSelect = $('#admin_likedudeman .thumbnail a');
	this.arrows          = $('#admin_likedudeman .paginator .arrow a');
	this.pageSizeInput   = $('#admin_likedudeman .pagesize input');
	this.dateDrawnBrowse = $('#admin_likedudeman .browse .dateDrawn input');
	this.captionBrowse   = $('#admin_likedudeman .browse .caption textarea');
	this.position        = $('#admin_likedudeman .position input');
	this.deleteLink      = $('#admin_likedudeman .delete a');
	this.addLink         = $('#admin_likedudeman a.addRow');
	this.addButton       = $('#admin_likedudeman button.add');
	this.cancelButton    = $('#admin_likedudeman button.cancel');
	
	this.pageSizeDefault = 5;
	this.pageSize        = this.pageSizeInput.val();
	this.page            = 1;
	
	this.resetUI();
	this.setEvents();
}

admin_likedudeman_Class.prototype.resetUI = function()
{
	// These are things that need to be reset every time the module is reloaded.
	
	this.update    = null;
	this.deleteRow = null;
	this.insert    = null;
	
	$('#admin_likedudeman .dateDrawn input').datepicker({
		showOtherMonths: true,
		selectOtherMonths: true,
		dateFormat: 'm/d/yy',
		showOn: 'button',
		buttonImage: '/src/img/icon/calendar.png',
		buttonImageOnly: true
	});
}

admin_likedudeman_Class.prototype.setEvents = function()
{
	// display the image uploader popover
	this.openUploader.live('click', function(oEvent) {
		this.uploader.show();
	}.Context(this));
	
	// Show thumbnail image at full size in a lightbox
	this.thumbnails.live('click', this.showFullSizeImage.Context(this));

	// Select a thumbnail for use
	this.thumbnailSelect.live('click', this.selectThumbnail.Context(this));
	
	// pagesize input
	this.pageSizeInput.live('change', this.handlePageSizeChange.Context(this));
	
	// pagination arrows
	this.arrows.live('click', this.handlePagination.Context(this));

	// date change in browse view
	this.dateDrawnBrowse.live('change', this.handleDateChange.Context(this));
	
	//caption change in browse view
	this.captionBrowse.live('change', this.handleCaptionChange.Context(this));
	
	// position change
	this.position.live('change', this.handlePositionChange.Context(this));
	
	// delete row
	this.deleteLink.live('click', this.handleDeleteRow.Context(this));
	
	// add row - open list of thumbnails
	this.addLink.live('click', this.handleAddLink.Context(this));
	
	// actually add a record
	this.addButton.live('click', this.handleAddButton.Context(this));
	
	// oops, cancel that add
	this.cancelButton.live('click', this.handleCancelButton.Context(this));
}

admin_likedudeman_Class.prototype.showFullSizeImage = function(ev) 
{
	var el = $(ev.target);
	
	$('#lightBox .content').html(
		'<img src="' + el.attr('src') + '"/>'
	);
	
	Site.showLightBox();
}

admin_likedudeman_Class.prototype.handlePagination = function(ev) 
{
	var el = $(ev.target);
	
	if (el.attr('page') != '') {
		this.page = el.attr('page');
	}
	
	this.reloadModule();
}

admin_likedudeman_Class.prototype.handlePageSizeChange = function(ev) 
{
	var el = $(ev.target);
	
	if (isNaN(parseInt(el.val()))) {
		el.val(this.pageSizeDefault);
	}
	
	this.pageSize = parseInt(el.val());
	this.page = 1;
	
	this.reloadModule();
}

admin_likedudeman_Class.prototype.handleDateChange = function(ev)
{
	var el = $(ev.target);
	var row = el.parents('.row').first();
	
	this.update = {
		 rowId: row.attr('rowid')
		,field: 'date_drawn'
		,value: el.val()
	};
	
	this.reloadModule();
}

admin_likedudeman_Class.prototype.handleCaptionChange = function(ev)
{
	var el = $(ev.target);
	var row = el.parents('.row').first();

	this.update = {
		 rowId: row.attr('rowid')
		,field: 'caption_text'
		,value: el.val()
	};
		
	this.reloadModule();
}

admin_likedudeman_Class.prototype.handlePositionChange = function(ev)
{
	var el = $(ev.target);
	var row = el.parents('.row').first();
	
	this.update = {
		 rowId: row.attr('rowid')
		,field: 'sequence'
		,value: el.val()
	};
	
	this.reloadModule();
}

admin_likedudeman_Class.prototype.handleDeleteRow = function(ev)
{
	var el = $(ev.target);
	var row = el.parents('.row').first();
	
	this.deleteRow = row.attr('rowId');
	
	this.reloadModule();
}

admin_likedudeman_Class.prototype.handleAddLink = function(ev)
{
	this.insert = 'showImages';
	
	this.reloadModule();
}

admin_likedudeman_Class.prototype.selectThumbnail = function(ev)
{
	var el = $(ev.target);
	
	this.insert = 'showForm';
	this.imgSrc = el.parent().children('img').attr('src');
	
	this.reloadModule();
}

admin_likedudeman_Class.prototype.handleAddButton = function(ev)
{
	var thumbnail = $('#admin_likedudeman .form .thumbnail img');
	var dateDrawn = $('#admin_likedudeman .form .dateDrawn input');
	var caption   = $('#admin_likedudeman .form .caption textarea');

	var filename = thumbnail.attr('src').replace(/^.*[\\\/]/, '');
	
	this.insert = {
		 filename: filename
		,dateDrawn: dateDrawn.val()
		,caption: caption.val()
	};
	console.log(this.insert);
	this.reloadModule();
}

admin_likedudeman_Class.prototype.handleCancelButton = function(ev)
{
	this.insert = null;
	this.reloadModule();
}

admin_likedudeman_Class.prototype.reloadModule = function()
{
	var data = {
		 page: this.page
		,pagesize: this.pageSize
	};

	if (null != this.deleteRow) {
		
		data.action = 'delete';
		data.rowid = this.deleteRow;
	
	} else if (null != this.update) {
	
		data.action = 'update';
		data.rowid = this.update.rowId;
		data.field = this.update.field;
		data.value = this.update.value;

	} else if (null != this.insert) {

		if ('showImages' == this.insert) {
			data.action = 'showImages';
		} else if ('showForm' == this.insert) {
			data.action = 'showForm';
			data.image = this.imgSrc;
		} else {
			data.action = 'insert';
			data.thumbnail = this.insert.filename;
			data.date_drawn = this.insert.dateDrawn;
			data.caption = this.insert.caption;
		}
		
	}
	
	ajaxModule.load({
		module: 'admin_likedudeman',
		destination: '#contentContainer',
		data: data,
		empty: 1,
		loader: 1,
		callback: this.resetUI,
		context: this
	});
}

var admin_likedudeman = new admin_likedudeman_Class();
