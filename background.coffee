class Omni
    debug: false
    urls:
        github: 'https://github.com/'
        api: 'https://api.github.com/'
        travis: 'https://travis-ci.org/'
        clone: 'github-mac://openRepo/https://github.com/'
        search: 'search?q='
        io: (repo) ->
            repo = repo.split('/')
            "http://#{repo[0]}.github.io/#{repo[1]}"
    text: null
    api: null
    user: null
    actions:
        'user': ['followers', 'following', 'starred', 'repositories', 'activity']
        'my': ['issues', 'dash', 'pulls', 'settings']
        'new': ['issue', 'release']
        'repo': ['io', 'pulls', 'network', 'pulse', 'settings', 'issues', 'contributors', 'compare', 'wiki', 'graphs', '#', 'tags', 'releases']
    caches:
        my:
            repos: []
            orgs: []
            following: []
        their:
            repos: {}
            user: null

    constructor: ->
        if localStorage.setup is 'true'
            @authorize()

    redirect: (url, fullPath) ->
        url = @urls.github + url  unless fullPath
        if @debug
            alert url
        else
            chrome.tabs.getSelected null, (tab) ->
                chrome.tabs.update tab.id,
                    url: url

    filter: (search, collection, anywhere) ->
        return collection  unless search
        results = []
        defaultSuggestion = null
        _.each collection, (item) =>
            match = item.content.toLowerCase().indexOf(search.toLowerCase())
            if anywhere and ~match or !match
                # item.description = item.description.split(search).join("<match>#{search}</match>")
                results.push item
            defaultSuggestion = item.description if search is item.content
        @setDefault defaultSuggestion
        results

    setDefault: (description = '<dim>search for</dim> "<match>%s</match>"') ->
        chrome.omnibox.setDefaultSuggestion description: description

    suggest: (@text, @suggester) ->
        split = @text.split(' ')
        suggestions = [
            { content: '', description: '<dim>jump to </dim> <url>user</url><match>/</match><url>repo</url>' }
            { content: '/', description: '<dim>search for my</dim> <match>/</match><url>repo</url>' }
            { content: '!', description: '<dim>this repo</dim> <match>!</match><url>action</url>' }
            { content: 'my ', description: '<dim>my account</dim> <match>my</match> <url>action</url>' }
            { content: '@', description: '<dim>user actions</dim> <match>@</match><url>user</url>' }
        ]

        if !@text or @text is 'help'
            @setDefault()
            @suggester suggestions
        else
            suggestions.push { content: 'my auth', description: '<dim>github omnibox</dim> <url>authorize with github</url>' } if localStorage.setup is 'false'
            suggestions.push { content: 'my unauth', description: '<dim>github omnibox</dim> <url>unauthorize from github</url>' } if localStorage.setup is 'true'
            suggestions.push { content: 'my reset', description: '<dim>github omnibox</dim> <url>reset cache</url>' }
            @powerPush suggestions, "my ", @actions.my, '<dim>my</dim> '
            @powerPush suggestions, "my ", @actions.user, '<dim>my</dim> '
            @powerPush suggestions, "!", @actions.repo, '<dim>this repo</dim> '
            @powerPush suggestions, "!new ", @actions.new, '<dim>this repo</dim> '
            @powerPush suggestions, "my new ", ['repo'], '<dim>my</dim> new '
                
            switch true
                when !!@text.match /@[\w-]+ /, !!@text.match /[\w-]+\/ /
                    ### '@user ' ###
                    ### 'user/ ' ###
                    @powerPush suggestions, "#{split[0]} ", @actions.user, "<dim>user</dim> #{split[0]} "
                when @text[0] is '@'
                    ### @user ###
                    @powerPush suggestions, "@", _.pluck(@caches.my.following, 'login'), "<dim>user</dim> @"
                when !!@text.match /^\w+\/[\w-\.]+ /
                    ### 'user/repo ' ###
                    @powerPush suggestions, "#{split[0]} new ", @actions.new
                    @powerPush suggestions, "#{split[0]} ", @actions.repo
                when !!@text.match /^\w+\//
                    ### user/ ###
                    @getTheirRepos split[0].split('/')[0], (repos) =>
                        @suggester @filter @text, @powerPush [], _.pluck(repos, 'full_name'), '<dim>repo</dim> '
                when !!@text.match /^\/[\w-\.]*/
                    ### /repo ###
                    Array::unshift.apply suggestions, @suggestionsFromRepos @caches.my.repos
                    @suggester @filter @text, suggestions, true
                    return
            @suggester @filter @text, suggestions


    powerPush: (destination, prefix = '', source, descriptionPrefix = prefix) ->
        Array::unshift.apply destination, _.map source, (item) =>
            description: descriptionPrefix + item
            content: prefix + item

    getCurrentRepo: (callback) ->
        chrome.tabs.getSelected null, (tab) =>
            if match = tab.url.match /github\.com\/(([\w-]+)\/([\w-\.]+))/
                user = match[2]
                repo = match[3]
            else if match = tab.url.match /([\w-]+)\.github\.io\/([\w-\.]+)/
                user = match[1]
                repo = match[2]
            callback user, repo 

    decide: (@text) ->
        split = @text.split(' ')
        switch true
            when !!@text.match /^my/
                ### my ###
                switch true
                    when split[1] is 'new' and split[2] is 'repo'
                        ### new repo ###
                        url = 'new'
                    when split[1] is 'auth'
                        @authorize()
                        alert 'You can unauthorize at any time by doing "gh my unauth"'
                        url = false
                    when split[1] is 'unauth'
                        @unauthorize()
                        url = false
                    when split[1] is 'reset'
                        @reset()
                        url = false
                        alert 'Cache has been cleared'
                    when !!~['dash', 'dashboard', 'home', 'news', 'feed'].indexOf(split[1])
                        url = ''
                    when !!~['stars', 'starred'].indexOf(split[1])
                        url = 'stars'
                        if split[2]
                            url += "?q=#{split.slice(2).join(' ')}"
                    when !!~['following', 'followers'].indexOf(split[1])
                        url = "#{@user}/#{split[1]}"
                    when !!~['pulls', 'issues', 'settings'].indexOf(split[1])
                        url = "dashboard/#{split[1]}"
                    when !!~['repositories', 'activity'].indexOf(split[1])
                        url = "#{@user}?tab=#{split[1]}"
                    when !split[1]
                        url = @user
            when split[0][0] is '@', !!split[0].match /[\w-]+\//
                if split[0][0] is '@'
                    ### @user ###
                    url = "#{split[0].substr(1)}/"
                else
                    ### user/ ###
                    url = split[0]

                if split[1]
                    ### @user whatever ###
                    switch true
                        when split[1] is 'starred'
                            url += 'following#starred'
                        when !!~['repositories', 'activity'].indexOf(split[1])
                            url += "?tab=#{split[1]}"
                        when !!~['followers', 'following'].indexOf(split[1])
                            url += split[1]
            when !!@text.match(/^[\w-]+\/[\w-\.]+/), !!@text.match(/^!\w+/), !!@text.match(/^\/[\w-\.]+/)
                ### user/repo ###
                ### /repo ###
                if @text[0] is '/'
                    split[0] = @user + split[0]
                ### !x ###
                if @text[0] is '!'
                    split.unshift('##/@@')
                    split[1] = split[1].substr(1)

                ### user/repo x ###
                if split[1]
                    ### user/repo whatever ###
                    switch true
                        when split[1] is 'new' and split[2] and !!split[2].match(/^(issue|pull|release)/)
                            ### user/repo new ###
                            url = "#{split[0]}/#{split[2]}s/new"
                        when !!split[1].match /^(io|pages)$/
                            ### user/repo io ###
                            url = @urls.io(split[0])
                            fullPath = true
                        when split[1] is 'clone'
                            ### user/repo clone ###
                            url = @urls.clone + split[0]
                            fullPath = true
                        when !!split[1].match /^(travis|travis-ci|ci)$/
                            ### user/repo travis ###
                            url = @urls.travis + split[0]
                            fullPath = true
                        when !!split[1].match /^(issues|code)$/ and !!split[2]
                            url = "#{split[0]}/#{@urls.search}#{split.slice(2).join('+')}&type=#{split[1]}"
                        when !!split[1].match /^#[0-9]+/
                            url = "#{split[0]}/issues/#{split[1].substr(1)}"
                        when !!~@actions.repo.indexOf(split[1])
                            ### user/repo whatever ###
                            url = "#{split[0]}/#{split[1]}/"
                        when !!split[1].match(/^@/), !!split[1].match /^\/.*/
                            ### user/repo @branch ###
                            ### user/repo /path ###
                            branch = 'master'
                            path = ''
                            switch true
                                when split[1][0] is '@'
                                    branch = split[1].substr(1)
                                    path = split[2]
                                when split[2][0] is '@'
                                    branch = split[2].substr(1)
                                    path = split[1]
                                else
                                    path = split[1]
                            
                            switch true
                                when path is '/'
                                    url = "#{split[0]}/find/#{branch}"
                                else
                                    url = "#{split[0]}/blob/#{branch}#{path}"
                if split[0] is '##/@@'
                    newUrl = url
                    url = false
                    @getCurrentRepo (user, repo) =>
                        if repo and newUrl
                            url = newUrl.replace('##', user).replace('@@', repo)
                        else if repo
                            url = "#{user}/#{repo}/#{@urls.search}#{@text.substr(1)}"
                        else
                            url = @urls.search + @text
                        @redirect url, fullPath
                else
                    if !url
                        url = "#{split[0]}/"
                        url += @urls.search + split.slice(1).join(' ') if split[1]
            
        if url isnt false
            url = @urls.search + @text if !url
            @redirect url, fullPath


    authorize: ->
        localStorage.setup = 'false'
        github = new OAuth2 'github',
            client_id: '9b3a55174a275a8b56ce'
            client_secret: 'aea80effa00cc2b98c1cc590ade40ba05cbeea1e'
            api_scope: 'repo'
        github.authorize =>
            localStorage.setup = 'true'

            # Ready for action, can now make requests with token
            @api = github

            @query 'user', (err, data) =>
                @user = data.login

            @query 'user/following', (err, data) =>
                @caches.my.following = data

            @getMyRepos()

    unauthorize: ->
        if @api
            @api.clearAccessToken()
        localStorage.setup = 'false'
        alert 'You can authorize at any time by doing "gh my auth"'

    query: (url, callback, method = 'GET') ->
        xhr = new XMLHttpRequest();
        xhr.onreadystatechange = (event) =>
          if xhr.readyState is 4
            if xhr.status is 200
              data = JSON.parse xhr.responseText
            else
              err = xhr
            callback err, data

        url = "#{@urls.api}#{url}"
        if @api
            url = "#{url}?access_token=#{@api.getAccessToken()}&per_page=1000"

        xhr.open method.toUpperCase(), url, true

        xhr.setRequestHeader 'Content-Type', 'application/json'

        xhr.send()

    getMyRepos: ->
        @query 'user/repos', (err, repos) =>
            Array::push.apply @caches.my.repos, repos

        @query 'user/orgs', (err, orgs) =>
            @caches.my.orgs = orgs
            _(orgs).each (org) =>
                @query "orgs/#{org.login}/repos", (err, repos) =>
                    Array::push.apply @caches.my.repos, repos

    getTheirRepos: (user, callback) ->
        @caches.their.user = user
        myback = =>
            callback(@caches.their.repos[user])

        if @caches.their.repos[user]
            myback()
        else
            @query "users/#{user}/repos", (err, repos) =>
                @caches.their.repos[user] = repos
                myback()

    reset: ->
        @caches.my =
            repos: []
            orgs: []
        @cancel()
        if @api
            @getMyRepos()

    cancel: ->
        @caches.their =
            repos: {}
            user: null

    setup: ->
        if !localStorage.setup
            if confirm 'Would you like to Authorize Github-Omnibox for personalized suggestions?'
                @authorize()
                alert 'You can unauthorize at any time by doing "gh my unauth"'
            else
                @unauthorize()

omni = new Omni()
# omni.debug = true


# This event is triggered by options.html
chrome.extension.onRequest.addListener (message, sender, sendResponse) ->
    switch message
        when !!'authorize'
            omni.authorize()

# This event is fired each time the user updates the text in the omnibox,
# as long as the extension's keyword mode is still active.
chrome.omnibox.onInputChanged.addListener omni.suggest.bind omni

# This event is fired when !!the user starts the omnibox
chrome.omnibox.onInputStarted.addListener omni.setup.bind omni

# This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener omni.decide.bind omni
# chrome.omnibox.onInputEntered.addListener omni.clear.bind omni
    
# This event is fired when !!the user cancels the omnibox
# chrome.omnibox.onInputCancelled.addListener omni.clear.bind omni