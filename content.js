
var _content = {

	highlightClassName: null,

    /**
     * Called when the script loads
     */
    init: function () {
        "use strict";
        // create a random class name
        _contentScript.highlightClassName = _stringUtils.createUUID({beginWithLetter: true});
    },

	getSelectionRange: function () {
        "use strict";
        var selection = window.getSelection();
        var range;

        if (selection.isCollapsed) {
            // a fake range
            range = new Range();
            range.collapse(false);
        } else {
            range = selection.getRangeAt(0);
        }

        return range;
    },

    selectHighlight: function (id) {
        "use strict";
        var selection = window.getSelection();

        selection.removeAllRanges();

        if (id) {
            var range = _highlighter.getRange(id);
            selection.addRange(range);

            return range;
        }
    },

    createHighlight: function (xpathRange, id, className) {
        "use strict";
        var range;

        // this is likely to cause exception when the underlying DOM has changed
        try {
            range = _xpath.createRangeFromXPathRange(xpathRange);
        } catch (err) {
            console.log("Exception parsing xpath range: " + err.message);
            return null;
        }

        if (!range) {
            console.log("error parsing xpathRange: " + xpathRange);
            return null;
        }
        // create span(s), with 2 class names
        return _highlighter.create(range, id, [
            _content.highlightClassName,
            className
        ]);
    }


}