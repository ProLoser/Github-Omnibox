// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var base = 'https://github.com/';

var tools = {
  http: function(url) {
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
  },
  navigate: function(url, fullPath) {
    if (!fullPath)
      url = base + url;
    chrome.tabs.getSelected(null, function(tab) {
      chrome.tabs.update(tab.id, {
        url: url
      });
    });
  },
  user: function(text) {
    return text.match(/@(\w+)/);
  },
  repo: function(text) {
    return text.match(/(\w+\/\w+)(\W+.+)?/);
  },
  repoAction: function(text) {
    return text.match(/(pulse|wiki|pulls|graphs|network|issues|admin|new pull|new issue|#([0-9]+)|@(\w+))/);
  },
  io: function(text) {
    return text.match(/(\w+)\.(gh|github)\.(io|com)(\/\w+)?/);
  },
  ioUrl: function(io) {
    var url;
    url = 'http://' + io[1] + '.github.io';
    if (io[4])
      url += io[4];
    return url;
  },
  searchUrl: function(text) {
    return 'search?q=' + text;
  }
};

function setDefault(text) {
  var type, action, content = 'Go to ',
    description = '';

  if (type = tools.user(text)) {
    content += 'User:';
    description = base + type[1];
  } else if (type = tools.repo(text)) {
    if (type[2] && (action = tools.repoAction(type[2]))) {
      if (action[2]) {
        content += 'Repo Issue:';
      } else if (action[3]) {
        content += 'Repo Branch:';
      } else {
        content += 'Repo '+action[1]+':';
      }
    } else {
      content += 'Repo:';
      description = base + type[1];
    }
  } else if (type = tools.io(text)) {
    content += 'Page:';
    description = tools.ioUrl(type);
  } else {
    content = 'Search for:';
    description = tools.searchUrl(text);
  }

  chrome.omnibox.setDefaultSuggestion({
    description: content + ' %s'
  });
}

function setSuggestions(text, suggest) {
  suggest([
    {content: text + " one", description: "the first one"},
    {content: text + " number two", description: "the second entry"}
  ]);
}

var global = {
  repos: [],
  users: [],
  issues: []
};

/*chrome.omnibox.onInputStarted.addListener(function(){
  var repo, repos = tools.http('https://github.com/command_bar/repos');

  for (var i = repos.length - 1; i >= 0; i--) {
    repo = {
      content: repos[i].command,
      description: repos[i].description
    };
    global.repos.push(repo);
  };

  // global.users = http('https://github.com/command_bar/users');
  // global.issues = http('https://github.com/command_bar/issues');
});*/

// This event is fired each time the user updates the text in the omnibox,
// as long as the extension's keyword mode is still active.
chrome.omnibox.onInputChanged.addListener(
  function(text, suggest) {
    setDefault(text);

    // setSuggestions(text, suggest);
  });

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(function(text) {
  var type, action;
  if (type = tools.user(text)) {
    tools.navigate(type[1]);
  } else if (type = tools.repo(text)) {
    if (type[2] && (action = tools.repoAction(type[2]))) {
      if (action[2]) {
        tools.navigate(type[1] + '/issues/' + action[2]);
      } else if (action[3]) {
        tools.navigate(type[1] + '/tree/' + action[3]);
      } else {
        tools.navigate(type[1] + '/' + action[1]);
      }
    } else {
      tools.navigate(type[1]);
    }
  } else if (type = tools.io(text)) {
    tools.navigate(tools.ioUrl(type), true);
  } else {
    tools.navigate(tools.searchUrl(text));
  }
});