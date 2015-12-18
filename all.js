function highlightSelection() {
	var selection;

    //Get the selected stuff
    if (window.getSelection)
        selection = window.getSelection();
    else if (typeof document.selection != "undefined")
        selection = document.selection;

    //Get a the selected content, in a range object
    var range = selection.getRangeAt(0);

    //If the range spans some text, and inside a tag, set its css class.
    if (range && !selection.isCollapsed) {
        if (selection.anchorNode.parentNode == selection.focusNode.parentNode) {
            var span = document.createElement('span');
            span.setAttribute(
		       "style",
		       "background-color: yellow; display: inline;"
		    );
            range.surroundContents(span);
        }
    }
}


function highlightTest() {
    chrome.extension.getBackgroundPage().console.log('foo');
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (!tabs) { return; }

        var activeTab = tabs[0];

        _tabs.sendGetSelectionRangeMessage(activeTab.id, function (xpathRange) {
            if (!xpathRange) {
                chrome.extension.getBackgroundPage().console.log('empty xPathRange');
                return;
            }
            chrome.extension.getBackgroundPage().console.log(xpathRange.startContainerPath);
            chrome.extension.getBackgroundPage().console.log(xpathRange.startOffset);
            chrome.extension.getBackgroundPage().console.log(xpathRange.endContainerPath);
            chrome.extension.getBackgroundPage().console.log(xpathRange.endOffset);
            chrome.extension.getBackgroundPage().console.log(xpathRange.collapsed);

            var id = _stringUtils.createUUID({
                beginWithLetter: true
            });
            var className = "default-hl"

            
            try {
                _tabs.sendCreateHighlightMessage(activeTab.id,
                    xpathRange, className, id, function (is_created) {
                        chrome.extension.getBackgroundPage().console.log('here');
                        // a false response means something went wrong - delete document from db
                        if (is_created) {
                            // (re) show page action on success
                            chrome.pageAction.show(tabId);
                        } else {
                            chrome.extension.getBackgroundPage().console.log("Error creating highlight in DOM - Removing associated document");
                        }
                    });
            }catch (e){
                console.log("Exception creating highlight in DOM - Removing associated document");
            }

            // // non collapsed selection means create new highlight
            // if (!xpathRange.collapsed) {
            //     // requires selection text
            //     _tabs.sendGetRangeTextMessage(activeTab.id, xpathRange, function (selectionText) {
            //         if (!selectionText) { return; }

            //         // create new document for highlight, then update DOM
            //         _eventPage.createHighlight(activeTab.id,
            //             xpathRange, _database.buildMatchString(activeTab.url),
            //             selectionText, hd.className);

            //         // remove selection?
            //         _storage.getUnselectAfterHighlight(function (unselectAfterHighlight) {
            //             if (unselectAfterHighlight) {
            //                 // unselect all
            //                 _eventPage.selectHighlightText(activeTab.id);
            //             }
            //         });

            //     });
            // } else {
            //     // collapsed selection range means update the hovered highlight (if possible)
            //     var documentId = _contextMenus.getHoveredHighlightId();
            //     if (documentId) {
            //         _eventPage.updateHighlight(activeTab.id,
            //             documentId, hd.className);
            //     }
            // }
        });
    });



    // var range = _content.getSelectionRange();
    // console.log(range.toString());
    // var xPathRange = _xpath.createXPathRangeFromRange(range);
    // var range2 = _xpath.createRangeFromXPathRange(xPathRange);
    // var hl = _content.createHighlight(xPathRange, id, className);
    // _content.selectHighlight(id);
    // console.log(xPathRange.startContainerPath);
    // console.log(xPathRange.startOffset);
    // console.log(xPathRange.endContainerPath);
    // console.log(xPathRange.endOffset);
    // console.log(xPathRange.collapsed);
}

function getSelectionText() {
	var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

function highlightRange(range) {
    var newNode = document.createElement("div");
    newNode.setAttribute(
       "style",
       "background-color: yellow; display: inline;"
    );
    range.surroundContents(newNode);

}