

document.addEventListener('DOMContentLoaded', function () {
  var elem = document.getElementById('bookmark');
  elem.addEventListener('click', clickAnnotate);
});

function clickAnnotate(e){
    [
        "content.js",
        "xpath.js",
        "highlighter.js",
        "string_utils.js",
        "all.js"
    ].forEach(function (file) {
            chrome.tabs.executeScript(null, {
            "file": file
        }, function () { // Execute your code
            console.log("Script Executed .. "); // Notification on Completion
        });
    });
}

