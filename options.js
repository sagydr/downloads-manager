// Copyright (c) 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function Rule(data) {
    console.log("data: " + data);
    console.log("data: " + JSON.stringify(data));

  var rules = document.getElementById('rules');
  this.node = document.getElementById('rule-template').cloneNode(true);
  this.node.id = 'rule' + (Rule.next_id++);
  this.node.rule = this;
  rules.appendChild(this.node);
  this.node.hidden = false;

  if (data) {
    console.log("data!");
    this.getElement('fn-select').value = data.fnSelect;
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
  
  console.log("fnRegInpt el: " + fnRegInpt.value);
  console.log("extRegInpt el: " + extRegInpt.value);
  this.getElement('fn-select').onchange = function () {setPlaceholders(this, rules, node_id, "fn-regex-input") };
  this.getElement('ext-select').onchange = function () {setPlaceholders(this, rules, node_id, "ext-regex-input") };
  //this.getElement('ext-select').onchange = function () {setPlaceholders(this, extRegInpt) };
  
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
    rule.node.parentNode.removeChild(rule.node);
    storeRules();
  };
  storeRules();
}

Rule.prototype.getElement = function(name) {
  return document.querySelector('#' + this.node.id + ' .' + name);
}

function setPlaceholders(regSelection, rules, rule_id, inputClass)
{
    console.log("setPlaceholders - "+regSelection.value + " - " + rules + " - " + rule_id);
    for (i = 0; i < rules.childElementCount; i++) { 
        if (rules.children[i].id == rule_id)
        {
            var input = rules.children[i].getElementsByClassName(inputClass)[0]
            if (input.value == "")
            {
                switch(regSelection.value) {
                    case "match":
                        input.disabled = false;
                        input.placeholder = "input: e.g. 'myFile', ...";
                        break;
                    case "contains":
                        input.disabled = false;
                        input.placeholder = "input: e.g. 'jpg', 'torrent',...";
                        break;
                    case "regexMatch":
                        input.disabled = false;
                        input.placeholder = "input: e.g. .*torrent.*";
                        break;
                    case "none":
                        input.disabled = true;
                        input.placeholder = "";
                        break;
                    default:
                        input.placeholder = "input";
                }
            }
            else if(regSelection.value == "none")
                input.disabled = true;
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
        
        return {fnSelect: node.rule.getElement("fn-select").value,
                extSelect: node.rule.getElement("ext-select").value,
                fnInput: node.rule.getElement("fn-regex-input").value,
                extInput: node.rule.getElement("ext-regex-input").value,
                folder: node.rule.getElement('folder-input').value,
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

function nextVersion()
{
    alert("This feature will be supported in the next version");
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
  document.getElementById('exportRules').onclick = nextVersion;
  document.getElementById('importRules').onclick = nextVersion;
}