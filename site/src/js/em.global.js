var EM = EM || {};

EM.global = EM.global || {};
EM.NumModalSteps = 6;
EM.currentPrivacy = 2;
EM.newPrivacy = 2;

EM.checkForIE = function () {
    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
        EM.isIE = new Number(RegExp.$1);
    }
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

};

// global handler for document ready functions
EM.global.pageLoad = function (f) {
    this.queue = this.queue || [];

    // add functions to the queue
    if (arguments.length > 0) {
        var loaded = this.queue.length;
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] == "function") {
                this.queue[i + loaded] = arguments[i];
            } else {
                throw ('Global Page Load - Argument must be a function: ' + arguments[i]);
            }
        }

        // run all functions in the queue
    } else if (this.queue.length > 0) {
        for (var i = 0; i < this.queue.length; i++) {
            this.queue[i]();
        }
    } else {
        return false;
    }
};

EM.global.setupUi = function () {
    EM.global.setupGeneralModals();
    EM.global.checkForOpenModals();

    // event listener to close the EM.global.showError modals
    $("#EpicMixErrorClose").live('click', function () {
        $('.UIBlock').remove();
        if ($('#Content .BrightcoveExperience').length > 0) {
            $('#Content .BrightcoveExperience').css({ 'visibility': 'visible' });
        }
        $('.modal_overlay').hide(); return false;
    });

    // check and see if we need to autoplay the video
    var url = document.location.href.toLowerCase();
    if (url.match(/\/epicmix\/home\.aspx/)) {
        var autoplay = EM.utilities.getQuerystring("autoplay");
        if (autoplay) {
            EM.utilities.addOverlay('.VideoOverlay');
        }
    }

    if (url.match(/\/epicmix\/user-profile-patches\.aspx/)) {
        $("a.back").click(function () {
            history.go(-1);
            return (false);
        });
    }
};

EM.global.setupGeneralModals = function () {
    $('#mix-enabled').click(function () {
        EM.utilities.addOverlay('.EpicMixEnabled');
        return false;
    });
};

EM.global.checkForOpenModals = function () {
    var strUrl = new String(document.location);
    var arrUrl = EM.utilities.splitUrlVars(strUrl);

    if (arrUrl['pass'] == 'enabled') {
        EM.utilities.addOverlay('.EpicMixEnabled');
    }

    if (arrUrl['video'] == 'play') {
        EM.fadeAndPlay();
    }

    if (arrUrl['feedback'] == 'open') {
        EM.utilities.addOverlay('.FeedbackForm');
    }

};


EM.Feedback = (function () {

    var $feedbackForm = $('.FeedbackForm'),
        formAction = '',
        self, pub;

    self = {
        // checks the feedback form for valid values
        isValid: function () {
            $('div.FeedbackForm div.modal_content p.error').remove();

            // test that the fields aren't empty
            if (($('div.FeedbackForm div.modal_content fieldset input [name=Name]').val() != '') &&
                ($('div.FeedbackForm div.modal_content fieldset.email input').val() != '') &&
                ($('div.FeedbackForm div.modal_content fieldset textarea').val() != '')) {

                if (EM.utilities.isValidEmail($('div.FeedbackForm div.modal_content fieldset.email input').val())) {
                    return true;
                } else {
                    $('div.FeedbackForm div.modal_content fieldset.feedback').after('<p class="error">Please enter a vailid email address.</p>');
                    return false;
                }

            } else {
                $('div.FeedbackForm div.modal_content fieldset.feedback').after('<p class="error">Please fill in all forms.</p>');
                return false;
            }
        },
        submit: function () {
            if (self.isValid()) {
                $('div.FeedbackForm div.modal-foot ul').addClass('loading');
                // submit the form data to the server
                $.ajax({
                    type: 'POST',
                    url: '/vailresorts/sites/epicmix/handlers/Feedback.ashx',
                    dataType: 'json',
                    data: ({
                        name: $('div.FeedbackForm div.modal_content fieldset input [name=Name]').val(),
                        email: $('div.FeedbackForm div.modal_content fieldset.email input').val(),
                        message: $('div.FeedbackForm div.modal_content fieldset textarea').val()
                    }),
                    success: function (msg) {
                        $('div.FeedbackForm div.modal-foot ul').removeClass('loading');
                        $('.FeedbackForm').hide();
                        if (msg["SUCCESS"] == "true") {
                            $('.FeedbackConfirmation').show();
                        } else {
                            EM.global.showError();
                        }
                    },
                    error: function () {
                        $('div.FeedbackForm div.modal-foot ul').removeClass('loading');
                        // error modal
                        EM.global.showError();
                    }
                });
            }
        }
    };

    pub = {
        init: function () {
            // init the modal overlay
            $('#Feedback a').click(function (e) {
                $('div.FeedbackForm div fieldset input').val('');
                $('div.FeedbackForm div fieldset textarea').val('');
                $('div.FeedbackForm div.modal_content p.error').remove();
                EM.utilities.addOverlay('.FeedbackForm'); return false;
                e.preventDefault();
            });

            // simulate form submission
            $feedbackForm.find('.submit a').click(function (e) {
                e.preventDefault();
                self.submit();
            });

            // i have no idea what this does
            $('#Feedback li a').hover(function () {
                $('#Feedback li a').toggleClass('hover');
                $('#Feedback li').toggleClass('hover');
                return false;
            });
        }
    };

    return pub;
})();

