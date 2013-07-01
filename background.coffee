class Omni
    debug: false
    urls:
        github: 'https://github.com/'
        travis: 'https://travis-ci.org/'
        clone: 'github-mac://openRepo/https://github.com/'
        search: 'search?q='
        io: (repo) ->
            repo = repo.split('/')
            "http://#{repo[0]}.github.io/#{repo[1]}"
    api: null
    text: null
    caches:
        my:
            repos: []
            orgs: []
        their:
            repos: {}
            user: null
    account:
        name: ''
        pass: ''

    constructor: ->
        @setup()

    options: ->
        chrome.tabs.create({url: "options.html"});

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
        _.each collection, (item) =>
            match = item.content.toLowerCase().indexOf(search.toLowerCase())
            results.push item if anywhere and ~match or !match
            @setDefault item.description if search is item.content
        results

    setDefault: (description) ->
        chrome.omnibox.setDefaultSuggestion description: description

    suggest: (@text, @suggester) ->
        split = @text.split(' ')
        suggestions = []
        @powerPush suggestions, "my ", ['issues', 'dash', 'pulls', 'stars', 'settings', 'followers', 'following', 'starred', 'repositories', 'activities']
        @powerPush suggestions, "!", ['io', 'pulls', 'network', 'pulse', 'settings', 'issues', 'contributors', 'compare', 'wiki', 'graphs', '#'], 'this repo '
        @powerPush suggestions, "new ", ['issue', 'repo']
            
        switch true
            when !!@text.match /^@\w+/
                ### @user ###
                @powerPush suggestions, "#{split[0]} ", ['followers', 'following', 'starred', 'repositories', 'activities']
            when !!@text.match /^\w+\/[\w-\.]+ /
                ### 'user/repo ' ###
                @powerPush suggestions, "#{split[0]} new ", ['issue', 'pull']
                @powerPush suggestions, "#{split[0]} ", ['issues', 'io', 'pulls', 'network', 'pulse', 'settings', '#']
            when !!@text.match /^\w+\//
                ### user/ ###
                @getTheirRepos split[0].split('/')[0], (repos) =>
                    @suggester @filter @text, @suggestionsFromRepos repos
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
            if match = tab.url.match /github\.com\/([\w-]+\/[\w-\.]+)/
                url = match[1]
            else if match = tab.url.match /([\w-]+)\.github\.io\/([\w-\.]+)/
                url = "#{match[1]}/#{match[2]}"
            callback url 

    decide: (@text) ->
        split = @text.split(' ')
        switch true
            when split[0] is 'new'
                ### new whatever ###
                switch true
                    when split[1] is 'repo'
                        ### new repo ###
                        url = 'new'
                    when split[1] is 'issue'
                        ### new issue (current/repo) ###
                        url = false
                        @getCurrentRepo (repo) =>
                            @redirect "#{repo}/issues/new"
            when !!@text.match /^my/
                ### my ###
                switch true
                    when !!split[1].match /^(dash|dashboard|home|news|feed)$/
                        url = ''
                    when split[1] is 'stars'
                        url = 'stars'
                    when split[1] is 'followers'
                        url = "#{@account.user}/followers"
                    when split[1] is 'following'
                        url = "#{@account.user}/following"
                    when split[1] is 'pulls'
                        url = 'dashboard/pulls'
                    when split[1] is 'issues'
                        url = "dashboard/issues"
                    when split[1] is 'stars'
                        url = "dashboard/stars?q=#{split.slice(2).join(' ')}"
                    when split[1] is 'settings'
                        url = 'dashboard/settings'
            when !!@text.match /^@\w+/
                ### @user ###
                url = "#{split[0].substr(1)}/"
                if split[1]
                    ### @user whatever ###
                    switch true
                        when split[1] is 'stars'
                            url += 'following#starred'
                        when split[1] is 'followers'
                            url += 'followers'
                        when split[1] is 'following'
                            url += 'following'
            when !!@text.match(/^\w+\/[\w-\.]+/), !!@text.match(/^!\w+/), !!@text.match(/^\/[\w-\.]+/)
                ### user/repo ###
                ### /repo ###
                if @text[0] is '/'
                    split[0] = @account.user + split[0]
                ### !x ###
                if @text[0] is '!'
                    split.unshift('##/@@')
                    split[1] = split[1].substr(1)

                ### user/repo x ###
                if split[1]
                    ### user/repo whatever ###
                    switch true
                        when split[1] is 'new' and split[2] and !!split[2].match(/^(issue|pull)/)
                            ### user/repo new ###
                            url = "#{split[0]}/#{split[2].match(/^(issue|pull)/)[1]}s/new"
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
                        when !!split[1].match /^(network|contributors|pulls|pulse|issues|settings|graphs|compare|wiki)$/
                            ### user/repo whatever ###
                            url = "#{split[0]}/#{split[1]}/"
                        when !!split[1].match /^#[0-9]+/
                            url = "#{split[0]}/issues/#{split[1].substr(1)}"
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
                    @getCurrentRepo (repo) =>
                        if repo
                            @redirect newUrl.replace('##', repo.split('/')[0]).replace('@@', repo.split('/')[1]), fullPath
                        else
                            @redirect @urls.search + @text
                else
                    if !url
                        url = "#{split[0]}/"
                        url += @urls.search + split.slice(1).join(' ') if split[1]
            
        if url isnt false
            url = @urls.search + @text if !url
            @redirect url, fullPath


    connect: ->
        return if !localStorage.username or !localStorage.password
                
        @api = new Github
            username: localStorage.username
            password: localStorage.password
            auth: "basic"

        @user = @api.getUser()

        @getMyRepos()

    disconnect: ->
        @api = null
        @user = null
        @caches.my = 
            repos: []
            orgs: []

    getMyRepos: ->
        @user.repos (err, repos) =>
            Array::push.apply @caches.my.repos, repos

        @user.orgs (err, orgs) =>
            @caches.my.orgs = orgs
            _(orgs).each (org) =>
                @user.orgRepos org.login, (err, repos) =>
                    Array::push.apply @caches.my.repos, repos

    getTheirRepos: (user, callback) ->
        @caches.their.user = user
        myback = =>
            callback(@caches.their.repos[user])

        if @caches.their.repos[user]
            myback()
        else
            @user.userRepos user, (err, repos) =>
                @caches.their.repos[user] = repos
                myback()

    suggestionsFromRepos: (repos) ->
        suggestions = []
        _(repos).each (repo) =>
            suggestions.push
                description: repo.full_name
                content: repo.full_name
        suggestions

    clear: ->
        # @caches.their =
        #     repos: []
        #     user: null

    setup: ->
        if localStorage.setup
            @connect()
        else
            localStorage.setup = true
            if confirm 'Would you like to Authorize Github-Omnibox for personalized suggestions?'
                @options()
            else
                alert 'You can authorize at any time by going into Github-Omnibox options'

omni = new Omni()
# omni.debug = true


# This event is triggered by options.html
chrome.extension.onRequest.addListener (message, sender, sendResponse) ->
    switch message
        when !!'connect'
            omni.connect()
        when !!'disconnect'
            omni.disconnect()

# This event is fired each time the user updates the text in the omnibox,
# as long as the extension's keyword mode is still active.
chrome.omnibox.onInputChanged.addListener omni.suggest.bind omni

# This event is fired when !!the user starts the omnibox
chrome.omnibox.onInputStarted.addListener ->

# This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener omni.decide.bind omni
chrome.omnibox.onInputEntered.addListener omni.clear.bind omni
    
# This event is fired when !!the user cancels the omnibox
chrome.omnibox.onInputCancelled.addListener omni.clear.bind omni