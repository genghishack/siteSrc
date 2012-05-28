<div id="fileupload">
	<div id="stayinoneplace">
    <form action="/src/ajax/uploadimg.php" method="POST" enctype="multipart/form-data">
        <div class="fileupload-buttonbar">
            <label class="fileinput-button">
                <span>Add files...</span>
                <input type="file" name="files[]" multiple>
            </label>
            <button type="submit" class="start">Start upload</button>
            <button type="reset"  class="cancel">Cancel upload</button>
            <button type="button" class="delete">Delete files</button>
			<div class="close-btn ui-state-default ui-corner-all"><span class="ui-icon ui-icon-close"></span></div>
        </div>
    </form>
	</div>
    <div class="fileupload-content">
        <table class="files"></table>
        <div class="fileupload-progressbar"></div>
    </div>
</div>
