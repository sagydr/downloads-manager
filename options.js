// Copyright (c) 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function Rule(data) {
  var rules = document.getElementById('rules');
  this.node = document.getElementById('rule-template').cloneNode(true);
  this.node.id = 'rule' + (Rule.next_id++);
  this.node.rule = this;
  rules.appendChild(this.node);
  this.node.hidden = false;

  if (data) {
    this.getElement('regex').value = data.regex;
    this.getElement('regex-input').value = data.input;
    this.getElement('folder').value = data.folder;
    this.getElement('enabled').checked = data.enabled;
  }

  this.getElement('enabled-label').htmlFor = this.getElement('enabled').id = this.node.id + '-enabled';
  this.render();

  //this.getElement('regex').onchange = definePlaceholdersForRule; // storeRules
  //this.getElement('regex').setAttribute('onchange', 'definePlaceholdersForRule');
  regInpt = this.getElement('regex-input');
  this.getElement('regex').onchange = function () {setPlaceholders(this, regInpt) };
  
  this.getElement('regex-input').onkeyup = storeRules;
  this.getElement('folder').onchange = storeRules;
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
    rule.node.parentNode.removeChild(rule.node);
    storeRules();
  };
  storeRules();
}

Rule.prototype.getElement = function(name) {
  return document.querySelector('#' + this.node.id + ' .' + name);
}

function setPlaceholders(regSelection, regInpt)
{
    // console.log("setPlaceholders - "+regSelection.value + " - " + regInpt.value);
    if (regInpt.value == "")
    {
        switch(regSelection.value) {
            case "contains":
                regInpt.placeholder = "input e.g. 'tor', 'game',...";
                break;
            case "extension":
                regInpt.placeholder = "input e.g. 'jpg', 'torrent',...";
                break;
            case "regexMatch":
                regInpt.placeholder = "input e.g. .*torrent.*";
                break;
            default:
                regInpt.placeholder = "input";
        }
    }
    storeRules();
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

function storeRules() {
  localStorage.rules = JSON.stringify(Array.prototype.slice.apply(
      document.getElementById('rules').childNodes).map(function(node) {
    node.rule.render();
    return {regex: node.rule.getElement('regex').value,
            input: node.rule.getElement('regex-input').value,
            folder: node.rule.getElement('folder').value,
            enabled: node.rule.getElement('enabled').checked};
  }));
}

function clearAll()
{
  console.log("clearing");
  localStorage.rules = JSON.stringify([]);
  //loadRules();
  location.reload();
  
}

function readme()
{
  console.log("readme");
  window.open('readme.html');
  
}

/*
function chooseFolder()
{
  var path = new File("~/desktop");
  var file = path.openDlg("Choose File:");
  alert("file: "+file);
}
*/

window.onload = function() {
  loadRules();
  document.getElementById('new').onclick = function() {new Rule();};
  document.getElementById('clearAll').onclick = clearAll;
  document.getElementById('readme').onclick = readme;
}