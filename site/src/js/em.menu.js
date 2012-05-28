var EM = EM || {};

EM.setupMenu = function () {
    $('#resorts a').mouseenter(
    function () {
        $('#resorts-nav').show();
        //
        return false;
    });
    $('#resorts-nav').hover(function () { $('#resorts a').addClass('drop'); }, function () { $('#resorts a').addClass('drop'); });
    $('#resorts a').mouseleave(
    function () {
        $('#resorts-nav').hide();
        return false;
    });
    $('#resorts').hover(
		function () { return false; }
	);

    $('#resorts-nav').hover(function () {
        $('#drop-down').toggleClass('drop');
    });
    var url = document.location.href.toLowerCase();
    if ((document.location.pathname == '/' || url.match(/\/home\.aspx/)) && !url.match(/\/kids\//)) { $("#home").addClass("active"); }
    if (url.match(/\/dashboard\//) || url.match(/\/epicmix\/welcome\.aspx/)) { $("#dashboard").addClass("active"); }
    if (url.match(/\/epicmix-photos\.aspx/)) { $("#photos").addClass("active"); }
    if (url.match(/\/epicmix-pins\.aspx/)) { $("#pins").addClass("active"); }
    if (url.match(/\/leaderboard\.aspx/)) { $("#leaderboard").addClass("active"); }
    if (url.match(/\/activity\//)) { $("#resorts").addClass("active"); }
    if (url.match(/\/kids\//)) { $("#kids").addClass("active"); }
    if (url.match(/\/faq\.aspx/)) { $("#faq").addClass("active"); }
    if (url.match(/\/contest\.aspx/)) { $("#contest").addClass("active"); }
    if (url.match(/\/my-dashboard\.aspx/)) { $("#my-dashboard").addClass("active"); }
    if (url.match(/\/user-profile\.aspx/)) { $("#userdashboard").addClass("active"); }
    if (url.match(/\/user-photos\.aspx/)) { $("#userphotos").addClass("active"); }
    if (url.match(/\/user-pins\.aspx/)) { $("#userpins").addClass("active"); }
    if (url.match(/\/user-friends\.aspx/)) { $("#userfriends").addClass("active"); }
    if (url.match(/\/my-photos\.aspx/)) { $("#my-photos").addClass("active"); }
    if (url.match(/\/my-photos-day\.aspx/)) { $("#my-photos").addClass("active"); }
    if (url.match(/\/my-photo-detail\.aspx/)) { $("#my-photos").addClass("active"); }
    if (url.match(/\/my-pins\.aspx/)) { $("#my-pins").addClass("active"); }
    if (url.match(/\/my-friends\.aspx/)) { $("#my-friends").addClass("active"); }
    if (url.match(/\/my-family\.aspx/)) { $("#my-family").addClass("active"); }
    if (url.match(/\/my-leaderboard\.aspx/)) { $("#my-leaderboard").addClass("active"); }
    if (url.match(/\/settings\.aspx/)) { $("#epicmix-settings").addClass("active"); }
    if (url.match(/\/beavercreek\.aspx/)) { $("#canvas-content h3").html("Beaver Creek"); }
};