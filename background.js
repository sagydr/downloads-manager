function matches(rule, item) {
    alert("matches");
  if (rule.matcher == 'js')
    return eval(rule.match_param);
  if (rule.matcher == 'hostname') {
    var link = document.createElement('a');
    link.href = item.url.toLowerCase();
    var host = (rule.match_param.indexOf(':') < 0) ? link.hostname : link.host;
    return (host.indexOf(rule.match_param.toLowerCase()) ==
            (host.length - rule.match_param.length));
  }
  if (rule.matcher == 'default')
    return item.filename == rule.match_param;
  if (rule.matcher == 'url-regex')
    return (new RegExp(rule.match_param)).test(item.url);
  if (rule.matcher == 'default-regex')
    return (new RegExp(rule.match_param)).test(item.filename);
  return false;
}


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
    // alert("comparing " + rules.length + " rules");
    for (i = 0; i < rules.length; i++) { 
        rule = rules[i];
        
        if (rule.enabled && (rule.input.length > 0) && (rule.folder.length > 0)) {
            //alert(JSON.stringify(rule));
            
            // remove unnecessary "c/" from beginning of folder name
            if (rule.folder.search(/^[a-z]\//i) > -1)
            {
                rule.folder = rule.folder.substring(2)
            }
            switch (rule.regex)
            {
                case "extension":
                    // alert("comparing extension: "+ rule.input + " - " + filename);
                    if (filename.indexOf(rule.input, filename.length - rule.input.length) !== -1) {
                        ans = rule.folder + "/" + filename;
                        // alert("matched extension! retunrning "+ ans);
                        return ans;
                    }
                    break;
                
                case "contains":
                    // alert("matching contains");
                    if (filename.indexOf(rule.input) !== -1) {
                        ans = rule.folder + "/" + filename;
                        // alert("matched contains! returning: "+ans);
                        return ans;
                    }
                    break;
                    
                case "regexMatch":
                    var re = new RegExp(rule.input, "i");
                    //alert("regexMatch "+re);
                    if (filename.search(re) > -1)
                     {
                        ans = rule.folder + "/" + filename;
                        // alert("regex match! returning: "+ans);
                        return ans;
                     }
                    break;
            }
            
        } // rule.enabled
        else {
            console.log("rule is disabled");
        }
   } // rules loop
   
   // reached here means nothing is matched
   return null;
}