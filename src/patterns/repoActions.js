(function () {
    var repoActions = {
        io: {
            suggest: suggestOwnLabel,
            decide: function (args) {
                return getFullRepo(args).done(function (fullRepo) {
                    var repo = fullRepo.split("/");
                    return "http://" + repo[0] + ".github.io/" + repo[1];
                });
            }
        },
        pages: {
            suggest: suggestOwnLabel,
            decide: function (args) {
                return getFullRepo(args).done(function (fullRepo) {
                    var repo = fullRepo.split("/");
                    return "http://" + repo[0] + ".github.io/" + repo[1];
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
        graphs: {
            suggest: suggestOwnLabel,
            decide: decideFromLabel
        },
        "#issue": {
            pattern: /#[0-9]+/,
            suggest: function (args) {
                var prefix, issue;
                prefix = this.value.prefix ? this.value.prefix + " " : "";
                issue = (args[1] || args[0]).match(/#([0-9]+)/)[1];

                if (args[0][0] === "!") {
                    return {
                        content: "!#" + issue,
                        description: prefix + "#" + issue
                    };
                } else {
                    return {
                        content: args[0] + " #" + issue,
                        description: prefix + args[0] + " #" + issue
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
                    return "github-mac://openRepo/https://github.com/" + fullRepo;
                });
            }
        },
        travis: {
            suggest: suggestOwnLabel,
            decide: function (args) {
                return getFullRepo(args).done(function (fullRepo) {
                    return "https://travis-ci.org/" + fullRepo
                });
            }
        },

        "@branch": {
            pattern: /^@\w+/, // This pattern is changed below for "!@branch"
            suggest: suggestOwnRoad,
            decide: decideBranchPath,
            children: {
                "/path": {
                    pattern: /^\/\w*/,
                    suggest: suggestOwnRoad,
                    decide: decideBranchPath
                }
            }
        },
        "/path": {
            pattern: /^\/\w*/, // This pattern is changed below for "!/path"
            suggest: suggestOwnRoad,
            decide: decideBranchPath,
            children: {
                "@branch": {
                    pattern: /^@\w+/,
                    suggest: suggestOwnRoad,
                    decide: decideBranchPath
                }
            }
        }
    };

    function suggestOwnRoad(args, text) {
        return {
            content: text.replace("!", "this repo's "),
            description: text.replace("!", "this repo's ")
        }
    }
    function decideBranchPath(args) {
        var branch = "master", path = null;
        _.each(args, function (val) {
            val = val.replace("!", "");
            switch(val[0]) {
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
            } else if(path === "") {
                return fullRepo + "/find/" + branch;
            } else {
                return fullRepo + "/blob/" + branch + "/" + path;
            }
        });
    }

    StepsManager.loadPatterns({
        "user/repo": {
            pattern: /^\w+\/[\-\w\.]*/,
            suggest: function (args) {
                if (args.size0 > this.level) return [];

                var repoName = args[0].split('/')[1];
                return [
                    {
                        content: args[0],
                        description: args[0]
                    },
                    omni.getTheirRepos(args[0].split('/')[0]).done(function (repos) {
                        var theirRepos = [];
                        _.each(repos, function (repo) {
                            if (repo.name.indexOf(repoName) === 0 && repo.full_name !== args[0]) {
                                theirRepos.push({
                                    content: repo.full_name,
                                    description: repo.full_name
                                });
                            }
                        });
                        return theirRepos;
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
            suggest: function (args) { // TODO
                var repoName = args[0].substring(1), myRepos = [
                    {
                        content: args[0],
                        description: args[0]
                    }
                ];
                _.each(omni.caches.my.repos, function (repo) {
                    if (repo.name.indexOf(repoName) === 0 && repo.name !== repoName) {
                        myRepos.push({
                            content: repo.full_name,
                            description: repo.full_name
                        });
                    }
                });
                return myRepos;
            },
            decide: function (args) {
                return omni.user + args[0];
            },

            children: repoActions
        }
    });

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
        var content;
        if (args[0][0] === "!") {
            content = this.label;
        } else {
            content = args[0] + " " + this.label;
        }
        return {
            content: content,
            description: (this.value.prefix || "") + content
        };
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
        } else { // user/repo
            defer.resolve(firstArg);
        }
        return defer;
    }
}());