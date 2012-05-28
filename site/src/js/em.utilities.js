var EM = EM || {};

EM.utilities = EM.utilities || {};

// debug non-implemented links
$.fn.debug_links = function () {
    return this.each(function () {
        $(this).click(function () {
            alert("Sorry, this link is not implemented yet."); return false;
        });
    });
};

$.fn.mobile_error = function () {
    return this.each(function () {
        $(this).click(function () {
            EM.utilities.addOverlay('.NoPhone');
            return false;
        });
    });
};

// omniture tracking
/*$.fn.omniture_tracking = function () {

// prevents tracking from breaking the site completely if omniture tracker isn't on the page
if(typeof s == 'undefined' ) {
return;
} 

return this.each(function () {
$(this).click(function () {
            
var arrTracking = [];
var strType = '';
var strPage = '';
var strArguments = '';
var strEvents = '';

arrTracking = $(this).attr('data-omniture').split(';');
strType = arrTracking[0];
strPage = arrTracking[1];
strArguments = arrTracking[2];

if (strType == 'p') {
EM.utilities.triggerOmnitureTracking('epicmix:' + strPage + ':' + strArguments, '', 'epicmix,' + strPage + ':' + strArguments, 'epicmix', 'snow:epicmix:' + strPage, 'epicmix:' + strPage + ':' + strArguments, '', 'logged out', 'vriepicmix');
} else if (strType == 'e') {
if(arrTracking[3]){
strEvents = arrTracking[3];
EM.utilities.triggerOmnitureEventTracking('snow:epicmix:' + strPage, '', 'snow,epicmix,' + strPage + ':' + strArguments, 'snow:epicmix', 'snow:epicmix:' + strPage, 'epicmix:' + strPage + ':' + strArguments, '', 'logged out', 'vriepicmix', strEvents);
}else{
EM.utilities.triggerOmnitureEventTracking('snow:epicmix:' + strPage, '', 'snow,epicmix,' + strPage + ':' + strArguments, 'snow:epicmix', 'snow:epicmix:' + strPage, 'epicmix:' + strPage + ':' + strArguments, '', 'logged out', 'vriepicmix');                
}
} else {

}

});
});

};*/

$.fn.omniture_tracking = function () {

    // prevents tracking from breaking the site completely if omniture tracker isn't on the page
    if (typeof s == 'undefined') {
        return;
    }
    return this.each(function () {
        $(this).click(function () {
            var omniture = $(this).attr('data-omniture').split(';');
            var strEvents = omniture[0];
            var linkName = omniture[1];
            EM.utilities.fireOmnitureEvent(strEvents, linkName);
        });
    });
};

EM.utilities.fireOmnitureEvent = function (strEvents, linkName) {
    var propObj = {};

    propObj.events = strEvents;
    propObj.linkTrackVars = "events";
    propObj.linkTrackEvents = strEvents;

    EM.utilities.triggerOmnitureEventTracking(propObj, linkName);
};

EM.utilities.triggerOmnitureTracking = function (strPageName, strChannel, strHier1, strProp1, strProp2, strProp3, strProp4, strProp7, strprop50, events) {

    // prevents tracking from breaking the site completely if omniture tracker isn't on the page
    if (typeof s == 'undefined') {
        return;
    }

    s.pageName = strPageName;
    s.channel = strChannel;

    s.events = events;
    s.hier1 = strHier1;
    s.prop1 = strProp1;
    s.prop2 = strProp2;
    s.prop3 = strProp3;
    s.prop4 = strProp4;
    s.prop7 = strProp7;
    s.prop50 = "vriepicmix";

    s.t();
};


EM.utilities.triggerOmnitureEventTracking = function (propObj, linkName) {
    for (var name in propObj) {
        s[name] = propObj[name];

        //debug warnings
        if (!propObj.linkTrackVars || (EM.utilities.IsOmnitureTrackingVar(name) && propObj.linkTrackVars.indexOf(name) == -1 && propObj[name] != '' && console)) {
            console.log("called Omniture property " + name + " with no corresponding event tracking variable.");
        }
    }

    s.tl(this, 'o', linkName);

    //reset incase next call doesn't overwrite all variables.
    s.linkTrackVars = '';
    s.linkTrackEvents = '';
    s.events = '';
};

