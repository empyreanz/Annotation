var successURL = "https://www.facebook.com/connect/login_success.html";

function bglogin() {
        chrome.tabs.create(
              {
               'url' : "https://www.facebook.com/dialog/oauth?"
                + "client_id=1023684864336462"
                + "&response_type=token"
                + "&scope=user_friends"
                + "&redirect_uri=http://www.facebook.com/connect/login_success.html"
              }, function(tab) {
                chrome.tabs.onUpdated.addListener(function xx(tabId, c, t) { 
                    console.log(t.url.indexOf(successURL));                  
                    if (tabId == tab.id && t.url.indexOf(successURL) == 0) {
                        var params = t.url.split("#")[1];
                        console.info(params);
                        access = params.split('&')[0]
                        localStorage.setItem('accessToken', access);
                        console.log(access);
                        $.get("https://graph.facebook.com/me?fields=name&"+access,{},function(responseText) { 
                            localStorage.setItem('uid', responseText.id);
                            localStorage.setItem('uname', responseText.name);
                        });

                        chrome.tabs.onUpdated.removeListener(xx);
                        chrome.tabs.remove(tab.id);
                    }

                });
              }
        );
};

function bglogout() {
        chrome.tabs.create(
              {
               'url' : "https://www.facebook.com/logout.php?"
                + "next=http://www.facebook.com/connect/login_success.html&"
                + localStorage['accessToken']
              }, function(tab) {
                chrome.tabs.onUpdated.addListener(function xx(tabId, c, t) { 
                    console.log(t.url.indexOf(successURL));                  
                    if (tabId == tab.id && t.url.indexOf(successURL) == 0) {
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('uid');
                        localStorage.removeItem('uname');
                        chrome.tabs.onUpdated.removeListener(xx);
                        chrome.tabs.remove(tab.id);
                    }

                });
              }
        );
};

function manage() {
        chrome.tabs.create(
              {
               // 'url' : "http://localhost:8080/Annotation/index.jsp?"
               'url' : "http://Default-Environment-yquvnmijps.elasticbeanstalk.com/index.jsp?"
                + "uid="
                + localStorage['uid']
              }
        );
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getLocalStorage")
      sendResponse({data: localStorage[request.key]});
    else
      sendResponse({}); // snub them.
});