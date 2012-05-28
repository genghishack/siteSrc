// creating global brightcove variables
var bcExp;
var modVP;
var modExp;
var modCon;
var modMed;
var vidload = false;
var autoplay = false;

// called when template loads, this function stores a reference to the player and modules.
function onTemplateLoaded(experienceID) {
    bcExp = brightcove.getExperience(experienceID);
    modVP = bcExp.getModule(APIModules.VIDEO_PLAYER);
    modExp = bcExp.getModule(APIModules.EXPERIENCE);
    modCon = bcExp.getModule(APIModules.CONTENT);
    modExp.addEventListener(BCExperienceEvent.CONTENT_LOAD, onContentLoad);
}

// once the content has loaded and is display autoplay the module(or don't)
function onContentLoad(evt) {
    vidload = true;
    if (autoplay) {
        modVP.play();
    }
}

//function call to stop video from outside source
function stopVideo() {
	if ($('.BrightcoveExperience').length > 0) {
		try {
			modVP.stop();
		} catch (e) { }
    }
    return false;
}

// place a brightcove player with the proper parameters on the page
function brightcovePlayer(vid, vidID, playerID, width, height, auto) {
    var bcObject = '<object id="' + vidID + '" class="BrightcoveExperience"><param name="bgcolor" value="#FFFFFF" /><param name="width" value="' + width + '" /><param name="height" value="' + height + '" /><param name="playerID" value="' + playerID + '" /><param name="playerKey" value="AQ%2E%2E%2CAAAAAA6sN2o%2E%2Co4JjcLhRZ0FrrXSB4L_SUb4_n2OnuoVr" /><param name="majorVersion" value="9.0.28" /><param name="isVid" value="true" /><param name="isUI" value="true" /><param name="dynamicStreaming" value="true" /><param name="@videoPlayer" value="' + vidID + '" />';
    if (location.protocol == 'https:') {
        // add secure parameter
        bcObject = bcObject + '<param name="secureConnections" value="true" /></object>';
    }
    else {
        bcObject = bcObject + '</object>';
    }

    $(vid).prepend(bcObject);
    autoplay = auto;
}

// when the user has triggered a button to play a video, determine videos location and play
function playVideo(vidID, modal) {
    //This seems to break in my version of IE for some reason. 
    //if(EM.utilities.hasFlashPlugin()){
        //test if modals are there with .length on a selector $(div).length == 0 is not on the page
        if (modal) {

            EM.utilities.addOverlay('.VideoOverlay');

            //$('.BrightcoveExperience').css({
            $('#' + vidID).css({
                'display': 'block'
            });
            if (autoplay && vidload) {
                modVP.play();
            }
        } else {
            $('img.vid').hide();
            $('span.play').hide();
            $('span.playutil').hide();
            $('#' + vidID).css({
                'display': 'block'
            });
        }
    //}
}
