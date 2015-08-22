
function Rule(data) {
    //console.log("data: " + JSON.stringify(data));

  var rules = document.getElementById('rules');
  document.getElementById("rulesTitle").style.display = "block";
  this.node = document.getElementById('rule-template').cloneNode(true);
  this.node.id = 'rule' + (Rule.next_id++);
  this.node.rule = this;
  rules.appendChild(this.node);
  this.node.hidden = false;

  if (data) {
    this.getElement('fn-select').value = data.fnSelect;
    this.getElement('andOr').value = data.andOr;
    this.getElement('ext-select').value = data.extSelect;
    this.getElement('fn-regex-input').value = data.fnInput;
    this.getElement('ext-regex-input').value = data.extInput;
    this.getElement('folder-input').value = data.folder;
    this.getElement('enabled').checked = data.enabled;
  }

  this.getElement('enabled-label').htmlFor = this.getElement('enabled').id = this.node.id + '-enabled';
  this.render();

  //this.getElement('regex').onchange = definePlaceholdersForRule; // storeRules
  //this.getElement('regex').setAttribute('onchange', 'definePlaceholdersForRule');
  fnRegInpt = this.getElement('fn-regex-input');
  extRegInpt = this.getElement('ext-regex-input');
  var node_id = this.node.id;
  
  //console.log("fnRegInpt el: " + fnRegInpt.value);
  //console.log("extRegInpt el: " + extRegInpt.value);
  
  //this.getElement('fn-select').onchange = function () {setPlaceholders(this, rules, node_id, "fn-regex-input") };
  this.getElement('fn-select').onchange = function () {setDisabledAndPlaceholders(this.className, "fn-regex-input") };
  
  //this.getElement('ext-select').onchange = function () {setPlaceholders(this, rules, node_id, "ext-regex-input") };
  this.getElement('ext-select').onchange = function () {setDisabledAndPlaceholders(this.className, "ext-regex-input") };

  
  // this.getElement('regex-input').onkeyup = storeRules;
  this.getElement('folder-input').onchange = storeRules;
  this.getElement('enabled').onchange = storeRules;

  var rule = this;
  this.getElement('move-up').onclick = function() {
    var sib = rule.node.previousSibling;
    rule.node.parentNode.removeChild(rule.node);
    sib.parentNode.insertBefore(rule.node, sib);
    storeRules();
  };
  this.getElement('move-down').onclick = function() {
    var parentNode = rule.node.parentNode;
    var sib = rule.node.nextSibling.nextSibling;
    parentNode.removeChild(rule.node);
    if (sib) {
      parentNode.insertBefore(rule.node, sib);
    } else {
      parentNode.appendChild(rule.node);
    }
    storeRules();
  };
  
  this.getElement('remove').onclick = function() {
    if (rule.node.parentNode.children.length == 1) // means now we're removing the last child
        document.getElementById("rulesTitle").style.display = "none";

    rule.node.parentNode.removeChild(rule.node);
    storeRules();
  };
  
  setDisabledAndPlaceholders("fn-select", "fn-regex-input");
  setDisabledAndPlaceholders("ext-select", "ext-regex-input");
  storeRules();
}

Rule.prototype.getElement = function(name) {
  return document.querySelector('#' + this.node.id + ' .' + name);
}


Rule.prototype.render = function() {
  this.getElement('move-up').disabled = !this.node.previousSibling;
  this.getElement('move-down').disabled = !this.node.nextSibling;
}

Rule.next_id = 0;

function loadRules() {
  var rules = localStorage.rules;  
  try {
    JSON.parse(rules).forEach(function(rule) {new Rule(rule);});

  } catch (e) {
    localStorage.rules = JSON.stringify([]);
  }
}

function checkAndStoreRules() 
{
    storeRules();
    document.getElementById('saveDisk').style.display="none";
    document.getElementById('savedcheck').style.display="inline";
    setTimeout(function(){
        document.getElementById('savedcheck').style.display="none";
        document.getElementById('saveDisk').style.display="inline";        
        }, 1000);
    
}