EM.global.prepopulatePrivacySettings = function (privacy, pinsearned, level, checkin) {
    if (privacy >= 0 && privacy <= 3) {
        $('div.PrivacySettings input').attr('checked', '');
        $('div.PrivacySettings span.input-wrap').removeClass('active');
    }
    if (privacy == 1) {
        $('div.PrivacySettings div.public-social input').attr('checked', 'checked');
        $('div.PrivacySettings div.public-social input').parent().addClass('active');
    } else if (privacy == 0) {
        $('div.PrivacySettings div.public-basic input').attr('checked', 'checked');
        $('div.PrivacySettings div.public-basic input').parent().addClass('active');
    } else if (privacy == 2) {
        $('div.PrivacySettings div.private input').attr('checked', 'checked');
        $('div.PrivacySettings div.private input').parent().addClass('active');
    }
    switch (pinsearned) {
        case 3:
        case 7:
            $("div.AutoShare input[name='facebook-patch']").attr('checked', 'checked');
            $("div.AutoShare input[name='facebook-patch']").parent().addClass('active');
            $("div.AutoShare input[name='twitter-patch']").attr('checked', 'checked');
            $("div.AutoShare input[name='twitter-patch']").parent().addClass('active');
            break;

        case 1:
        case 5:
            $("div.AutoShare input[name='facebook-patch']").attr('checked', 'checked');
            $("div.AutoShare input[name='facebook-patch']").parent().addClass('active');
            $("div.AutoShare input[name='twitter-patch']").attr('checked', '');
            $("div.AutoShare input[name='twitter-patch']").parent().removeClass('active');
            break;

        case 2:
        case 6:
            $("div.AutoShare input[name='facebook-patch']").attr('checked', '');
            $("div.AutoShare input[name='facebook-patch']").parent().removeClass('active');
            $("div.AutoShare input[name='twitter-patch']").attr('checked', 'checked');
            $("div.AutoShare input[name='twitter-patch']").parent().addClass('active');
            break;

        case 0:
        case 4:
        default:
            $("div.AutoShare input[name='facebook-patch']").attr('checked', '');
            $("div.AutoShare input[name='facebook-patch']").parent().removeClass('active');
            $("div.AutoShare input[name='twitter-patch']").attr('checked', '');
            $("div.AutoShare input[name='twitter-patch']").parent().removeClass('active');
            break;
    }
    if ($("div.AutoShare input[name='twitter-patch']").parent().hasClass('disabled')) {
        $("div.AutoShare input[name='twitter-patch']").parent().removeClass('active');
    }

    switch (level) {
        case 3:
        case 7:
            $("div.AutoShare input[name='facebook-level']").attr('checked', 'checked');
            $("div.AutoShare input[name='facebook-level']").parent().addClass('active');
            $("div.AutoShare input[name='twitter-level']").attr('checked', 'checked');
            $("div.AutoShare input[name='twitter-level']").parent().addClass('active');
            break;

        case 1:
        case 5:
            $("div.AutoShare input[name='facebook-level']").attr('checked', 'checked');
            $("div.AutoShare input[name='facebook-level']").parent().addClass('active');
            $("div.AutoShare input[name='twitter-level']").attr('checked', '');
            $("div.AutoShare input[name='twitter-level']").parent().removeClass('active');
            break;

        case 2:
        case 6:
            $("div.AutoShare input[name='facebook-level']").attr('checked', '');
            $("div.AutoShare input[name='facebook-level']").parent().removeClass('active');
            $("div.AutoShare input[name='twitter-level']").attr('checked', 'checked');
            $("div.AutoShare input[name='twitter-level']").parent().addClass('active');
            break;

        case 0:
        case 4:
        default:
            $("div.AutoShare input[name='facebook-level']").attr('checked', '');
            $("div.AutoShare input[name='facebook-level']").parent().removeClass('active');
            $("div.AutoShare input[name='twitter-level']").attr('checked', '');
            $("div.AutoShare input[name='twitter-level']").parent().removeClass('active');
            break;
    }
    if ($("div.AutoShare input[name='twitter-level']").parent().hasClass('disabled')) {
        $("div.AutoShare input[name='twitter-level']").parent().removeClass('active');
    }

    switch (checkin) {
        case 3:
        case 7:
            $("div.AutoShare input[name='facebook-checkin']").attr('checked', 'checked');
            $("div.AutoShare input[name='facebook-checkin']").parent().addClass('active');
            $("div.AutoShare input[name='twitter-checkin']").attr('checked', 'checked');
            $("div.AutoShare input[name='twitter-checkin']").parent().addClass('active');
            break;

        case 1:
        case 5:
            $("div.AutoShare input[name='facebook-checkin']").attr('checked', 'checked');
            $("div.AutoShare input[name='facebook-checkin']").parent().addClass('active');
            $("div.AutoShare input[name='twitter-checkin']").attr('checked', '');
            $("div.AutoShare input[name='twitter-checkin']").parent().removeClass('active');
            break;

        case 2:
        case 6:
            $("div.AutoShare input[name='facebook-checkin']").attr('checked', '');
            $("div.AutoShare input[name='facebook-checkin']").parent().removeClass('active');
            $("div.AutoShare input[name='twitter-checkin']").attr('checked', 'checked');
            $("div.AutoShare input[name='twitter-checkin']").parent().addClass('active');
            break;

        case 0:
        case 4:
        default:
            $("div.AutoShare input[name='facebook-checkin']").attr('checked', '');
            $("div.AutoShare input[name='facebook-checkin']").parent().removeClass('active');
            $("div.AutoShare input[name='twitter-checkin']").attr('checked', '');
            $("div.AutoShare input[name='twitter-checkin']").parent().removeClass('active');
            break;
    }
    if ($("div.AutoShare input[name='twitter-checkin']").parent().hasClass('disabled')) {
        $("div.AutoShare input[name='twitter-checkin']").parent().removeClass('active');
    }
};

