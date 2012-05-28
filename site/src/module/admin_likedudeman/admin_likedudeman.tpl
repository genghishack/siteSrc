{if $admin_likedudeman.view == 'browse'}

<div class="browse">
	<a class="addRow" href="javascript:void(0);">Add a Row</a>
	<br/><br/>
	<div class="pagesize">
		Show this many:
		<input type="text" value="{$admin_likedudeman.pageSize}" maxlength="2"/>
	</div>
	
	<div class="paginator contain">
		<div class="arrow">
			<a class="prev" page="{$admin_likedudeman.prevPage}" href="javascript:void(0);">&lt;</a>
		</div>
		<div class="description">
			<span class="min">{$admin_likedudeman.minCount}</span>
			to
			<span class="max">{$admin_likedudeman.maxCount}</span>
			of
			<span class="total">{$admin_likedudeman.totalCount}</span>
		</div>
		<div class="arrow">
			<a class="next" page="{$admin_likedudeman.nextPage}" href="javascript:void(0);">&gt;</a>
		</div>
	</div>
	
	{foreach $admin_likedudeman.rRows as $Row}
	<div class="row contain" rowid="{$Row->id}">
		<div class="cell position">
			<input type="text" 
			       value="{$Row->sequence}" 
				   orig_value="{$Row->sequence}"
			/>
		</div>
		<div class="cell dateDrawn">
			<input type="text" 
			       value="{$Row->date_drawn->format('m/d/Y')}" 
			/>
		</div>
		<div class="cell caption">
			<textarea>{$Row->caption_text}</textarea>
		</div>
		<div class="cell thumbnail">
			<img src="/src/files/likedudeman/{$Row->filename}"/>
		</div> 
		<div class="cell delete">
			<a href="javascript:void(0);">delete</a>
		</div>
	</div>
	{/foreach}
</div>

{elseif $admin_likedudeman.view == 'thumbnails'}

<div class="thumbnails">
	<a class="openUploader" href="javascript:void(0);">Open Uploader</a>
	<br/><br/>
	
	{foreach from=$admin_likedudeman.thumbnails item=src name=thumbnail}
	{if $smarty.foreach.thumbnail.first}
	<div class="row contain">
	{elseif $smarty.foreach.thumbnail.index % 6 == 0}
	</div>
	<div class="row contain">
	{/if}
		<div class="cell thumbnail">
			<a href="javascript:void(0);">select</a>
			<br/>
			<img src="/src/files/likedudeman/{$src}"/>
		</div> 
	{if $smarty.foreach.thumbnail.last}
	</div>
	{/if}
	{foreachelse}
	There are no unused images.  Try uploading some more.
	{/foreach}
</div>

{elseif $admin_likedudeman.view == 'form'}

<div class="form">
	<div class="thumbnail">
		<img src="{$admin_likedudeman.thumbnail}"/>
	</div>
	<div class="inputFields">
		<div class="dateDrawn">
			<input type="text"
			       value="{$admin_likedudeman.date}"/>
		</div>
		<div class="caption">
			<textarea></textarea>
		</div>
	</div>
	<div class="buttons">
		<button class="add">Add</button>
		<button class="cancel">Cancel</button>
	</div>
</div>

{/if}
<!--
<div class="comic_preview">
	Image Preview<br/>
	(Future Functionality)
</div>

<div class="comic_form">
	
	<form id="admin_likedudeman_form" 
	      action="/src/ajax/uploadimg.php" 
	      method="POST" 
	      enctype="multipart/form-data"
	      target="admin_likedudeman_iframe">
	
	<div class="form_inputSet contain">
		<label class="label_file" for="input_file">File</label>
		<input class="file" name="file" id="input_file" type="file"/>
	</div>
	
	<div class="form_inputSet contain">
		<label class="label_date_drawn" for="input_date_drawn">Date Drawn</label>
		<input class="date" name="date_drawn" id="input_date_drawn" type="text"/>
	</div>
	
	<div class="form_inputSet contain">
		<label class="label_title" for="input_title">Title</label>
		<input class="text" name="title" id="input_title" type="text"/>
	</div>
	
	<div class="form_inputSet contain">
		<label class="label_caption" for="input_caption">Caption</label>
		<textarea name="caption" id="input_caption"></textarea>
	</div>
	
	<button class="submit" name="makeItSo" id="input_makeItSo">Make It So</button>
	
	</form>
	
	<iframe id="admin_likedudeman_iframe" 
	        name="admin_likedudeman_iframe"
	        src=""></iframe>
</div>
-->