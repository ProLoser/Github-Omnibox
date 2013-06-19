
base = "https://github.com/"
travisBase = "https://travis-ci.org/"
github = user = null

global =
  repos: []
  users: []
  issues: []
  orgs: []
  theirRepos: []

cleanup = ->
  global.theirRepos = []

authorize = ->
  localStorage.username = prompt("Please enter your Github username:")
  localStorage.password = prompt("Please enter your Github password:")
  alert 'You can deauthorize at any time by entering "gh deauthorize" into the address bar'

connect = ->
  if !localStorage.username or !localStorage.password
    return
  github = new Github(
    username: localStorage.username
    password: localStorage.password
    auth: "basic"
  )
  user = github.getUser()
  user.repos (err, repos) ->
    Array::push.apply global.repos, repos

  user.orgs (err, orgs) ->
    global.orgs = orgs
    _(global.orgs).each (org) ->
      user.orgRepos org.login, (err, repos) ->
        Array::push.apply global.repos, repos

disconnect = ->
  localStorage.username = null
  localStorage.password = null
  github = null
  user = null
  global.repos = []
  global.orgs = []
  alert 'Done. You can reauthorize at any time by entering "gh authorize" into the address bar'

setDefault = (text, suggest) ->
  type = undefined
  action = undefined
  description = "Go to "
  if text[0] is "/" and github
    suggestMyRepos text, suggest
  else if type = tools.isUrl(text)
    description = "Go to"
  else if type = tools.user(text)
    description += "user"
  else if text.match /(^[\w-]+\/$)/
    suggestTheirRepos text, suggest
  else if type = text.match /(^[\w-]+\/[\w-\.]+\s+)/
    suggestActions text, suggest
    if type[2] and (action = tools.repoAction(type[2]))
      if action[2]
        description += "repo issue"
      else if action[3]
        description += "repo branch"
      else
        if action[1] is "travis"
          description += action[1]
        else
          description += "repo " + action[1]
    else
      description += "repo"
  else if type = tools.io(text)
    description += "page"
  else
    description = "Search for"
  chrome.omnibox.setDefaultSuggestion description: description + ": %s"

setSuggestions = (text, suggest) ->
  suggest [
    content: text + " one"
    description: "the first one"
  ,
    content: text + " number two"
    description: "the second entry"
  ]

suggestMyRepos = (text, suggest) ->
  suggestions = []
  _(filter(
    name: text.substr(1)
  , global.repos)).each (repo) ->
    suggestions.push
      description: repo.full_name
      content: repo.full_name
  suggest suggestions

suggestTheirRepos = (text, suggest) ->
  suggestions = []
  textSplit = text.split('/')
  if (textSplit.length == 1)
    return
  if (!global.theirRepos.length)
    user.userRepos textSplit[0], (err, repos) ->
      global.theirRepos = repos
      if repos.length
        suggestTheirRepos(text, suggest)
  _(filter(
    name: textSplit[0]
  , global.theirRepos)).each (repo) ->
    suggestions.push
      description: repo.full_name
      content: repo.full_name
  suggest suggestions

suggestActions = (text, suggest) ->
  suggestions = []
  description = "Go to "
  content = base + text + "/"
  actions = ["pulse", "wiki", "pulls", "graphs", "network", "issues", "admin", "travis"]
  text = text.split(" ")
  actions = filter(text[1], actions)
  i = actions.length - 1

  while i >= 0
    suggestions.push
      description: description + actions[i] + ": " + text[0]
      content: text[0] + " " + actions[i]

    i--
  suggestions.push
    description: "New pull: " + text[0]
    content: text[0] + " issues/new"

  suggestions.push
    description: "New issue: " + text[0]
    content: text[0] + " pulls/new"

  suggest suggestions

filter = (text, data, looseMatch) ->
  return data  unless text
  results = []
  _.each data, (item) ->
    match = undefined
    key = undefined
    if _.isObject(text)
      key = _(text).keys()[0]
      match = item[key].toLowerCase().indexOf(text[key].toLowerCase())
    else
      match = item.toLowerCase().indexOf(text.toLowerCase())
    results.push item  if looseMatch and ~match or not match

  results

tools =
  http: (url) ->
    xmlHttp = null
    xmlHttp = new XMLHttpRequest()
    xmlHttp.open "GET", url, false
    xmlHttp.send null
    xmlHttp.responseText

  navigate: (url, fullPath) ->
    url = base + url  unless fullPath
    chrome.tabs.getSelected null, (tab) ->
      chrome.tabs.update tab.id,
        url: url

  user: (text) ->
    text.match /@([\w-]+)/

  repo: (text) ->
    text.match /([\w-]+\/[\w-\.]+)(\s+.+)?/

  repoAction: (text) ->
    text.match /(pulse|wiki|pulls|graphs|network|issues|admin|travis|new pull|new issue|#([0-9]+)|@([\w-]+))/

  isUrl: (text) ->
    text.match /http[s]?:.*/

  io: (text) ->
    text.match /([\w-]+)\.(gh|github)\.(io|com)(\/[\w-]+)?/

  ioUrl: (io) ->
    url = undefined
    url = "http://" + io[1] + ".github.io"
    url += io[4]  if io[4]
    url

  searchUrl: (text) ->
    "search?q=" + text


#chrome.omnibox.onInputStarted.addListener(function(){
#  var repo, repos = tools.http('https://github.com/command_bar/repos');
#
#  for (var i = repos.length - 1; i >= 0; i--) {
#    repo = {
#      content: repos[i].command,
#      description: repos[i].description
#    };
#    global.repos.push(repo);
#  };
#
#  // global.users = http('https://github.com/command_bar/users');
#  // global.issues = http('https://github.com/command_bar/issues');
#});

# This event is fired each time the user updates the text in the omnibox,
# as long as the extension's keyword mode is still active.
chrome.omnibox.onInputChanged.addListener (text, suggest) ->
  setDefault text, suggest


# setSuggestions(text, suggest);

# This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener (text) ->
  cleanup()
  type = undefined
  action = undefined
  if text is "authorize"
    authorize()
    connect()
  else if text is "deauthorize"
    disconnect()
  else if text[0] is "/" and localStorage.username
    tools.navigate localStorage.username + text
  else if type = tools.isUrl(text)
    tools.navigate text
  else if type = tools.user(text)
    tools.navigate type[1]
  else if type = tools.repo(text)
    console.log type
    if type[2] and (action = tools.repoAction(type[2]))
      if action[2]
        tools.navigate type[1] + "/issues/" + action[2]
      else if action[3]
        tools.navigate type[1] + "/tree/" + action[3]
      else
        if action[1] is "travis"
          tools.navigate travisBase + type[1], true
        else
          tools.navigate type[1] + "/" + action[1]
    else
      tools.navigate type[1]
  else if type = tools.io(text)
    tools.navigate tools.ioUrl(type), true
  else
    tools.navigate tools.searchUrl(text)

chrome.omnibox.onInputCancelled.addListener ->
  cleanup()

if !localStorage.authorized
  if confirm 'Would you like to Authorize Github-Omnibox for personalized suggestions?'
    authorize()
  else
    alert 'You can authorize at any time by entering "gh authorize" into the address bar'
  localStorage.authorized = true
connect()