EM.global.setPrivacyModalsNumbering = function (type) {
    var step1 = "";
    var step2 = "";
    var step3 = "";
    var step4 = "";
    var step5 = "";
    var step6 = "";
    if (EM.NumModalSteps == 6) {
        if (type == 'social') {
            step1 = '<li class="active">1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6</li>';
            step2 = '<li>1</li><li class="active">2</li><li>3</li><li>4</li><li>5</li><li>6</li>';
            step3 = '<li>1</li><li>2</li><li class="active">3</li><li>4</li><li>5</li><li>6</li>';
            step4 = '<li>1</li><li>2</li><li>3</li><li class="active">4</li><li>5</li><li>6</li>';
            step5 = '<li>1</li><li>2</li><li>3</li><li>4</li><li class="active">5</li><li>6</li>';
            step6 = '<li>1</li><li>2</li><li>3</li><li>4</li><li>5</li><li class="active">6</li>';
            $("div.PrivacySettings div.modal-head ol").removeClass('four-steps').removeClass('three-steps').addClass('six-steps').html(step3);
            $("div.AutoShare div.modal-head ol").removeClass('four-steps').removeClass('three-steps').addClass('six-steps').html(step4);
            $("div.EpicMixFriends div.modal-head ol").removeClass('four-steps').removeClass('three-steps').addClass('six-steps').html(step5);
            $("div.FacebookFriends div.modal-head ol").removeClass('four-steps').removeClass('three-steps').addClass('six-steps').html(step6);

            $("div.PrivacySettings div.modal-head h4 span").html("3");
            $("div.AutoShare div.modal-head h4 span").html("4");
            $("div.EpicMixFriends div.modal-head h4 span").html("5");
            $("div.FacebookFriends div.modal-head h4 span").html("6");
        } else {
            step3 = '<li>1</li><li>2</li><li class="active">3</li>';
            $("div.PrivacySettings div.modal-head ol").removeClass('four-steps').removeClass('six-steps').addClass('three-steps').html(step3);
        }
    } else {
        if (type == 'social') {
            step1 = '<li class="active">1</li><li>2</li><li>3</li><li>4</li>';
            step2 = '<li>1</li><li class="active">2</li><li>3</li><li>4</li>';
            step3 = '<li>1</li><li>2</li><li class="active">3</li><li>4</li>';
            step4 = '<li>1</li><li>2</li><li>3</li><li class="active">4</li>';
            $("div.PrivacySettings div.modal-head ol").removeClass('six-steps').removeClass('three-steps').addClass('four-steps').html(step1);
            $("div.AutoShare div.modal-head ol").removeClass('six-steps').removeClass('three-steps').addClass('four-steps').html(step2);
            $("div.EpicMixFriends div.modal-head ol").removeClass('six-steps').removeClass('three-steps').addClass('four-steps').html(step3);
            $("div.FacebookFriends div.modal-head ol").removeClass('six-steps').removeClass('three-steps').addClass('four-steps').html(step4);
        } else {
            step1 = '<li class="active">1</li>';
            $("div.PrivacySettings div.modal-head ol").removeClass('four-steps').removeClass('six-steps').removeClass('three-steps').html(step1);
        }
    }

};

EM.global.showFBDeauthConfirmDialog = function (type) {
    if (type == null || type == undefined) {
        type = 'default';
    }
    $("div.ConfirmChoice div.modal-head h4").html("Confirm Privacy Change");
    $("div.ConfirmChoice div.modal-main").html("<p>Changing your privacy from Public-Social to Public-Basic or Private will disconnect EpicMix from Facebook.</p><p>Are you sure you want to do this?</p>");

    if (type == 'default') {
        $("div.ConfirmChoice p.cancel a").live('click', function () {
            $("div.ConfirmChoice").hide();
            $("div.PrivacySettings").show();
            return (false);
        });
    }

    if ($("div.UIBlock").length) {
        $("div.ConfirmChoice").show();
    } else {
        EM.utilities.addOverlay('.ConfirmChoice');
    }
    $("div.PrivacySettings").hide();
};

EM.global.setPrivacy = function (privacySetting, successCallback) {
    $.ajax({
        type: "POST",
        url: "/vailresorts/sites/epicmix/handlers/profile.ashx",
        dataType: "json",
        data: ({
            method: "UpdatePrivacy",
            privacy: privacySetting
        }),
        success: function (msg) {
            if (successCallback) {//for signup, we don't want a refresh
                successCallback();
            }
            else if (msg !== undefined && msg.response !== undefined && msg.response.status !== undefined && msg.response.status == "SUCCESS") {
                EM.utilities.reloadPage();
            }
        },
        error: function () {
            EM.global.showError("server_error");
            return (false);
        }
    });
};

