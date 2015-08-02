var omni = new Omni(localStorage.setup === 'true');

chrome.runtime.onMessage.addListener(function (message) {
    switch (message) {
        case 'authorize':
            omni.authorize();
            break;
        case 'decorate':
            chrome.extension.sendMessage(localStorage);
            break;
        case 'reset':
            omni.reset();
            alert('Cache has been cleared');
            break;
        case 'login':
            omni.authorize(function(){
              alert('Logged in');
            });
            break;
        case 'logout':
            omni.unauthorize();
            alert('Logged out');
            break;
    }
});

chrome.omnibox.onInputChanged.addListener(omni.suggest.bind(omni));

chrome.omnibox.onInputStarted.addListener(function () {
    if (_.isUndefined(localStorage.setup)) {
        if (confirm('Would you like to Authorize Github-Omnibox for personalized suggestions?')) {
            omni.authorize();
            alert('You can unauthorize at any time by doing "gh my unauth"');
        } else {
            omni.unauthorize();
        }
    }
});

chrome.omnibox.onInputEntered.addListener(function (text) {
    if (text) omni.decide(text);
});
