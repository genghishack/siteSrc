var EM = EM || {};
EM.homepage = EM.homepage || {};

EM.feedUrl = '/VailResorts/sites/epicmix/api/Feed/AllMountain.ashx?PageSize=12&Page=1';

EM.homepage.init = function (cacheRefresh) {
    var refreshCache = "";
    if (cacheRefresh) {
        refreshCache = "&refreshCache=true";
    };
    // Main feed
    $("ul.homefeed").empty();
    $("ul.homefeed").append('<li class="loading"></li>');
    $.ajax({
        type: "POST",
        url: EM.feedUrl + refreshCache,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: EM.homepage.FeedSuccess,
        error: EM.homepage.FeedError
    });

    // Stats feed
    var pinCount = $('#Stats .pins span');
    var photoCount = $('#Stats .photos span');
    $.ajax({
        type: 'POST',
        url: '/VailResorts/sites/epicmix/api/Stats/TodayStats.ashx',
        async: true,
        timeout: 10000,
        dataType: 'json',
        success: EM.homepage.StatsSuccess,
        error: EM.homepage.StatsError
    });

}

EM.homepage.StatsSuccess = function (data, response) {

    // Static data - remove these lines to use the actual feed
    // data.TotalPinsAwarded = 123457658;
    // data.TotalPhotosCaptured = 97478765;
    // data.TotalPoints = 37868454;
    // End Static data

    var elPinCount = $('#Stats .pins span');
    var elPhotoCount = $('#Stats .photos span');
    var elPointCount = $('#Stats .points');

    var sPinCount = EM.utilities.addCommas(data.TotalPinsAwarded);
    var sPhotoCount = EM.utilities.addCommas(data.TotalPhotosCaptured);
    var sPointCount = EM.utilities.addCommas(data.TotalPoints);
    var rPointCount = sPointCount.split('');

    elPinCount.html(sPinCount);
    elPhotoCount.html(sPhotoCount);

    elPointCount.removeClass('small');
    if (11 < sPointCount.length) {
        elPointCount.addClass('small');
    }

    elPointCount.html('');
    $('#digitCounter').tmpl({ digits: rPointCount }).appendTo(elPointCount);

}

EM.homepage.StatsError = function (data, response) {
    $('#Stats li.points').html(response.status);
}

EM.homepage.FeedSuccess = function (data, response) {
    $("ul.homefeed li.loading").remove();
    $("#homeTemplate").tmpl(data).appendTo("ul.homefeed");

    var nVerticalFeet = 0;
    for (var i = 0; i < data.List.length; i++) {
        if (data.List[i].FeedType == 'Total Vertical Feet') {
            nVerticalFeet = data.List[i].VerticalFeet;
            break;
        }
    }
    // dummy data - remove or comment to use live feed
    // var nVerticalFeet = 123456789;

    var sVerticalFeet = EM.utilities.addCommas(nVerticalFeet);
    var rVerticalFeet = sVerticalFeet.split('');

    $('#feedWrap .vert').removeClass('small');
    if (11 < sVerticalFeet.length) {
        $('#feedWrap .vert').addClass('small');
    }
    var counterWrap = $('#feedWrap .vert .counterWrap');
    counterWrap.html('');
    $('#digitCounter').tmpl({ digits: rVerticalFeet }).appendTo(counterWrap);
    var counterWidth = 0;
    counterWrap.children().each(function (index, el) {
        counterWidth += $(el).outerWidth();
        if ($(el).hasClass('comma')) {
            counterWidth += 1;
        }
    });
    counterWrap.width(counterWidth);

    var $li = $(".homefeed li").css('opacity', '0');
    var items = [];

    $($li).each(function () {
        items.push($(this));
    })

    function animate() {
        $elem = items.shift();
        $elem.animate({
            opacity: 1
        }, 100);
        if (items.length) {
            setTimeout(animate, 100);
        }
    }
    animate();
};

EM.homepage.FeedError = function(data, response) {
    $("ul.homefeed").html(response.status);
};

EM.checkQueryStrings = function () {
    var strUrl = new String(document.location);
    var arrUrl = EM.utilities.splitUrlVars(strUrl);

    if (arrUrl['pass'] == 'enabled') {
        EM.utilities.addOverlay('.EpicMixEnabled');
    }
    if (arrUrl['feedback'] == 'open') {
        EM.utilities.addOverlay('.FeedbackForm');
    }
    if (arrUrl['video'] == 'play') {
        if ($.browser.msie) {
            ieFix = function () {
                $('#play-video span, #play-video img').toggle();
                $('#EpicMixDemo').css('display', 'block');
            };
            setTimeout('ieFix();', 1000);
        } else {
            EM.fadeAndPlay();
        }
    }
};

EM.loadVideo = function () {
    brightcovePlayer('#play-video', '1137469825001', '1128803017001', '640px', '380px', true);
    $('.video-thumbnail').hover(
		function () {
		    $('.video-thumbnail span.play').css({
		        'background-position': 'left bottom'
		    });
		},
		function () {
		    $('.video-thumbnail span.play').css({
		        'background-position': 'left top'
		    });
		}
	);
	$('.video-example').click(function () {
        playVideo('598987864001', true);
        return false;
    });
    $('.VideoOverlay p.close a').click(function () {
        stopVideo();
        $("div.UIBlock").remove();
        $('div.modal_overlay').hide();
        return false;
    });
};

EM.loadTwitter = function () {
    var userTimelineUrl = 'http://api.twitter.com/1/statuses/user_timeline.json';

    function twitterSuccess(data) {
        $("#twitterLatest").empty();

        if (data.error) {
            var cachedTweet = $("#twitterCachedTweet").html();
            data = $.parseJSON(cachedTweet);
        }

        if (data && data[0]) {
            var tweet = data[0];

            if (tweet.created_at && tweet.text) {
                $("#twitterLatestTemplate").tmpl(tweet).appendTo("#twitterLatest");
            }
        }
    }

    function twitterError() {
        $("#twitterLatest").empty();
        $("#twitterLatest").html('Twitter error');
    }

    var username = $("#twitterLatest").attr('data-username');

    $.jsonp({
        type: "GET",
        url: userTimelineUrl + '?callback=?',
        data: {
            'include_entities': 'true',
            'include_rts': 'true',
            'screen_name': username,
            'count': 1,
            'suppress_response_codes': 'true'
        },
        contentType: "application/json; charset=utf-8",
        dataType: "jsonp",
        success: twitterSuccess,
        error: twitterError,
        timeout: 5000
    });
};

EM.global.pageLoad(EM.global.setupUi, EM.checkQueryStrings, EM.loadVideo, EM.homepage.init, EM.loadTwitter);


$(document).ready(function () {
   $('.refresh').click(function () {
        var cacheRefresh = true;
        EM.homepage.init(cacheRefresh);
        return false;
    });
  });