EM.global.setupPrivacyModals = function () {
    $("#ConfirmChoiceLogin").live('click', function () {
        EM.global.setPrivacy(EM.newPrivacy);
        $("div.ConfirmChoice").hide();
        return (false);
    });

    $('div.NoPass a.rf-link').live('click', function () {
        $('.NoPass').hide();
        $('.EpicMixEnabled').show();
        return false;
    });

    $('#NoPassCancel').live('click', function () {
        $('div.ConfirmInformation ul.error').remove();
        $('.UIBlock').remove();
        $('.modal_overlay').hide();
        window.location.replace("/home.aspx");
    });

    $('span.input-wrap').removeClass('active');
    $('input[@name="privacy-settings"]:checked').each(function () {
        if (!$(this).parent().hasClass('disabled')) {
            $(this).parent('span').addClass('active');
        }
    });

    $('div fieldset span.input-wrap').live('click', function () {
        EM.global.setPrivacyModalsNumbering($("input", $(this)).val());
        $(this).children('input').attr('checked', 'checked');
        $('div fieldset span.input-wrap').removeClass('active');
        $(this).addClass('active');
        return false;
    });

    $('td span.input-wrap').live('click', function () {
        if ($(this).hasClass('disabled')) {
            return (false);
        }
        if ($(this).children('input').is(":checked")) {
            $(this).children('input').attr('checked', '');
        } else {
            $(this).children('input').attr('checked', 'checked');
        }
        $(this).toggleClass('active');
        return false;
    });

    $('div.FacebookFriends fieldset input, .add-friends a').click(function () {
        if ($(this).val().indexOf('Start Typing') > -1) {
            $(this).val('');
        }
    });

    $('div.PrivacySettings p.continue a').live('click', function () {
        if ($('div.PrivacySettings div.public-social input').is(":checked")) {
            EM.FBConnect.connectAccountNoPrivacyPopup(undefined, EM.global.showFacebookConnected);
        }
        else if ($('div.PrivacySettings div.public-basic input').is(":checked")) {
            EM.newPrivacy = 0;
            if (EM.currentPrivacy == 1) {
                EM.global.showFBDeauthConfirmDialog();
            } else {

                EM.global.setPrivacy(EM.newPrivacy);
            }
        } else {
            EM.newPrivacy = 2;
            if (EM.currentPrivacy == 1) {
                EM.global.showFBDeauthConfirmDialog();
            } else {

                EM.global.setPrivacy(EM.newPrivacy);
            }
        }

        if ((EM.newPrivacy | EM.newPrivacy == 0) && EM.currentPrivacy != EM.newPrivacy) {
            EM.utilities.fireOmnitureEvent("event47", "privacy setting changed");
        }

        return (false);
    });

    $("#columnCenter_ctl00_btnUpdatePrivacy").live('click', function () {
        var p = parseInt($("#currentPrivacy").html());
        if (p !== null && p !== undefined && p >= 0 && p <= 3) {
            EM.currentPrivacy = p;
        }
        if ($("#columnCenter_ctl00_rdPrivate").is(':checked')) {
            EM.newPrivacy = 2;
        } else if ($("#columnCenter_ctl00_rdPublicBasic").is(':checked')) {
            EM.newPrivacy = 0;
        } else if ($("#columnCenter_ctl00_rdPublicSocial").is(':checked')) {
            EM.newPrivacy = 1;
            EM.FBConnect.connectAccountNoPrivacyPopup('settings');
            return (false);
        }

        if (EM.currentPrivacy == 1) {
            EM.global.showFBDeauthConfirmDialog();
        } else {
            return (true);
        }
        return (false);

    });

    $('div.EpicMixFriends p.continue a').live('click', function () {
        $('div.EpicMixFriends').hide();
        //FB.XFBML.parse();
        $('div.FacebookFriends').show();
        EM.Modal.fitToWindow();
        return false;
    });

    $('div.AutoShare p.skip a').live('click', function () {
        FB.XFBML.parse();
        $('div.AutoShare').hide();
        if ($(".EpicMixFriends .epicmix-friends ul li").length) {
            $(".EpicMixFriends").show();
        } else {
            $('.FacebookFriends').show();
        }
        EM.Modal.fitToWindow();
        return false;
    });

    $('div.AutoShare p.continue a').live('click', function (event) {
        $(this).parent().parent().parent().addClass('loading');
        //get values of checkboxes and update database
        event.preventDefault();

        var pinsearned = EM.utilities.getAutoShareValue($('input[name="facebook-patch"]').is(':checked'),
            $('input[name="twitter-patch"]').is(':checked'));

        var levelup = EM.utilities.getAutoShareValue($('input[name="facebook-level"]').is(':checked'),
            $('input[name="twitter-level"]').is(':checked'));

        var checkin = EM.utilities.getAutoShareValue($('input[name="facebook-checkin"]').is(':checked'),
            $('input[name="twitter-checkin"]').is(':checked'));

        var photo = EM.utilities.getAutoShareValue($('input[name="facebook-photo"]').is(':checked'),
            $('input[name="twitter-photo"]').is(':checked'));

        $.ajax({
            type: "POST",
            url: "/vailresorts/sites/epicmix/handlers/profile.ashx",
            dataType: "json",
            data: ({
                method: "AutoShareSettings",
                pinsearned: pinsearned,
                levelup: levelup,
                checkin: checkin,
                photo: photo
            }),
            success: function (msg) {
                $('div.AutoShare p.continue a').parent().parent().parent().removeClass('loading');
                if (msg.response.status == "SUCCESS") {
                    var url = document.location.href.toLowerCase();
                    $('div.AutoShare').hide();
                    if ($("div.EpicMixFriends div.epicmix-friends ul").children("li").length) {
                        FB.XFBML.parse();
                        $('div.EpicMixFriends').show();
                        EM.Modal.fitToWindow();
                    } else {
                        FB.XFBML.parse();
                        $('div.FacebookFriends').show();
                        EM.Modal.fitToWindow();
                    }
                }
                else {
                    $('div.pass ul.error li.dynamic').text(msg.response.reason);
                    $('div.pass ul.error li.dynamic').removeClass('hidden');
                    return false;
                }
            },
            error: function () {
                $('div.AutoShare p.continue a').parent().parent().parent().removeClass('loading');
                $('div.login ul.error li.login').removeClass('hidden');
                return false;
            }
        });
        return false;
    });

};

