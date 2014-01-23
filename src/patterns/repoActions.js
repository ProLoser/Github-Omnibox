(function () {
    var repoActions = {
        io: {
            suggest: suggestOwnLabel,
            decide: function (args) {
                return getFullRepo(args).done(function (fullRepo) {
                    return omni.urls.io(fullRepo);
                });
            }
        },
        pages: {
            suggest: suggestOwnLabel,
            decide: function (args) {
                return getFullRepo(args).done(function (fullRepo) {
                    return omni.urls.io(fullRepo);
                });
            }
        },
        pulls: {
            suggest: suggestOwnLabel,
            decide: decideFromLabel
        },
        network: {
            suggest: suggestOwnLabel,
            decide: decideFromLabel
        },
        pulse: {
            suggest: suggestOwnLabel,
            decide: decideFromLabel
        },
        settings: {
            suggest: suggestOwnLabel,
            decide: decideFromLabel
        },
        issues: {
            suggest: suggestOwnLabel,
            decide: decideFromLabel
        },
        milestones: {
            suggest: suggestOwnLabel,
            decide: function (args) {
                return getFullRepo(args).done(function (fullRepo) {
                    return fullRepo + "/issues/milestones";
                });
            }
        },
        contributors: {
            suggest: suggestOwnLabel,
            decide: decideFromLabel
        },
        compare: {
            suggest: suggestOwnLabel,
            decide: decideFromLabel
        },
        wiki: {
            suggest: suggestOwnLabel,
            decide: decideFromLabel
        },
        notifications: {
            suggest: suggestOwnLabel,
            decide: decideFromLabel
        },
        fork: {
            suggest: suggestOwnLabel,
            decide: decideFromLabel
        },
        releases: {
            suggest: suggestOwnLabel,
            decide: decideFromLabel
        },
        graphs: {
            suggest: suggestOwnLabel,
            decide: decideFromLabel
        },
        "#issue": {
            pattern: /#[0-9]+/,
            suggest: function (args) {
                var prefix, issue;
                prefix = this.value.prefix ? "<dim>" + this.value.prefix + "</dim>" : "";
                issue = (args[1] || args[0]).match(/#([0-9]+)/)[1];

                if (args[0][0] === "!") {
                    return {
                        content: "!#" + issue,
                        description: prefix + "issue <url>#" + issue + "</url>"
                    };
                } else {
                    return {
                        content: args[0] + " #" + issue,
                        description: prefix + '<match>' + args[0] + "</match> issue <url>#" + issue + "</url>"
                    };
                }
            },
            decide: function (args) {
                return getFullRepo(args).done(function (fullRepo) {
                    var issue = (args[1] || args[0]).match(/#([0-9]+)/)[1];
                    return fullRepo + "/issues/" + issue;
                });
            }
        },
        "new": {
            children: (function () {
                return {
                    issue: {
                        suggest: suggestNew("issue"),
                        decide: decideNew("issue")
                    },
                    release: {
                        suggest: suggestNew("release"),
                        decide: decideNew("release")
                    },
                    pull: {
                        //TODO don't alias suggestions
                        suggest: function (args) {
                            var alias = args[0][0] === "!" ? "!compare" : args[0] + " compare";
                            return StepsManager.suggest(alias);
                        },
                        decide: function (args) {
                            var alias = args[0][0] === "!" ? "!compare" : args[0] + " compare";
                            return StepsManager.decide(alias);
                        }
                    }
                };

                function suggestNew(something) {
                    return function (args) {
                        if (args[0][0] === "!") {
                            return {
                                content: "this repo's new " + something,
                                description: "this repo's new " + something
                            };
                        } else {
                            return {
                                content: args[0] + " new " + something,
                                description: args[0] + " new " + something
                            };
                        }
                    }
                }

                function decideNew(something) {
                    return function (args) {
                        return getFullRepo(args).done(function (fullRepo) {
                            return fullRepo + "/" + something + "s/new";
                        });
                    }
                }
            }())
        },
        clone: {
            suggest: suggestOwnLabel,
            decide: function (args) {
                return getFullRepo(args).done(function (fullRepo) {
                    return omni.urls.clone + fullRepo;
                });
            }
        },
        travis: {
            suggest: suggestOwnLabel,
            decide: function (args) {
                return getFullRepo(args).done(function (fullRepo) {
                    return omni.urls.travis + fullRepo;
                });
            }
        },

        commits: {
            suggest: suggestOwnLabel,
            decide: function (args) {
                return getFullRepo(args).done(function (fullRepo) {
                    return fullRepo + "/commits/master";
                });
            }
            // TODO add @branch for commits
        },
        "?search": {
            pattern: /\?|(search ).*/,
            suggest: suggestOwnLabel,
            decide: function(args) {
                return getFullRepo(args).done(function (fullRepo) {
                    if (args[1] == 'search')
                        args.splice(1,1);
                    if (args[1][0] == '?')
                        args[1] = args[1].substr(1);
                    args = args.slice(1).join('+')
                    return fullRepo + "/search?q=" + args;
                });
            }
        },
        "@branch": {
            pattern: /^@[-\w\.]+/, // This pattern is changed below for "!@branch"
            suggest: suggestOwnRoad,
            decide: decideBranchPath,
            children: {
                "/path": {
                    pattern: /^\/\S*/,
                    suggest: suggestOwnRoad,
                    decide: decideBranchPath
                }
            }
        },
        "/path": {
            pattern: /^\/\S*/, // This pattern is changed below for "!/path"
            suggest: suggestOwnRoad,
            decide: decideBranchPath,
            children: {
                "@branch": {
                    pattern: /^@[-\w\.]+/,
                    suggest: suggestOwnRoad,
                    decide: decideBranchPath
                }
            }
        }
    };

    function suggestOwnRoad(args, text) {
        var prefix = this.value.prefix ? "<dim>" + this.value.prefix + "</dim>" : "";
        if (args[0][0] === "!") {
            return {
                content: text,
                description: prefix + "<url>" + args[0].substring(1) + " " + args.slice(1).join(" ")  + "</url>"
            };
        } else {
            return {
                content: text,
                description: prefix + "<match>" + args[0] + "</match> <url>" + args.slice(1).join(" ") + "</url>"
            };
        }
    }

    function decideBranchPath(args) {
        var branch = "master", path = null;
        _.each(args, function (val) {
            val = val.replace("!", "");
            switch (val[0]) {
                case "@":
                    branch = val.substring(1);
                    break;
                case "/":
                    path = val.substring(1);
                    break;
            }
        });
        return getFullRepo(args).done(function (fullRepo) {
            if (path === null) {
                return fullRepo + "/tree/" + branch;
            } else if (path === "") {
                return fullRepo + "/find/" + branch;
            } else {
                return fullRepo + "/blob/" + branch + "/" + path;
            }
        });
    }

    StepsManager.loadPatterns({
        "user/repo": {
            pattern: /^[\w-]+\/[-\w\.]*/,
            suggest: function (args) {
                if (args.size0 > this.level) return [];

                var repoName = args[0].split('/')[1].toLowerCase();
                return [
                    {
                        content: args[0],
                        description: "<match>" + args[0] + "</match>"
                    },
                    omni.getTheirRepos(args[0].split('/')[0]).done(function (repos) {
                        return filterRepos(repos, repoName);
                    })
                ];
            },
            decide: function (args) {
                return args[0];
            },

            children: repoActions
        },
        "/repo": {
            pattern: /^\/[\-\w\.]*/,
            suggest: function (args) {
                var repoName = args[0].substring(1).toLowerCase(), myRepos;
                myRepos = filterRepos(omni.caches.my.repos, repoName);
                myRepos.unshift({
                    content: args[0],
                    description: omni.user + "<match>" + args[0] + "</match>"
                });
                return myRepos;
            },
            decide: function (args) {
                return omni.user + args[0];
            },

            children: repoActions
        },
        "*starred_repo": {
            pattern: /^\*[\-\w\.]*/,
            suggest: function (args) {
                var repoName = args[0].substring(1).toLowerCase(), myRepos;
                myRepos = filterRepos(omni.caches.starred, repoName);
                myRepos.unshift({
                    content: args[0],
                    description: "<match>" + args[0] + "</match>"
                })
                return myRepos;
            },
            decide: function (args) {
                var repoName = args[0].substring(1).toLowerCase(),
                    decision = null;
                _.each(omni.caches.starred, function (repo) {
                    if (repo.name.toLowerCase() === repoName) {
                        decision = repo.full_name;
                    }
                });
                return decision;
            },

            children: repoActions
        }
    });

    // !repoAction
    var thisRepoActions = {};
    _.each(repoActions, function (value, key) {
        thisRepoActions["!" + key] = _.extend({
            prefix: "this repo's "
        }, value);
    });
    thisRepoActions["!@branch"].pattern = /^!@\w+/;
    thisRepoActions["!/path"].pattern = /^!\/\w*/;

    StepsManager.loadPatterns(thisRepoActions);


    function suggestOwnLabel(args) {
        var prefix = this.value.prefix ? "<dim>" + this.value.prefix + "</dim>" : "";
        if (args[0][0] === "!") {
            return {
                content: this.label,
                description: prefix + "<url>" + this.label.substring(1) + "</url>"
            };
        } else {
            return {
                content: args[0] + " " + this.label,
                description: prefix + "<match>" + args[0] + "</match> <url>" + this.label + "</url>"
            };
        }
    }

    function decideFromLabel(args) {
        var label = this.label;
        if (label[0] === "!") {
            label = label.substring(1);
        }
        return getFullRepo(args).done(function (fullRepo) {
            return fullRepo + "/" + label;
        });
    }

    function getFullRepo(args) {
        var defer = Defer(), firstArg = args[0];
        if (firstArg[0] === "!") { // !
            chrome.tabs.query({active: true, lastFocusedWindow: true}, function (tabs) {
                var match, repo, user, tab = tabs[0];
                if (match = tab.url.match(/github\.com\/(([\w-]+)\/([\-\w\.]+))/)) {
                    user = match[2];
                    repo = match[3];
                } else if (match = tab.url.match(/([\w-]+)\.github\.io\/([\-\w\.]+)/)) {
                    user = match[1];
                    repo = match[2];
                }
                return defer.resolve(user + "/" + repo);
            });
        } else if (firstArg[0] === "/") { // /repo
            defer.resolve(omni.user + "/" + firstArg.substring(1));
        } else if (firstArg[0] === "*") { // *starred_repo
            var repoName = firstArg.substring(1).toLowerCase();
            _.each(omni.caches.starred, function (repo) {
                if (repo.name.toLowerCase() === repoName) {
                    defer.resolve(repo.full_name);
                }
            });
        } else { // user/repo
            defer.resolve(firstArg);
        }
        return defer;
    }

    function filterRepos(repos, text) {
        var filteredRepos = [];
        _.each(repos, function (repo) {
            if (repo.name.toLowerCase() === text.toLowerCase()) return;
            var findName = repo.name.toLowerCase().indexOf(text);
            if (!!~findName) {
                // If it's the first letters, push (prepend), otherwise unshift (append)
                filteredRepos[findName&&'push'||'unshift']({
                    content: repo.full_name,
                    description: repo.full_name.split(text).join("<match>" + text + "</match>")
                });
            }
        });
        return filteredRepos;
    }
}());
