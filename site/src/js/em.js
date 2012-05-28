//= require <jquery>
//= require "plugins/jquery.easing.1.3"
//= require "plugins/jquery.metadata"
//= require "em/utilities"

// setup namespace
var EM = EM || {};

// Functions applied on page load and on the inserted DOM in any XHR request,
// don't forget to scope the Selectors.
EM.onload = function () {
    var scope = scope || $(document);

    // link debugging
    $('a[href=VAIL_TEST]', scope).debug_links();
    $('a[href=VAIL_QA]', scope).debug_links();

    $('a[rel=NoMobile]', scope).mobile_error();

    EM.initOmnitureTracking();
    EM.setupMenu();
    EM.checkForIE();

    // global dom onready
    EM.global.pageLoad();
};

EM.initOmnitureTracking = function() {    
    $('a[data-omniture]').omniture_tracking();
    $('li[data-omniture]').omniture_tracking();
    $('div[data-omniture]').omniture_tracking();
    $('input[data-omniture]').omniture_tracking();
    $('h4[data-omniture]').omniture_tracking();
    $('p[data-omniture]').omniture_tracking();
};

// global OnDOMReady()
$(document).ready(function() {
    EM.onload();
});