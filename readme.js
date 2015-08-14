
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