//=========================================//
// New Privacy modal code
//=========================================//
EM.privacy = EM.privacy || { };
EM.privacy.setPrivacyModal = function () {
    $('div.PrivacySettings p.continue a').live('click', function () {
        var result = $('input[name="privacy-settings"').val();
        EM.newPrivacy = result;

        switch (result) {
            case "public":
                $(document).bind("facebook-authorize", function (e, authResponse) {
                    EM.FBConnect.setAccessToken(authResponse);
                });
                EM.FBConnect.userLogin();
                break;
            default:
                if (EM.currentPrivacy == 1) {
                    EM.global.showFBDeauthConfirmDialog();
                } else {

                    EM.global.setPrivacy(EM.newPrivacy);
                }
                break;
        }

        if (EM.newPrivacy == 0 && EM.currentPrivacy != EM.newPrivacy) {
            EM.utilities.fireOmnitureEvent("event47", "privacy setting changed");
        }

        return (false);
    });
};

EM.privacy.getPrivacy = function () {
    $.ajax({
        type: "GET",
        url: "/vailresorts/sites/epicmix/handlers/profile.ashx",
        dataType: "json",
        data: ({
            method: "GetPrivacy"
        }),
        success: function (data) {
            $(document).trigger("getPrivacySuccess", data);
        },
        error: function () {
            EM.global.showError("custom", "Error", "An error has occured with the request, please try again later.");
        }
    });
};

//=========================================//
// End new privacy modal code
//=========================================//

EM.global.showFacebookConnected = function () {
    $("div.ConfirmChoice div.modal-head h4").html("Facebook connected");
    $("div.ConfirmChoice div.modal-main").html("<p>You have been connected to Facebook. You will now be taken to the Share Settings page.</p>");
    $("div.ConfirmChoice p.cancel").hide();

    $('#ConfirmChoiceLogin').die('click');
    $('#ConfirmChoiceLogin').click(function () {
        __doPostBack('columnCenterLeft$ctl00$lbShare', '');
        $("div.ConfirmChoice").hide();
    });

    $('div.PrivacySettings').hide();
    $("div.ConfirmChoice").show();
};

EM.global.handleChangePrivacy = function () {

    return (false);
};

EM.global.showError = function (type, headText, mainText) {
    var error_modal = $("div.EpicMixError");
    var elm;
    switch (type) {
        case 'facebook_error':
            elm = $("div.facebook_error", error_modal);
            break;

        case 'custom':
            $("div.custom .modal-head h4").text(headText);
            $("div.custom .modal-main").text(mainText);
            elm = $("div.custom", error_modal);
            break;

        case 'customhtml':
            $("div.custom .modal-head h4").text(headText);
            $("div.custom .modal-main").html(mainText);
            elm = $("div.custom", error_modal);
            break;

        case 'facebook_taken':
            elm = $("div.facebook_taken", error_modal);
            break;

        case 'server_error':
        default:
            elm = $("div.server_error", error_modal);
            break;
    }
    $(".modal_overlay").hide();
    $(".errorcase", error_modal).hide();
    $(elm).show();
    if ($("div.UIBlock").length) {
        $(error_modal).show();
    } else {
        EM.utilities.addOverlay('.EpicMixError');
    }
};

// Settings function that needs to be global
EM.Settings = EM.Settings || {};

EM.Settings.populateStatesDropdown = function ($countryDropdown) {

    var $states = $('select#columnCenter_ctl00_ddlAccountState, select#columnModals_ctl03_ddlAccountState'),
		selectedCountryName = $countryDropdown.val(),
		countriesWithProvinces = {
		    'United States': '/VailResorts/sites/epicmix/XMLs/states.xml'
		},
		options = "";
    if (selectedCountryName in countriesWithProvinces) {

        // get the corresponding file for the selected country and parse out it's provinces
        $.ajax({
            type: 'GET',
            url: countriesWithProvinces[selectedCountryName],
            dataType: 'xml',
            async: false,
            success: function (data) {

                // loop through each province/state in the file
                $(data).children().children().each(function (index) {
                    var $province = $(this).first(),
						disabled = index == 0 ? 'disabled="disabled"' : '';
                    // build the list of options
                    options += '<option ' + disabled + ' value="' + $province.children('name').text() + '">' + $province.children('name').text() + '</option>';
                });

                $states.empty().append(options).removeAttr('disabled');

                // fire an event to update the custom form style
                $states.trigger('epicMixFormChange', 'enable');

                // enable the postal code input field
                $('input#postal-code').removeAttr('disabled', 'disabled');
                $('input.account-postal-code').removeAttr('disabled', 'disabled');
            }
        });
    } else {
        $states.empty().append('<option value=""></option>').attr('disabled', 'disabled');

        // fire an event to update the custom form styling
        $states.trigger('epicMixFormChange', 'disable');

        // disable the postal code input field
        $('input#postal-code').val('').attr('disabled', 'disabled');
        $('input.account-postal-code').val('').attr('disabled', 'disabled');

    }

};


// ============================================================================
// FEED DISPATCHER
// ============================================================================

