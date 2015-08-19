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
        alert("rule: "+JSON.stringify(rule));
        
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

            var isMatch = isMatchFound(fnAns, extAns, rule.andOr);
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

function isMatchFound(fnAns, extAns, andOr)
{
    var ans = false;
    if (andOr == "or")
    {
        if (fnAns == true || extAns == true)
            ans = true;
    }
    else { // and
        if (fnAns != null && extAns != null && fnAns == true && extAns == true)  // both are defined and true
            ans = true; 
        else if (fnAns != null && extAns == null && fnAns == true)  // fnAns is true - extAns is none
            ans = true;
        else if (fnAns == null && extAns != null && extAns == true)  // extAns is true - fnAns is none
            ans = true;
         else
             ans = false;
    }
    
    alert( fnAns + "  " + andOr + "  " + extAns + "        returning: " + ans);
    return ans;
    
    
}

function performRegexMatch(regexString, data)
{
    /*because matchRule has a few regex options, this is a generic method to run regex match and return true or false.*/
    var ans = false;
    var re = new RegExp(regexString, "i");
    alert("performing regex-match-query for re: "+re);
    if (data.search(re) > -1) {
        alert("REGEXTMATCH match!");
        ans = true;
     }
    return ans;
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
            ans = performRegexMatch(selectionInput, data);
            break;
            
        case "anyVideo":
            videoRegex = ".*3g2|3gp|3gpp|asf|avi|divx|f4v|flv|h264|ifo|m2ts|m4v|mkv|mod|mov|mp4|mpeg|mpg|mswmm|mts|mxf|ogv|rm|swf|ts|vep|vob|webm|wlmp|wmv.*";
            ans = performRegexMatch(videoRegex, data);
            break;
            
        case "anyAudio":
            regex = ".*3ga|aac|aif|aiff|amr|au|aup|caf|flac|gsm|kar|m4a|m4p|m4r|mid|midi|mmf|mp2|mp3|mpga|ogg|oma|opus|qcp|ra|ram|wav|wma|xspf.*";
            ans = performRegexMatch(regex, data);
            break;
            
        case "anyImage":
            regex = ".*arw|bmp|cr2|crw|dcm|djvu|dmg|dng|fpx|gif|ico|jp2|jpeg|jpg|nef|orf|pcd|pcx|pict|png|psd|sfw|tga|tif|tiff|webp|xcf.*";
            ans = performRegexMatch(regex, data);
            break;
    }
    return ans;
}    