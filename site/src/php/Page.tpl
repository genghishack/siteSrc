{$Page.docType}
{$Page.htmlTag}
<head>
	
<title>{$Page.title}</title>

<!-- Meta Tags -->
{foreach $Page.metaTags as $metaTag}
<meta
{foreach $metaTag as $attr}
	{$attr@key}="{$attr}"
{/foreach}
/>
{/foreach}
<!-- /Meta Tags -->

<!-- CSS Files -->
{foreach $Page.cssFiles as $cssFile}
<link 
	type="text/css"
	rel="stylesheet"
{foreach $cssFile as $attr}
	{$attr@key}="{$attr}"
{/foreach}
/>
{/foreach}
<!-- /CSS Files -->

<!-- Trailing CSS -->
<style>
{foreach $Page.cssTrailing as $cssLine}
{$cssLine}
{/foreach}	
</style>
<!-- /Trailing CSS -->

</head>

<body class="{$Page.browserClass}">

{$Page.bodyContent}

    <div id="fb-root"></div>
    <div id="overlay"></div>
    <div id="loaderMask"></div>
	<div id="lightBox">
		<div class="content contain"></div>
	</div>
	
<!-- Leading JS -->	
{foreach $Page.jsLeading as $jsLine}
{$jsLine}
{/foreach}
<!-- /Leading JS -->

{foreach $Page.jsFiles as $jsFile}
<script type="text/javascript"
{foreach $jsFile as $attr}
	{$attr@key}="{$attr}"
{/foreach}
>
</script>
{/foreach}

<!-- Trailing JS -->
<script type="text/javascript">
{foreach $Page.jsTrailing as $jsLine}
{$jsLine}
{/foreach}
</script>
<!-- /Trailing JS -->

<!-- NoScript -->
<noscript>
{foreach $Page.noScript as $noScriptLine}
{$noScriptLine}
{/foreach}
</noscript>
<!-- /NoScript -->

</body>
</html>