function storeRules() {
  localStorage.rules = JSON.stringify(Array.prototype.slice.apply(
      document.getElementById('rules').childNodes).map(function(node) {
      node.rule.render();
      var store_value = {fnSelect: node.rule.getElement("fn-select").value,
                andOr: node.rule.getElement("andOr").value,
                extSelect: node.rule.getElement("ext-select").value,
                fnInput: node.rule.getElement("fn-regex-input").value,
                extInput: node.rule.getElement("ext-regex-input").value,
                folder: node.rule.getElement('folder-input').value,
                enabled: node.rule.getElement('enabled').checked};
      
      return store_value
  }));  
  
}

function clearAll()
{
  //console.log("clearing");
  var r = confirm("Clear all rules?");
  if (r == true) {
    //document.getElementById("rulesTitle").style.display = "none";
    localStorage.rules = JSON.stringify([]);
    //loadRules();
    location.reload();
  }
  
  
}

function readme()
{
  window.open('readme.html'); 
}

function nextVersion()
{
    alert("This feature will be supported in the next version");
}

function setDisabledAndPlaceholders(regSelection, inputClass)
{
    //console.log("regSelection: "+regSelection + " - inputClass: " + inputClass);
    
    var rules = document.getElementById('rules');    
    for (i = 0; i < rules.childElementCount; i++) { 
        var rule = rules.children[i];
        var selectionElement = rule.getElementsByClassName(regSelection)[0];
        var inputElement = rule.getElementsByClassName(inputClass)[0];
        
        // on "any" selection, always empty the input to show the placeholder.
        if (selectionElement.value.substring(0,3) == "any")
            inputElement.value = "";
        
        var selectedIndex = selectionElement.selectedIndex;
        var placeholder = selectionElement[selectedIndex].getAttribute("placeholder");
        inputElement.placeholder = placeholder;
        var inputDisabled = selectionElement[selectedIndex].getAttribute("inputDisabled");
        inputElement.disabled = inputDisabled;
        
    }
}

function shareOnFacebook() {
    var x= "Downloads Organizer extension";
    var z = x.bold();
    var chromeStoreUrl = "https://chrome.google.com/webstore/detail/downloads-organizer/ojcigfnpgjnigkofinamblilahbdghgi?utm_source=gmail";
    var url = "https://www.facebook.com/dialog/feed?\
    app_id=145634995501895&\
    link="+chromeStoreUrl+"&\
    display=popup&\
    caption="+z+"&\
    redirect_uri=https%3A%2F%2Fwww.facebook.com%2F&\
    name=I'm also organizing my downloads using "+z+"&\
    actions=%5B%7B%22name%22%3A%22get%20Downloads%20Organizer%20now%22%2C%22link%22%3A%22%20https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdetail%2Fdownloads-organizer%2Fojcigfnpgjnigkofinamblilahbdghgi%3Futm_source%3Dgmail%22%7D%5D";
   
  var win = window.open(url, '_blank');
  win.focus();
}

function updateVersion() {
    var version = chrome.app.getDetails().version;
    document.getElementById("version").innerHTML = "version " + version;
}

window.onload = function() {
  loadRules();
  document.getElementById('savedcheck').style.display="none";
  setDisabledAndPlaceholders("fn-select", "fn-regex-input");
  setDisabledAndPlaceholders("ext-select", "ext-regex-input");
  document.getElementById('new').onclick = function() {new Rule();};
  document.getElementById('save').onclick = checkAndStoreRules;
  document.getElementById('clearAll').onclick = clearAll;
  document.getElementById('readme').onclick = readme;
  document.getElementById('shareOnFacebook').onclick = shareOnFacebook;
  document.getElementById('exportRules').onclick = nextVersion;
  document.getElementById('importRules').onclick = nextVersion;
  updateVersion();
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
    buttons[i].addEventListener('click', trackButtonClick);
  }
});