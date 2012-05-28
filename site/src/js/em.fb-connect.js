var EM = EM || {};

EM.FBConnect = EM.FBConnect || {};
EM.FBConnect_isLoggedIn = false;

EM.FBConnect.init = function () {
    if ($("#Content #Aside div.invite-placeholder").length) {
        EM.FBConnect.AddFriendsInit();
        $("a.fb_connect").live('click', function () {
            EM.NumModalSteps = 4;
            EM.FBConnect.AddFriendsConnect(this);
            return (false);
        });
    }

    if ($("#fb_like").length) {
        FB.XFBML.parse(document.getElementById("fb_like"));
    }
    if ($("#Facebook").length) {
        FB.XFBML.parse(document.getElementById("Facebook"));
    }
    var url = document.location.href.toLowerCase();
    if (url.match(/\/epicmix\/home\.aspx/) || (url.match(/\/dashboard\//) && !url.match(/\/activity\//))) {
        EM.NumModalSteps = 4;
        EM.global.setupPrivacyModals();
        $("a.fb_connect").live('click', function () {
            EM.FBConnect.connectAccount(this);
            return (false);
        });
    }
    if (url.match(/\/epicmix\/home\.aspx/) && EM.utilities.getQuerystring('af') == "1") {
        $("a.fb_connect").click();
    }

    $("#dvFacebookLogin a").click(function () {
        EM.NumModalSteps = 4;
        EM.FBConnect.connectAccount(this);
        return (false);
    });

    $("a.fb_logout").live('click', function () {
        FB.logout(function (response) {
            EM.utilities.reloadPage();
        });

    });
};

EM.FBConnect.AddFriendsInit = function () {
    FB.getLoginStatus(function (response) {
        if (response.session) {
            // logged in and connected user, someone you know
            FB.XFBML.parse();
            $("div.invite-placeholder").show();
            $("a.fb_connect").hide();
            $("a.fb_logout").show();
        } else {
            // no user session available, someone you dont know
            $("div.invite-placeholder").hide();
            $("a.fb_connect").show();
            $("a.fb_logout").hide();
        }
    });
};

//=================================================//
//New user login code

EM.FBConnect.userLogin = function () {
    FB.login(function (response) {
        if (response.authResponse && response.status == "connected") {
            $(document).trigger("facebook-authorize", response.authResponse);
        } else {
            EM.FBConnect.facebookConnectError();
        }
    },
    { scope: 'read_stream,publish_stream,offline_access,user_photos' });
};

EM.FBConnect.setAccessToken = function (authResponse) {
    $.ajax({
        type: 'POST',
        url: '/vailresorts/sites/epicmix/handlers/dashboard.ashx',
        dataType: 'json',
        data: {
            "method": "SetFacebookAuth",
            "accessToken": authResponse.accessToken,
            "facebookId": authResponse.userID
        },
        success: function () {
            $(document).trigger("setAuthSuccess");
        },
        error: function () {
            EM.FBConnect.facebookConnectError();
            return (false);
        }
    });
};

//End new user login code
//=================================================//

EM.FBConnect.connectAccountNoPrivacyPopup = function (loginSuccess, setAccessTokenSuccess) {
    loginSuccess = loginSuccess || function () { };

    //Used to retain old functionality, replicating old callback on success
    var authSuccessCallback = function() {
        EM.FBConnect.getShareSettings();
        setAccessTokenSuccess();
    };
    $(document).unbind("setAuthSuccess", authSuccessCallback);
    $(document).bind("setAuthSuccess", authSuccessCallback);

    FB.login(function (response) {
        if (response.authResponse && response.status == "connected") {
            EM.FBConnect_isLoggedIn = true;
            loginSuccess(); //for signup, want to check that the user successfully logged in.
            EM.FBConnect.setAccessToken(response.authResponse);
        } else if (response.session && response.status == "connected") {
            EM.FBConnect_isLoggedIn = true;
            loginSuccess(); //for signup, want to check that the user successfully logged in.

            response.session.userID = response.session.uid;
            response.session.accessToken = response.session.access_token;
            EM.FBConnect.setAccessToken(response.session);
        } else {
            EM.FBConnect.facebookConnectError();
        }
    },
    { scope: 'read_stream,publish_stream,offline_access,user_photos' });
};

EM.FBConnect.facebookConnectError = function () {
    EM.newPrivacy = 0;
    EM.global.setPrivacy(EM.newPrivacy, function () {});
    EM.global.showError("custom", "Error", "There was an error associating your Facebook account. For now, your account has been set to Public Basic. You can try again later via Privacy Settings.");
};

EM.FBConnect.getShareSettings = function () {
    $.ajax({
        type: 'GET',
        url: '/vailresorts/sites/epicmix/handlers/profile.ashx',
        dataType: 'json',
        data: 'method=GetShareSettings',
        success: EM.FBConnect.getShareSettingsSuccess,
        error: function () {
            EM.global.showError("custom", "Error", "There was an error retrieving share settings.  You may continue with new selections or try again later via Privacy Settings." );
            return (false);
        }
    });
};

EM.FBConnect.getShareSettingsSuccess = function (output) {
    if (output !== null && output !== undefined && output.privacy !== undefined && output.checkin !== undefined && output.pin !== undefined && output.level !== undefined) {

        var privacy = output.privacy,
            checkin = output.checkin,
            pin = output.pin,
            level = output.level;

        if (privacy != 1) {
            EM.global.prepopulatePrivacySettings(1, pin, level, checkin);
            EM.FBConnect.setFacebook();
        } else {
            $("div.PrivacySettings").hide();
            $("div.UIBlock").remove();
        }
    } else if (output !== undefined && output.response.status !== undefined && output.response.reason !== undefined && output.response.reason.toLowerCase() == "insecure protocol used") {
        window.location = "https://" + window.location.hostname + '/home.aspx?af=1';
        return (false);
    } else {
        EM.global.showError("custom", "Error", "There was an error retrieving share settings.  You may continue with new selections or try again later via Privacy Settings.");
        return (false);
    }
};

EM.FBConnect.setFacebook = function () {
    $.ajax({
        type: 'POST',
        url: '/vailresorts/sites/epicmix/handlers/dashboard.ashx',
        dataType: 'json',
        data: 'method=SetFacebook',
        success: EM.FBConnect.setFacebookSuccess,
        error: function () {
            EM.global.showError("custom", "Error", "There was an error retrieving Facebook friend info.  You can try again later via Privacy Settings.");
            return (false);
        }
    });
};

EM.FBConnect.setFacebookSuccess = function (output) {
    if (output !== undefined && output.status !== undefined && output.status == 'SUCCESS' && output.friends !== undefined) {

        var friends = output.friends,
            count = 0,
            friendhtml = '';

        EM.FBConnect.friendCount = friends.length;

        for (var i in friends) {
            var friend = friends[i];
            friendhtml += '<li>';
            friendhtml += '<p class="thumb"><img height="50" width="50" alt="" src="' + friend.profilePic + '"></p>';
            friendhtml += '<p class="user">' + friend.name + '</p>';
            friendhtml += '</li>';
            count++;
        }
        $('div.ViewFriends div.modal-head h4').text(count + " " + $('div.ViewFriends div.modal-head h4').text());
        $('div.ViewFriends div.modal-main ul').html(friendhtml);
    } else {
        if (output.response !== undefined && output.response.status !== undefined && output.response.reason !== undefined && output.response.status == 'FAILURE' && output.response.reason == 'Facebook Taken') {
            EM.global.showError("facebook_taken");
            return (false);
        }
        EM.global.showError("custom", "Error", "There was an error while retrieving your Facebook friends.  You can try again later via Privacy Settings.");
        return (false);
    }
};

EM.FBConnect.connectAccount = function (elm) {
    var privacyHeader = '';
    if ($(elm).hasClass("login")) {
        privacyHeader = 'In order to connect to Facebook through EpicMix, you will need to update your settings to Public Social:';
    } else if ($(elm).hasClass("logout")) {
        privacyHeader = 'In order to logout of Facebook, you will need to update your settings to Public Basic or Private:';
    }
    if (privacyHeader !== '') {
        $("div.PrivacySettings div.modal-head h4").html(privacyHeader);
    }
    $.ajax({
        type: 'POST',
        url: '/vailresorts/sites/epicmix/handlers/profile.ashx',
        dataType: 'json',
        data: { method: 'GetShareSettings' },
        success: function (output) {
            if (output !== null && output !== undefined && output.privacy !== undefined && output.checkin !== undefined && output.pin !== undefined && output.level !== undefined) {
                var privacy = output.privacy;
                var checkin = output.checkin;
                var pin = output.pin;
                var level = output.level;
                EM.currentPrivacy = privacy;
                if (privacy != 1 || true) {
                    EM.global.prepopulatePrivacySettings(privacy, pin, level, checkin);
                    EM.utilities.addOverlay('.PrivacySettings');
                    if (privacy == 1) {
                        EM.global.setPrivacyModalsNumbering('social');
                    } else {
                        EM.global.setPrivacyModalsNumbering();
                    }
                }
            } else if (output !== undefined && output.response.status !== undefined && output.response.reason !== undefined && output.response.reason.toLowerCase() == "insecure protocol used") {
                window.location = "https://" + window.location.hostname + '/home.aspx?af=1';
                return (false);
            } else {
                EM.global.showError("server_error");
                return (false);
            }
        },
        error: function () {
            EM.global.showError("server_error");
            return (false);
        }
    });
    return (false);
};

EM.FBConnect.AddFriendsConnect = function () {
    FB.getLoginStatus(function (response) {
        if (response.session) {
            // logged in and connected user, someone you know
        } else {
            // no user session available, someone you dont know
            FB.login(function (response) {
                if (response.session) {
                    FB.XFBML.parse();
                    if (response.perms) {
                        // user is logged in and granted some permissions.
                        // perms is a comma separated list of granted permissions
                        window.location = "/Dashboard/Add-Friends.aspx";
                    } else {
                        // user is logged in, but did not grant any permissions
                        // TODO
                    }
                } else {
                    // user is not logged in
                    // TODO
                }
            }, { perms: 'publish_stream,offline_access' });
        }
    });
};

EM.global.pageLoad(EM.FBConnect.init);