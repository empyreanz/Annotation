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
    console.log("click");
    var range = _content.getSelectionRange();
    console.log(range.toString());
    var xPathRange = _xpath.createXPathRangeFromRange(range);
    var range2 = _xpath.createRangeFromXPathRange(xPathRange);
    var id = _stringUtils.createUUID({
            beginWithLetter: true
        });
    var className = "default-hl"
    var hl = _content.createHighlight(xPathRange, id, className);
    _content.selectHighlight(id);
    console.log(xPathRange.startContainerPath);
    console.log(xPathRange.startOffset);
    console.log(xPathRange.endContainerPath);
    console.log(xPathRange.endOffset);
    console.log(xPathRange.collapsed);
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