EM.utilities.IsOmnitureTrackingVar = function (name) {
    if (name == "linkTrackVars" || name == "linkTrackEvents") {
        return false;
    }

    return true;
};

EM.utilities.splitUrlVars = function (strUrl) {
    var getData = new Array();

    var vars = strUrl.split('?')[1];
    if (vars) {
        vars = vars.substr(0);

        var pairs = vars.split("&");

        for (var i = 0; i < pairs.length; i++) {
            var formData = pairs[i].split("=");
            var name = formData[0];
            var value = formData[1];
            getData[name] = value;
        }
    }

    return getData;
};

EM.utilities.console_debug = function ($this) {
    if (window.console && window.console.log) {
        console.log($this);
    }
};

EM.utilities.toCapitalize = function (string) {
    var eachWord = string.split(' ');
    var strCapitalized = '';
    for (var i = 0; i < eachWord.length; i++) {
        if (i != 0) {
            strCapitalized += ' ';
        }
        strCapitalized += eachWord[i].charAt(0).toUpperCase() + eachWord[i].slice(1);
    }
    return strCapitalized;
};

EM.Modal = EM.Modal || {};

EM.Modal.fitToWindow = function () {

    var $currentModal = $('.modal_overlay:visible'),
        windowHeight = $(window).height(),
        modalHeight = $currentModal.outerHeight(),
        $modalContent = $('.modal_content', $currentModal),
        $modalHead = $('.modal-head', $currentModal),
        $modalMain = $('.modal-main', $currentModal),
        $modalFoot = $('.modal-foot', $currentModal),
        maxHeight = (function () {
            // sets the data-maxHeight attribute if it's not already set
            if ($currentModal.attr('data-maxHeight') === undefined) {
                $currentModal.attr('data-maxHeight', modalHeight);
                return modalHeight;
            }
            return $currentModal.attr('data-maxHeight');
        })();

    // make sure we have a modal visible and that we have all the required elements are present, this way we don't break older modal layouts
    if ($currentModal.length > 0 && $modalContent.length > 0 && $modalHead.length > 0 && $modalMain.length > 0 && $modalFoot.length > 0) {

        // check if we need to scale the modal down
        if (windowHeight < modalHeight) {
            $currentModal.height(windowHeight - 90).css('margin-top', -Math.floor(windowHeight / 2) + 40);
            $modalContent.height('100%');
            $modalFoot.css('overflow', 'auto');

            // force ie7 to contain the buttons in the modal-foot
            $modalFoot.hide(); $modalFoot.show();

            $modalMain.height($currentModal.height() - $modalHead.height() - $modalFoot.height() - 30).css('overflow', 'auto');

            // check if we need to scale the modal up
        } else if (modalHeight < maxHeight) {

            var newHeight = windowHeight - 90;

            if (newHeight < maxHeight) {
                // dynamically resize the modal
                $currentModal.height(newHeight).css('margin-top', -Math.floor(windowHeight / 2) + 40);
                $modalMain.height($currentModal.height() - $modalHead.height() - $modalFoot.height() - 30).css('overflow', 'auto');
            } else {
                // reset the modals to it's initial size and proportions
                $modalContent.removeAttr('style');
                $currentModal.attr('style', 'display:block;');
                $modalMain.attr('style', '');
            }
        }
    }
};