EM.FeedDispatcher = (function () {

    var self, pub,
        renderer = {
            speed: 4000,
            intervalHandler: null,
            method: 'EM.FeedDispatcher._renderFeeds()'
        },
        updater = {
            speed: 60000,
            intervalHandler: null,
            method: 'EM.FeedDispatcher._updateFeeds()',
            resultsPerFeed: 10
        },
        queue = {},
        feeds = {},
        feedSubscriptions = {}; // and object of feeds, with the elements subscribed to them.

    self = {
        // updated the queues by hitting all the feeds we are monitoring.
        updateFeeds: function () {

            // returns a function that processes the current feed
            var feedProcessorFactory = function (f) {
                var wrapped_feed = f;
                return function (data) {

                    var i,
						end = -1,
                    // the id of the last known item in the queue
						lastTime = feeds[wrapped_feed]['lastTime'],
                        lastId = feeds[wrapped_feed]['lastId'],
						tmpArray = [];


                    // get the last id we saw
                    if (lastTime != null && lastId != null) {

                        //filter older items from the feed
                        for (i in data.items) {
                            if (data.items[i]['time'] > lastTime) {
                                tmpArray.push(data.items[i]);
                            }
                        }

                        data.items = tmpArray;
                        // test to see if the last id we had is in the array, if so save its index
                        for (i in data.items) {
                            if (data.items[i]['id'] == lastId) {
                                end = i;
                                break;
                            }
                        }

                        // see if we have some of the items in the new data set
                        if (end > -1) {
                            data.items = data.items.slice(0, end);
                        }
                    }

                    if (data.items !== undefined) {
                        // add the feed items to the queue
                        queue[wrapped_feed] = queue[wrapped_feed].concat(data.items.reverse());

                        // set the lastid for the feed
                        feeds[wrapped_feed]['lastTime'] = (queue[wrapped_feed].length > 0) ? queue[wrapped_feed][(queue[wrapped_feed].length - 1)]['time'] : feeds[wrapped_feed]['lastTime'];
                        feeds[wrapped_feed]['lastId'] = (queue[wrapped_feed].length > 0) ? queue[wrapped_feed][(queue[wrapped_feed].length - 1)]['id'] : feeds[wrapped_feed]['lastId'];
                    }
                    // update the interval time
                    if (data.interval && (data.interval * 1000) != updater.speed) {
                        self.setUpdateIntervalSpeed(data.interval * 1000);
                    }
                    // update the animation time                    
                    if (data.animation && (data.animation * 1000) != renderer.speed) {
                        self.setRenderIntervalSpeed(data.animation * 1000);
                    }
                };
            };

            var feed;
            for (feed in feeds) {

                // create the queue and subscription arrays for this feed
                if (queue[feed] === undefined) queue[feed] = [];
                if (feedSubscriptions[feed] === undefined) feedSubscriptions[feed] = [];

                var feedProcessor = feedProcessorFactory(feed);

                $.getJSON(feeds[feed]['path'] + '&itemCount=' + updater.resultsPerFeed, feedProcessor);
            }

        },
        setUpdateIntervalSpeed: function (speed) {
            clearInterval(updater.handler);
            updater.handler = setInterval(updater.method, speed);
        },
        setRenderIntervalSpeed: function (speed) {
            clearInterval(renderer.handler);
            renderer.handler = setInterval(renderer.method, speed);
        },
        renderFeedItems: function () {
            var feed, subscriber, item, html;
            for (feed in feedSubscriptions) {
                // check for items in the queue
                if (queue[feed].length == 0) continue;
                // get the feed item to render from the queue
                item = queue[feed].shift();

                var bgStyle = item.bg !== undefined ? 'background-color: #' + item.bg + ';' : '';

                html = '<li id="item' + item.id + '_' + item.time + '" class="new ' + item.sourcetype + '" style="' + bgStyle + '">';

                if (!item.author.isPublic) {

                    if (item.author.isKid == "True") {
                        html += '<a href="/kids/User-Profile.aspx?pid=' + item.author.id + '"><img class="owner-icon" src="' + item.author.pic + '" alt="' + item.author.name + '" /></a>';
                    } else {
                        html += '<a href="/User-Profile.aspx?pid=' + item.author.id + '"><img class="owner-icon" src="' + item.author.pic + '" alt="' + item.author.name + '" /></a>';
                    }
                } else {
                    if (item.mountain.id > 0) {
                        item.mountain.pic = item.mountain.pic.replace("logo-", "logo.").replace(".png", "-50x50.png");
                    }
                    html += '<img class="owner-icon" src="' + item.mountain.pic + '" alt="' + item.mountain.name + '" />';
                }

                html += '<div class="body">';

                if (item.author !== undefined && item.author.name !== undefined && !item.author.isPublic) {
                    if (item.author.isKid == "True") {
                        html += '<h4><a href="/kids/User-Profile.aspx?pid=' + item.author.id + '">' + item.author.name + '</a>';
                    } else {
                        html += '<h4><a href="/User-Profile.aspx?pid=' + item.author.id + '">' + item.author.name + '</a>';
                    }
                }
                else if (item.mountain !== undefined && item.mountain.name !== undefined) {
                    html += '<h4>' + item.mountain.name;
                }
                else {
                    html += '<h4>';
                }

                if (item.preline !== undefined) {
                    html += ' <span class="verb">' + item.preline + '</span>';
                }
                html += '</h4>';

                html += '<p>' + item.body + '</p>';
                html += '<p class="time">' + item.subline;
                if (item.mountain.name !== undefined) {
                    if (feed == 'mountainFeed') {
                        html += '<span class="location"> at ' + item.mountain.name + '</span>';
                    } else {
                        html += '<span class="location"> at <a href="/Activity/' + item.mountain.name.replace(' ', '-') + '.aspx">' + item.mountain.name + '</a></span>';
                    }
                }
                html += '</p></div>';

                html += (item.moreUrl != null) ? '<a class="patch" href="' + item.moreUrl + '">' : '<a class="patch">';
                html += '<img class="type-icon" src="' + item.pic.url + '" />';
                if (item.pinInfo) {
                    html += '<span class="tooltip"><span class="title">' + item.pinInfo.name + '</span><span class="date">Earned ' + item.pinInfo.earned + '</span><span class="goal">' + item.pinInfo.description + '</span></span>';
                }
                html += '</a>';

                if (item.isShareable == true) {
                    html += '<div class="shareLinks"><a href="#" class="facebook"></a><a href="#" class="twitter"></a></div>';
                }

                html += '</li>';

                for (subscriber in feedSubscriptions[feed]) {
                    feedSubscriptions[feed][subscriber].prepend(html);
                    $('li.new').height('0px');
                    $('li.new', feedSubscriptions[feed][subscriber]).animate({ 'height': '55px' }, 1000, function () {
                        $(this).removeClass('new');
                    });
                }
            }
        }
    };

    pub = {
        init: function () {
            updater.handler = setInterval(updater.method, updater.speed);
            renderer.handler = setInterval(renderer.method, renderer.speed);

            // use to subscribe some element to a feed
            (function ($) {
                $.fn.subscribeToFeed = function (feed) {
                    return this.each(function () {
                        EM.FeedDispatcher.subscribe($(this), feed);

                    });
                };
            } (jQuery));

        },
        subscribe: function ($elem, newFeed) {

            var feedName;
            for (feedName in newFeed) {
                if (queue[feedName] === undefined) queue[feedName] = [];
                var $last = $('li:first', $elem);
                if (feeds[feedName] === undefined) feeds[feedName] = {
                    'path': newFeed[feedName],
                    'lastId': $last.length > 0 ? parseInt($last.attr('id').slice(4).split("_")[0]) : null,
                    'lastTime': $last.length > 0 ? parseInt($last.attr('id').slice(4).split("_")[1]) : null
                };
                if (feedSubscriptions[feedName] === undefined) feedSubscriptions[feedName] = [];
                feedSubscriptions[feedName].push($elem);
            }
        },
        _updateSubscribers: function () {
            self.updateSubscribers();
        },
        _updateFeeds: function () {
            self.updateFeeds();
        },
        _renderFeeds: function () {
            self.renderFeedItems();
        }
    };

    return pub;

})();

