
window.onload = addListenerToButton;
function addListenerToButton()
{
    document.getElementById("settings").addEventListener("click", goToSettings);
    document.getElementById("settings2").addEventListener("click", goToSettings);
}


function goToSettings()
{ 
    //chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id });
    chrome.tabs.create({ 'url': 'chrome://settings/?options=' + chrome.runtime.id });
}

// google analytics:
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-66616134-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();


// tracking buttons
// google analytics:
/*
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-66616134-1']);
_gaq.push(['_trackPageview']);
*/

function trackButtonClick(e) {
  _gaq.push(['_trackEvent', e.target.id, 'clicked']);
}

/**
 * Now set up your event handlers for the popup's `button` elements once the
 * popup's DOM has loaded.
 */
document.addEventListener('DOMContentLoaded', function () {
  var buttons = document.querySelectorAll('button');
  for (var i = 0; i < buttons.length; i++) {
    // console.log("tracking readme "+buttons[i].id);
    buttons[i].addEventListener('click', trackButtonClick);
  }
  
  var hyperlinks = document.querySelectorAll('a');
  for (var i = 0; i < hyperlinks.length; i++) {
    // console.log("tracking hyperlinks: "+hyperlinks[i].id);
    hyperlinks[i].addEventListener('click', trackButtonClick);
  }
});