<div id="Debug">
	<div class="inner">
		
		<div id="VarDisplay">
			{foreach $DebugVars as $var}
			<div class="item">
				<div class="title">{$var@key}</div>
				<div class="var" style="display:{if $var['expand'] eq true}block{else}none{/if};"><pre>{$var['data']}</pre></div>
			</div>
			{/foreach}
		</div>
		
		<table id="Performance">
			<thead>
			<caption>Performance</caption>
			<tr>
				<th class="action">Action</th>
				<th class="start">Start Time</th>
				<th class="stop">Stop Time</th>
				<th class="total">Total</th>
			</tr>
			</thead>
			<tbody>
			{foreach $Performance as $Item}
			<tr>
				<td class="action">{$Item@key}</td>
				<td class="start">{$Item.start}</td>
				<td class="stop">{$Item.stop}</td>
				<td class="total">{$Item.total}</td>
			</tr>
			{/foreach}
			</tbody>
		</table>
		
		<table id="CompInfo">
			<thead>
			<caption>Your Computer</caption>
			</thead>
			<tbody>
			<tr>
				<td>
					{$CompInfo}
					</p>
				</td>
			</tr>
			<tr>
				<td>
					<script type="text/javascript">
						client_data('width');
					</script>
				</td>
			</tr>
			<tr>
				<td>
					<h4>JavaScript</h4>
					<script type="text/javascript">
						client_data('js');
					</script>
					<noscript>
						<p class="right-bar">JavaScript is disabled</p>
					</noscript>
				</td>
			</tr>
			<tr>
				<td>
					<script type="text/javascript">
						client_data('cookies');
					</script>
				</td>
			</tr>
			</tbody>
		</table>
			
	</div>
</div>