// ============================================================================
// FEED ITEM HANDLERS
// ============================================================================

EM.FeedItems = (function () {
    var pub = {
        init: function () {
            // share items via social network
            $('div.shareLinks').delegate('a', 'click', function (e) {
                e.preventDefault();
                pub.share($(e.target));
            });
        },
        share: function ($elem) {
            var id = $elem.parent().parent().attr('id').slice(4),
                network = $elem.hasClass('facebook') ? 'facebook' : 'twitter';

            id = id.split('_')[0];  // id is concatenation of feedEntryId and unix timestamp; pull just feedEntryId

            // add the ajax spinner indicator
            $elem.addClass('loading');

            $.ajax({
                type: 'POST',
                url: '/VailResorts/sites/epicmix/handlers/Share.ashx',
                dataType: 'json',
                data: { 'method': 'Feed', 'network': network, 'feedEntryId': id },
                success: function (data) {
                    $elem.removeClass('loading');
                    if (data.response.status == 'SUCCESS') {
                        EM.global.showError('custom', null, data.response.message);
                    } else if (data.response.shareurl) {
                        if (network == 'twitter') {
                            var shareurl = data.response.shareurl;
                            shareurl = shareurl.replace('#', '%23');
                            window.open(shareurl);
                        } else {
                            var sharename = "EpicMix";
                            var sharecaption = "";
                            var sharedescription = "";
                            var pinurl = "";
                            var shareurl = "";
                            if (data.response.sharename !== undefined || data.response.sharename !== null) {
                                sharename = data.response.sharename;
                            }
                            if (data.response.sharecaption !== undefined || data.response.sharecaption !== null) {
                                sharecaption = data.response.sharecaption;
                            }
                            if (data.response.sharedescription !== undefined || data.response.sharedescription !== null) {
                                sharedescription = data.response.sharedescription;
                            }
                            if (data.response.pinurl !== undefined || data.response.pinurl !== null) {
                                pinurl = data.response.pinurl;
                            }
                            if (data.response.shareurl !== undefined || data.response.shareurl !== null) {
                                shareurl = data.response.shareurl;
                            }
                            pinurl = pinurl.replace("https", "http");
                            FB.ui(
						   {
						       method: 'stream.publish',
						       attachment: {
						           name: sharename,
						           caption: sharecaption,
						           href: shareurl,
						           description: sharedescription,
						           media: [{ type: 'image', src: pinurl, href: shareurl}]
						       },
						       user_message_prompt: 'Share EpicMix on Facebook'
						   },
						   function (response) {
						       if (response && response.post_id) {
						           EM.global.showError('custom', null, "Your post has been published");
						       }
						   }
						 );
                        }

                    } else {
                        EM.global.showError('custom', null, data.response.reason);
                    }
                }
            });
        }
    };

    return pub;
})();

// ============================================================================
// TWITTER HANDLER
// ============================================================================

EM.Twitter = EM.Twitter || {};

EM.Twitter.servicePath = '/VailResorts/sites/epicmix/handlers/TwitterAuth.ashx';
EM.Twitter.callback = null;

EM.Twitter.beginAuth = function (callback) {
    EM.Twitter.callback = callback;
    var popup = window.open(EM.Twitter.servicePath, null, 'location=0,status=0,toolbar=0,width=800,height=500');
    var interval = setInterval(function () {
        var twitterData = null;
        try {
            twitterData = popup.twitterData;
        } catch (e) { }
        if (popup.closed || twitterData) {
            if (!popup.closed) {
                EM.Twitter.setUserData(twitterData);
            }
            clearInterval(interval);
            interval = null;
            popup.close();
            popup = null;
        }
    }, 1000);
};

