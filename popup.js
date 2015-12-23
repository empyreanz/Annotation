window.onload = function(){ // this could be done faster with the livequery() plugin for jquery
	// elt = document.createElement('iframe');
	// elt.id = 'facebook_load_frame';
	// elt.src = 'http://liangwu9.github.io/testbasic/loginFrame.html';
	// document.getElementsByTagName('body')[0].appendChild(elt);
	chrome.runtime.sendMessage({method: "getLocalStorage", key: "accessToken"}, function(response) {
  		console.info(response.data);
	  	if (!response.data) {
			var newContent = document.createTextNode("Log in");
			document.getElementById('login').appendChild(newContent);
		} else {
			var newContent = document.createTextNode("Log out");
			document.getElementById('login').appendChild(newContent);
		}
	});

};


document.addEventListener('DOMContentLoaded', function () {
  var elem = document.getElementById('highlight')  
  elem.addEventListener('click', highlightTest);
});

document.addEventListener('DOMContentLoaded', function () {
  var elem = document.getElementById('load')  
  elem.addEventListener('click', load);
});

document.addEventListener('DOMContentLoaded', function () {
  var elem = document.getElementById('login')
  elem.addEventListener('click', login);
});

document.addEventListener('DOMContentLoaded', function () {
  var elem = document.getElementById('manage')
  elem.addEventListener('click', manage);
});


