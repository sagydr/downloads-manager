chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello")
      chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id });
  });

chrome.downloads.onDeterminingFilename.addListener(function(item, __suggest) {
  function suggest(filename, conflictAction) {
  //alert("inside suugggest. filename = "+filename);
    __suggest({filename: filename,
               conflictAction: conflictAction,
               conflict_action: conflictAction});
    //return "qqqqqqqq";
  }
  
  // alert("onDeterminingFilename. filename = "+JSON.stringify(item.filename));
  var rules = localStorage.rules;
  try {
    rules = JSON.parse(rules);
  } catch (e) {
    localStorage.rules = JSON.stringify([]);
  }
  
  suggested_filename = parseRules(rules, item.filename);
  
  if (suggested_filename){
    item.filename = suggested_filename;
  }
  
  suggest(item.filename, 'overwrite');

});

function parseRules(rules, filename)
{
    var filename_and_extension = filename.split('.');
    var extension = filename_and_extension.pop();
    var filename_only = filename_and_extension.slice(0, filename_and_extension.length-1).join(".")
    
    for (i = 0; i < rules.length; i++) { 
    
        rule = rules[i];
        // alert("rule: "+JSON.stringify(rule));
        
        // rule is enabled, and at least one of the two rule types is set
        if (rule.enabled) {
            
            var fnAns = null;
            var extAns = null;
            
            // filename rule type is defined and not empty
            if ((rule.fnSelect != "none") && (rule.fnInput != ""))
                fnAns = matchRule(rule.fnSelect, rule.fnInput, filename_only);
            
            // extension rule type is defined and not empty
            if ((rule.extSelect != "none") && (rule.extInput != ""))
                // alert("calling matchRule");
                extAns = matchRule(rule.extSelect, rule.extInput, extension);

            var isMatch = isMatchFound(fnAns, extAns);
            // alert("filename-match: "+fnAns + " - extension-match: "+extAns);
            if (isMatch)
            {
                ans = rule.folder + "/" + filename;
                // alert("matched extension! retunrning "+ ans);
                return ans;
            }
            
        } // rule.enabled
   } // rules loop
   
   // reached here means nothing is matched
   return null;
}

function isMatchFound(fnAns, extAns)
{
    if (fnAns != null && extAns != null && fnAns == true && extAns == true)  // both are defined and true
        return true; 
    else if (fnAns != null && extAns == null && fnAns == true)  // fnAns is defined and true
        return true;
    else if (fnAns == null && extAns != null && extAns == true)  // extAns is defined and true
        return true;
     else
         return false;
}

function matchRule(selectionType, selectionInput, data)
{
    /*
    selectionType - match, contains, regexMatch
    selectionInput - the input value from the user
    data - either the filename or the extension
    */
    
    var selectionInput = selectionInput.toLowerCase();
    var data = data.toLowerCase();
    var ans = false;
    switch (selectionType)
    {
        case "match":
            //alert("MATCH ruletype for selection-type: "+ selectionType + " - data: " + data);
            if (selectionInput == data) {
                alert("MATCH match!");
                ans = true;
            }
            break;
        
        case "contains":
            // alert("CONTAINS type: "+ selectionType + " - data: " + data);
            // alert("CONTAINS res: "+ data.indexOf(selectionInput));
            if (data.indexOf(selectionInput) != -1) {
                alert("CONTAINS match!");
                ans = true;
            }
            break;
            
        case "regexMatch":
            //alert("REGEXTMATCH ruletype for selection-type: "+ selectionType + " - data: " + data);
            var re = new RegExp(selectionInput, "i");
            // alert("regexMatch re is: "+re);
            if (data.search(re) > -1) {
                alert("REGEXTMATCH match!");
                ans = true;
             }
            break;
    }
    return ans;
}    