EM.Twitter.logout = function (callback) {
    EM.Twitter.callback = callback;
    EM.Twitter.setUserData({ username: '' });
};

EM.Twitter.setUserData = function (twitterData) {
    if (twitterData.username != null) {
        $.ajax({
            type: 'POST',
            url: EM.Twitter.servicePath,
            dataType: 'json',
            data: twitterData,
            success: function (data) {
                EM.Twitter.callback.call(null, data.response);
            },
            error: function () {
                EM.Twitter.callback();
            }
        }); 
    } else {
        var errorData = { status: 'FAILURE', reason: twitterData.error };
        EM.Twitter.callback(errorData);
    }
};

EM.Twitter.hasTwitter = function() {
    $.ajax({
        type: "GET",
        url: "/vailresorts/sites/epicmix/handlers/profile.ashx",
        dataType: "json",
        data: ({
            method: "HasTwitter"
        }),
        success: function (data) {
            $(document).trigger("hasTwitterSuccess", data);
        },
        error: function () {
            EM.global.showError("custom", "Error", "An error has occured with the request, please try again later.");
        }
    });
};

// ============================================================================
// SIGNOUT HANDLER
// ============================================================================

// Commented this out because it overrides the method found in LogOutManager.js which is required for the web sites (not just mix)
// This needs to be moved to a mobile only javascript file
//function SignOut() {
//	var serviceurl = '/VailResorts/sites/epicmix/handlers/Mobile/Authentication.ashx';

//	$.ajax({
//		type: 'POST',
//		url: serviceurl,
//		async: true,
//		timeout: 10000,
//		dataType: 'json',
//		data: "method=Logout&redirectLink=false",
//		success: function (data) {
//			var response = data.response.status;
//			if (response == "SUCCESS") {
//				window.location.replace('/home.aspx');
//			}
//		},
//		error: function () { }
//	});
//}

// ============================================================================
// MINICART 
// ============================================================================

EM.miniCart = EM.miniCart || {};

EM.miniCart.cart = $('#minicart');
EM.miniCart.tab = $('#minicart .cart-link');
EM.miniCart.panel = $('#minicart .panel');
EM.miniCart.added = $('#minicart .added');

EM.miniCart.hideEvent = null;

EM.miniCart.init = function () {

    // load the initial contents of the cart
    EM.miniCart.getSummary();

    // hover events to toggle open/close of minicart

    $("#minicart a.cart-link").hover(function () {
        $(this).parent().find(".panel").stop(true, true).slideDown('fast').show();
        $(this).parent().hover(function () {
        }, function () {
            $(this).parent().find(".panel").slideUp('fast');
        });
    });

}

EM.miniCart.getSummary = function () {
    $.ajax({
        url: "/VailResorts/sites/epicmix/api/Cart/Summary.ashx",
        type: "POST",
        success: EM.miniCart.summarySuccess,
        error: EM.miniCart.summaryError
    });
}

EM.miniCart.addToCart = function (args) {
    $.ajax({
        url: "/VailResorts/sites/epicmix/api/Cart/Add.ashx",
        data: args,
        type: 'POST',
        success: EM.miniCart.addSuccess,
        error: EM.miniCart.addError
    });
}

EM.miniCart.updateCart = function (data) {

    data = data || {};

    var count = (null != data.Quantity) ? data.Quantity : 0;
    var plural = (count != 1) ? true : false;

    // update the count in the tab
    $('.count', EM.miniCart.tab).html(count);
    if (plural) {
        $('.plural', EM.miniCart.tab).show();
    } else {
        $('.plural', EM.miniCart.tab).hide();
    }

    // show/hide the action area, update the count and total
    $('#minicart .actionArea').hide();
    if (count > 0) {
        $('#minicart .actionArea').show();
    }
    $('#minicart .actionArea .count').html(count);
    //Rob A:  changed because I had to remove the UnitPrice off the cartModel object.
    var price = 0;
    if (count > 0)
        price = data.Photos[count - 1].HighResUnitPrice;
    $('#minicart .actionArea .price').html(price);
    $('#minicart .actionArea .total span').html((count * price).toFixed(2));

    var extraPhotos = 0;
    if (data.Photos.length > 6) {
        data.Photos = data.Photos.slice(0, 5);
        extraPhotos = data.Quantity - 5;
    }

    // build the set of thumbnails
    $('#minicart_tmpl').tmpl({
        photos: data.Photos,
        quantity: data.Quantity,
        extra: extraPhotos
    }).appendTo($('#minicart .photos').empty());
}

EM.miniCart.summarySuccess = function (data) {

    data = data || {};

    EM.miniCart.updateCart(data);

}

EM.miniCart.summaryError = function (data) {
}

EM.miniCart.addSuccess = function (data) {

    data = data || {};

    EM.miniCart.updateCart(data);

    EM.miniCart.added.show();

    EM.miniCart.showCart();

    EM.miniCart.hideEvent = setTimeout(EM.miniCart.hideCart, 5000);

}

EM.miniCart.addError = function (data) {
}

EM.miniCart.showCart = function (oEvent) {
    clearTimeout(EM.miniCart.hideEvent);
    EM.miniCart.panel.show();
}

EM.miniCart.hideCart = function (oEvent) {
    EM.miniCart.panel.hide();
    EM.miniCart.added.hide();
}

EM.global.pageLoad(
    EM.global.setupUi,
    EM.checkQueryStrings,
    EM.FeedItems.init,
    EM.FeedDispatcher.init,
    EM.Feedback.init,
    EM.miniCart.init
);