// this needs to be merged into the modal namespace eventually
EM.utilities.addOverlay = function (selector) {

    var $modal = $(selector);

    if ($('#Content .BrightcoveExperience').length > 0) {
        $('#Content .BrightcoveExperience').css({ 'visibility': 'hidden' });
    };

    // turn down the lights
    $('body').append('<div class="UIBlock"></div>');
    if ($.browser.msie && $.browser.version < 8) {
        $('.UIBlock').css({
            display: 'block',
            opacity: 0.6
        });
    } else {
        $('.UIBlock').css({
            display: 'block',
            opacity: 0
        }).animate({
            opacity: 0.6
        }, 'fast');
    }

    $modal.show();

    EM.Modal.fitToWindow();

    // resize the modal if the screen is resized
    window.resizeTimer = null;
    $(window).resize(function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(EM.Modal.fitToWindow, 0);
    });

    // ie6 fix for background fader
    if ($.browser.msie && $.browser.version < 7) {
        var intContentHeight = parseInt(($('body').height()), 10);
        $('.UIBlock').css({ 'height': intContentHeight }).show();
    }

    // LISTEN FOR A CLOSE EVENT
    $('div.modal_overlay p.close a').live("click",function () {
        var currentModal = $(this).parent().parent();
        if ($(currentModal).hasClass("AutoShare") || $(currentModal).hasClass("EpicMixFriends") || $(currentModal).hasClass("FacebookFriends")) {
            EM.utilities.reloadPage();
            return (false);
        }
        $('.UIBlock').remove();
        if ($('#Content .BrightcoveExperience').length > 0) { $('#Content .BrightcoveExperience').css({ 'visibility': 'visible' }); };
        $('.modal_overlay').hide(); return false;
    });
};

EM.utilities.getQuerystring = function (key, default_) {
    if (default_ == null) default_ = "";
    key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
    var qs = regex.exec(window.location.href);
    if (qs == null)
        return default_;
    else
        return qs[1];
};

