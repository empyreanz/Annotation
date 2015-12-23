// function highlightSelection() {
// 	var selection;

//     //Get the selected stuff
//     if (window.getSelection)
//         selection = window.getSelection();
//     else if (typeof document.selection != "undefined")
//         selection = document.selection;

//     //Get a the selected content, in a range object
//     var range = selection.getRangeAt(0);

//     //If the range spans some text, and inside a tag, set its css class.
//     if (range && !selection.isCollapsed) {
//         if (selection.anchorNode.parentNode == selection.focusNode.parentNode) {
//             var span = document.createElement('span');
//             span.setAttribute(
// 		       "style",
// 		       "background-color: yellow; display: inline;"
// 		    );
//             range.surroundContents(span);
//         }
//     }
// }


function login() {
    chrome.runtime.sendMessage({method: "getLocalStorage", key: "accessToken"}, function(response) {
        if (!response.data) {
            chrome.extension.getBackgroundPage().bglogin();
        } else {
            chrome.extension.getBackgroundPage().bglogout();
        }
    });

}


function highlightTest() {

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (!tabs) { return; }

        var activeTab = tabs[0];

        _tabs.sendGetSelectionRangeMessage(activeTab.id, function (xpathRange) {
            if (!xpathRange) {
                chrome.extension.getBackgroundPage().console.log('empty xPathRange');
                return;
            }

            var id = _stringUtils.createUUID({
                beginWithLetter: true
            });

            _tabs.sendGetRangeTextMessage(activeTab.id, xpathRange, function (rangeText){
                if (!rangeText) {
                    return;
                }
                
                var now = new Date();
                chrome.extension.getBackgroundPage().console.log(id);
                chrome.extension.getBackgroundPage().console.log(activeTab.url);
                chrome.extension.getBackgroundPage().console.log(now.toString());
                chrome.extension.getBackgroundPage().console.log(rangeText);
                chrome.extension.getBackgroundPage().console.log(xpathRange.startContainerPath);
                chrome.extension.getBackgroundPage().console.log(xpathRange.startOffset);
                chrome.extension.getBackgroundPage().console.log(xpathRange.endContainerPath);
                chrome.extension.getBackgroundPage().console.log(xpathRange.endOffset);
                chrome.extension.getBackgroundPage().console.log(xpathRange.collapsed);
                var user = 'user0';

                chrome.runtime.sendMessage({method: "getLocalStorage", key: "uid"}, function(response) {
                    chrome.extension.getBackgroundPage().console.info(response);
                    if (!response.data) {
                        chrome.extension.getBackgroundPage().bglogin();
                        return;
                    } else {
                        user = response.data;
                        var result = {
                        uuid : id,
                        user : user,
                        url : activeTab.url,
                        time : now.toString(),
                        content : rangeText,
                        startContainerPath : xpathRange.startContainerPath,
                        startOffset : xpathRange.startOffset,
                        endContainerPath : xpathRange.endContainerPath,
                        endOffset : xpathRange.endOffset,
                        collapsed : xpathRange.collapsed

                    }
                    var jsonResult = JSON.stringify(result);
                    chrome.extension.getBackgroundPage().console.log(jsonResult);
                        
                    $.post('http://Default-Environment-yquvnmijps.elasticbeanstalk.com/AnnotationServlet',{type:'highlight', content:jsonResult},function(responseText) { 
                        chrome.extension.getBackgroundPage().console.log(responseText);
                    });

                    var className = "default-hl"            
                    try {
                        _tabs.sendCreateHighlightMessage(activeTab.id,
                            xpathRange, className, id, function (is_created) {
                                chrome.extension.getBackgroundPage().console.log('here');
                                // a false response means something went wrong - delete document from db
                                if (is_created) {
                                    // (re) show page action on success
                                    chrome.pageAction.show(activeTab.id);
                                } else {
                                    chrome.extension.getBackgroundPage().console.log("Error creating highlight in DOM - Removing associated document");
                                }
                            });
                    }catch (e){
                        console.log("Exception creating highlight in DOM - Removing associated document");
                    }
                        }
                    });


            });

        });
    });

}

function load() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (!tabs) { return; }

        var activeTab = tabs[0];

        var user = 'user0';

        chrome.runtime.sendMessage({method: "getLocalStorage", key: "uid"}, function(response) {
            chrome.extension.getBackgroundPage().console.info(response);
            if (!response.data) {
                chrome.extension.getBackgroundPage().bglogin();
                return;
            } else {
                user = response.data;
                var request = {
                    user : user,
                    url : activeTab.url,
                }

                var jsonRequest = JSON.stringify(request);
                chrome.extension.getBackgroundPage().console.log("cp1");
                $.post('http://Default-Environment-yquvnmijps.elasticbeanstalk.com/AnnotationServlet',{type:'getHighlight', content:jsonRequest},function(responseText) {
                    chrome.extension.getBackgroundPage().console.log('cp2');
                    if (responseText === '0') {
                        chrome.extension.getBackgroundPage().console.log(responseText);
                        return;
                    }
                    chrome.extension.getBackgroundPage().console.log(responseText);

                    var highlights = JSON.parse(responseText);
                    var className = "default-hl";

                    for (var i in highlights) {

                        try {
                            var xpathRange = {
                                startContainerPath : highlights[i].startContainerPath,
                                startOffset : highlights[i].startOffset,
                                endContainerPath : highlights[i].endContainerPath,
                                endOffset : highlights[i].endOffset,
                                collapsed : false
                            }

                            var id = _stringUtils.createUUID({
                                beginWithLetter: true
                            });

                            chrome.extension.getBackgroundPage().console.log(xpathRange);

                            _tabs.sendCreateHighlightMessage(activeTab.id,
                                xpathRange, className, id, function (is_created) {
                                    chrome.extension.getBackgroundPage().console.log('here');
                                    // a false response means something went wrong - delete document from db
                                    if (is_created) {
                                        // (re) show page action on success
                                        // chrome.pageAction.show(activeTab.id);
                                    } else {
                                        chrome.extension.getBackgroundPage().console.log("Error creating highlight in DOM - Removing associated document");
                                    }
                            });
                        }catch (e){
                            console.log("Exception creating highlight in DOM - Removing associated document");
                        }
                    }
                    chrome.pageAction.show(activeTab.id);
                    
                    
                });
            }
        });

    });
    
}

function manage() {
    chrome.runtime.sendMessage({method: "getLocalStorage", key: "accessToken"}, function(response) {
        if (!response.data) {
            chrome.extension.getBackgroundPage().bglogin();
            return;
        } else {
            chrome.extension.getBackgroundPage().manage();
        }
    });
}