// ADD COMMAS TO NUMBERS
// This adds commas to a number that's inside a DOM element using jquery.
$.fn.digits = function () {
    return this.each(function () {
        $(this).text($(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'));
    });
};
// This adds commas to a numeric js var, turning it into a string.
EM.utilities.addCommas = function (n) {
    if (!isFinite(n)) {
        return n;
    }

    var s = "" + n, abs = Math.abs(n), _, i;

    if (abs >= 1000) {
        _ = ("" + abs).split(/\./);
        i = _[0].length % 3 || 3;

        _[0] = s.slice(0, i + (n < 0)) +
               _[0].slice(i).replace(/(\d{3})/g, ',$1');

        s = _.join('.');
    }

    return s;
}

EM.utilities.splitURLVars = function (url) {
    var getData = new Array();

    var vars = url.split('?')[1];
    if (vars) {
        vars = vars.substr(0);

        var pairs = vars.split("&");

        for (var i = 0; i < pairs.length; i++) {
            var formData = pairs[i].split("=");

            var name = formData[0];
            var value = formData[1];
            getData[name] = value;
        }
    }

    return getData;
};

EM.utilities.isValidEmail = function (email) {
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
};

// this will accept the following forms of phone numbers
// 1112223333
// (111) 222-3333
// 111.222.3333
EM.utilities.isValidPhone = function (phone) {
    var phonePattern = /^(?:\([2-9][0-8]\d\)\ ?|[2-9][0-8]\d[\-\ \.\/]?)[2-9]\d{2}[- \.\/]?\d{4}\b$/;
    return phonePattern.test(phone);
};

EM.utilities.validateAgeDate = function (ageMonth, ageDay, ageYear) {
    var numMonth = EM.utilities.getMonth(ageMonth);
    var daysInMonth = EM.utilities.daysArray(12);
    if ((numMonth == 2 && ageDay <= EM.utilities.daysInFebruary(ageYear)) || ageDay <= daysInMonth[numMonth]) {
        return false;
    } else {
        return true;
    }
};

EM.utilities.getMonth = function (ageMonth) {
    var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    for (i = 0; i <= month.length; i++) {
        if (month[i] == ageMonth) {
            return i + 1;
        }
    }
    return null;
};

EM.utilities.daysInFebruary = function (year) {
    return (((year % 4 == 0) && ((!(year % 100 == 0)) || (year % 400 == 0))) ? 29 : 28);
};

EM.utilities.daysArray = function (n) {
    for (var i = 1; i <= n; i++) {
        this[i] = 31;
        if (i == 4 || i == 6 || i == 9 || i == 11) { this[i] = 30; }
        if (i == 2) { this[i] = 29; }
    }
    return this;
};

EM.utilities.zipCodeCheck = function (n) {
    var re = /^\d{5}([\-]\d{4})?$/;
    return (re.test(n));
};

EM.utilities.zipCodeCheckUSAndCanada = function (n) {
    var re = /(^\d{5}((-)?\d{4})?$)|(^[A-Za-z]\d[A-Za-z]( )?\d[A-Za-z]\d$)/;
    return (re.test(n));
};

EM.utilities.isValidName = function (n) {
    var re = /^[a-zA-Z_'-.\(\)\s]{1,254}$/;
    return (re.test(n));
};

EM.utilities.passNumberCheck = function (n) {
    var re = /^\d{10}([\-]\d{4})?$/;
    return (re.test(n));
};

EM.utilities.dobFormatCheck = function (d) {
    var re = /^(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{4})$/;
    return (re.test(d));
};

EM.utilities.hasFlashPlugin = function () {

    var UNDEF = "undefined",
		OBJECT = "object",
		SHOCKWAVE_FLASH = "Shockwave Flash",
		SHOCKWAVE_FLASH_AX = "ShockwaveFlash.ShockwaveFlash",
		FLASH_MIME_TYPE = "application/x-shockwave-flash",
		plugin = false,
		nav = navigator;

    if (typeof nav.plugins != UNDEF && typeof nav.plugins[SHOCKWAVE_FLASH] == OBJECT) {
        d = nav.plugins[SHOCKWAVE_FLASH].description;
        if (d && !(typeof nav.mimeTypes != UNDEF && nav.mimeTypes[FLASH_MIME_TYPE] && !nav.mimeTypes[FLASH_MIME_TYPE].enabledPlugin)) { // navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin indicates whether plug-ins are enabled or disabled in Safari 3+
            plugin = true;
        }
    }

    return plugin;
};

EM.utilities.reloadPage = function () {
    window.location = window.location.protocol + "//" + window.location.hostname + window.location.pathname + window.location.search;
};

// Simulates PHP's date function
Date.prototype.format = function (format) {
    var returnStr = '';
    var replace = Date.replaceChars;
    for (var i = 0; i < format.length; i++) {
        var curChar = format.charAt(i);
        if (replace[curChar]) {
            returnStr += replace[curChar].call(this);
        } else {
            returnStr += curChar;
        }
    }
    return returnStr;
};

Date.replaceChars = {
    shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    longMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    longDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

    // Day
    d: function () { return (this.getDate() < 10 ? '0' : '') + this.getDate(); },
    D: function () { return Date.replaceChars.shortDays[this.getDay()]; },
    j: function () { return this.getDate(); },
    l: function () { return Date.replaceChars.longDays[this.getDay()]; },
    N: function () { return this.getDay() + 1; },
    S: function () { return (this.getDate() % 10 == 1 && this.getDate() != 11 ? 'st' : (this.getDate() % 10 == 2 && this.getDate() != 12 ? 'nd' : (this.getDate() % 10 == 3 && this.getDate() != 13 ? 'rd' : 'th'))); },
    w: function () { return this.getDay(); },
    z: function () { return "Not Yet Supported"; },
    // Week
    W: function () { return "Not Yet Supported"; },
    // Month
    F: function () { return Date.replaceChars.longMonths[this.getMonth()]; },
    m: function () { return (this.getMonth() < 9 ? '0' : '') + (this.getMonth() + 1); },
    M: function () { return Date.replaceChars.shortMonths[this.getMonth()]; },
    n: function () { return this.getMonth() + 1; },
    t: function () { return "Not Yet Supported"; },
    // Year
    L: function () { return (((this.getFullYear() % 4 == 0) && (this.getFullYear() % 100 != 0)) || (this.getFullYear() % 400 == 0)) ? '1' : '0'; },
    o: function () { return "Not Supported"; },
    Y: function () { return this.getFullYear(); },
    y: function () { return ('' + this.getFullYear()).substr(2); },
    // Time
    a: function () { return this.getHours() < 12 ? 'am' : 'pm'; },
    A: function () { return this.getHours() < 12 ? 'AM' : 'PM'; },
    B: function () { return "Not Yet Supported"; },
    g: function () { return this.getHours() % 12 || 12; },
    G: function () { return this.getHours(); },
    h: function () { return ((this.getHours() % 12 || 12) < 10 ? '0' : '') + (this.getHours() % 12 || 12); },
    H: function () { return (this.getHours() < 10 ? '0' : '') + this.getHours(); },
    i: function () { return (this.getMinutes() < 10 ? '0' : '') + this.getMinutes(); },
    s: function () { return (this.getSeconds() < 10 ? '0' : '') + this.getSeconds(); },
    // Timezone
    e: function () { return "Not Yet Supported"; },
    I: function () { return "Not Supported"; },
    O: function () { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + '00'; },
    P: function () { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + ':' + (Math.abs(this.getTimezoneOffset() % 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() % 60)); },
    T: function () { var m = this.getMonth(); this.setMonth(0); var result = this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, '$1'); this.setMonth(m); return result; },
    Z: function () { return -this.getTimezoneOffset() * 60; },
    // Full Date/Time
    c: function () { return this.format("Y-m-d") + "T" + this.format("H:i:sP"); },
    r: function () { return this.toString(); },
    U: function () { return this.getTime() / 1000; }
};

// YYYMMDD - YYYMMDD and strip the last four digits, remaining number is the age
Date.prototype.getAge = function () {
    var age = (new Date().format('Ymd') - this.format('Ymd')) + '';
    if (age.length > 4) {
        return parseInt(age.substr(0, age.length - 4), 10);
    } else {
        return 0;
    }
};

EM.utilities.getTimeAgo = function (dateString) {
    if ($.browser.msie) {
        dateString = dateString.replace(/( \+)/, ' UTC$1');
    }
    var date = new Date(dateString);
    var now = new Date();

    var timeSpan = now - date;

    var oneSecond = 1000; // milliseconds
    var oneMinute = 60 * oneSecond;
    var oneHour = 60 * oneMinute;
    var oneDay = 24 * oneHour;
    var oneMonth = 30 * oneDay;
    var oneYear = 12 * oneMonth;

    if (timeSpan <= oneHour) {
        var minutes = Math.round(timeSpan / oneMinute);
        return minutes > 1 ? "about " + minutes + " minutes ago" : "about a minute ago";
    }
    if (timeSpan <= oneDay) {
        var hours = Math.round(timeSpan / oneHour);
        return hours > 1 ? "about " + hours + " hours ago" : "about an hour ago";
    }
    if (timeSpan <= oneMonth) {
        var days = Math.round(timeSpan / oneDay);
        return days > 1 ? "about " + days + " days ago" : "about a day ago";
    }

    if (timeSpan <= oneYear) {
        var months = Math.round(timeSpan / oneMonth);
        return months > 1 ? "about " + months + " months ago" : "about a month ago";
    }

    var years = Math.round(timeSpan / oneYear);
    return years > 1 ? "about " + years + " years ago" : "about a year ago";
};

/**
* The .bind method from Prototype.js - changed to .Context for compatibility with jQuery
*
* Allows assignment of context to a function - useful for callbacks that may lose context otherwise.
* Use when calling a handler that exists outside of the current object scope.
*
* Also useful for maintaining object scope in jQuery. Example use:
*
* function myObj();
* myObj.prototype.myEvent = function()
* {
*   $('div').click(
*     function() {
*       this.myHandler(); // Because we're using .Context(this) on the anonymous function,
*     }.Context(this) // 'this' refers to myObj, rather than the div that was clicked.
*   );
* }
* myObj.prototype.myHandler = function()
* {
*   // Therefore this handler will be called, instead of jQuery throwing an error by attempting
*   // to call a myHandler() method that doesn't exist on the object created by $('div').
* }
*/
if (!Function.prototype.Context) { // check if native implementation available
    Function.prototype.Context = function () {
        var fn = this, args = Array.prototype.slice.call(arguments), object = args.shift();
        return function () {
            return fn.apply(object, args.concat(Array.prototype.slice.call(arguments)));
        };
    };
}

EM.utilities.getAutoShareValue = function (facebookValue, twitterValue) {

    var facebookAutoshare = 1;
    var twitterAutoshare = 2;

    var returnValueFacebook = facebookValue ? facebookAutoshare : 0;
    var returnValueTwitter = twitterValue ? twitterAutoshare : 0;

    var returnValue = returnValueFacebook + returnValueTwitter;

    return returnValue;
};


/* Cookie set/get/delete */

EM.utilities.setCookie = function (name, value, expires, path, domain, secure) {
    // set time, it's in milliseconds
    var today = new Date();
    today.setTime(today.getTime());

    /*
    if the expires variable is set, make the correct
    expires time, the current script below will set
    it for x number of days, to make it for hours,
    delete * 24, for minutes, delete * 60 * 24
    */
    if (expires) {
        expires = expires * 1000 * 60 * 60 * 24;
    }
    var expires_date = new Date(today.getTime() + (expires));

    document.cookie = name + "=" + escape(value) +
        ((expires) ? ";expires=" + expires_date.toGMTString() : "") +
            ((path) ? ";path=" + path : "") +
                ((domain) ? ";domain=" + domain : "") +
                    ((secure) ? ";secure" : "");
};

EM.utilities.getCookie = function (check_name) {
    // first we'll split this cookie up into name/value pairs
    // note: document.cookie only returns name=value, not the other components
    var a_all_cookies = document.cookie.split(';');
    var a_temp_cookie = '';
    var cookie_name = '';
    var cookie_value = '';
    var b_cookie_found = false; // set boolean t/f default f

    for (i = 0; i < a_all_cookies.length; i++) {
        // now we'll split apart each name=value pair
        a_temp_cookie = a_all_cookies[i].split('=');


        // and trim left/right whitespace while we're at it
        cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');

        // if the extracted name matches passed check_name
        if (cookie_name == check_name) {
            b_cookie_found = true;
            // we need to handle case where cookie has no value but exists (no = sign, that is):
            if (a_temp_cookie.length > 1) {
                cookie_value = unescape(a_temp_cookie[1].replace(/^\s+|\s+$/g, ''));
            }
            // note that in cases where cookie is initialized but no value, null is returned
            return cookie_value;
            break;
        }
        a_temp_cookie = null;
        cookie_name = '';
    }
    if (!b_cookie_found) {
        return null;
    }
};

EM.utilities.deleteCookie = function (name, path, domain) {
    if (Get_Cookie(name)) document.cookie = name + "=" +
        ((path) ? ";path=" + path : "") +
            ((domain) ? ";domain=" + domain : "") +
                ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
};

EM.utilities.lightbox = (function () {

    var isLightboxSetup = false; //check if one is on the page
    var $lightbox = $("#lightbox");
    var $lightboxContent = $("#lightbox .modal-content");

    var self = {
        setupLightbox: function () {
            $("body").append("<div id='lightbox' style='display: none'><div class='modal-content'></div><p class='close'><a>close</a></p></div>");
            $lightbox = $("#lightbox");
            $lightboxContent = $("#lightbox .modal-content");
            self.bindEvents();
            isLightboxSetup = true;
        },
        centerLightboxShowImage: function () {
            $lightbox.css({ left: (window.innerWidth / 2) - ($lightbox.width() / 2) + "px", top: (window.innerHeight / 2) - ($lightbox.height() / 2) + "px" });
            EM.utilities.addOverlay("#lightbox");
        },
        bindEvents: function () {
            $("#lightbox p.close a").click(function () {
                $(document).trigger("closeLightbox");
            });
            $(document).click(function () {
                $(document).trigger("closeLightbox");
            });
            $lightbox.click(function (e) {//kills document click event, can't close if clicked on
                e.stopPropagation();
            });
            $(document).keydown(function (e) {
                switch (e.which) {
                    case 27: //esc
                        $(document).trigger("closeLightbox");
                }
            });
            $(document).bind("closeLightbox", function () {
                if ($lightbox.is(":visible")) {
                    $('.UIBlock').remove();
                    $lightbox.hide();
                }
            });
        }
    };

    var pub = {
        showLightbox: function (imageUrl) {
            if (!isLightboxSetup) {
                self.setupLightbox();
            } else {
                $lightboxContent.empty();
            }
            $("<img src='" + imageUrl + "' />")
                    .load(self.centerLightboxShowImage)
                    .appendTo($lightboxContent);
        }
    };

    return pub;
})();
