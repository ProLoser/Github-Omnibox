(function () {
    var shorthands = {
        repoActions: function (value, aStep) {
            var prefix = value.prefix ? value.prefix + " " : "";

            return _.extend({
                suggest: function (args) {
                    var content;
                    if (args[0][0] === "!") {
                        content = aStep.label;
                    } else {
                        content = args[0] + " " + aStep.label;
                    }
                    return {
                        content: content,
                        description: prefix + content
                    };
                },
                decide: function (args) {
                    return getFullRepo(args).done(function (fullRepo) {
                        var label = aStep.label;
                        if (aStep.label[0] === "!") {
                            label = aStep.label.substring(1);
                        }
                        return fullRepo + "/" + (value.action || label);
                    });
                }
            }, value);
        },
        easyAlias: function (value) {
            return {
                suggest: function (args, text) {
                    var alias = _.isFunction(value.alias) ? value.alias(args, text) : value.alias;
                    return StepManager.suggest(alias);
                },
                decide: function (args, text) {
                    var alias = _.isFunction(value.alias) ? value.alias(args, text) : value.alias;
                    return StepManager.decide(alias);
                }
            }
        }
    };

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
            defer.resolve(gh.user.name + "/" + firstArg[0].substring(1));
        } else { // user/repo
            defer.resolve(firstArg);
        }
        return defer;
    }

    var repoActions = {
        io: {
            shorthand: "repoActions",
            decide: function (args) {
                return getFullRepo(args).done(function (fullRepo) {
                    var repo = fullRepo.split("/");
                    return "http://" + repo[0] + ".github.io/" + repo[1];
                });
            }
        },
        pages: {
            shorthand: "repoActions",
            decide: function (args) {
                return getFullRepo(args).done(function (fullRepo) {
                    var repo = fullRepo.split("/");
                    return "http://" + repo[0] + ".github.io/" + repo[1];
                });
            }
        },
        pulls: {
            shorthand: "repoActions"
        },
        network: {
            shorthand: "repoActions"
        },
        pulse: {
            shorthand: "repoActions"
        },
        settings: {
            shorthand: "repoActions"
        },
        issues: {
            shorthand: "repoActions"
        },
        contributors: {
            shorthand: "repoActions"
        },
        compare: {
            shorthand: "repoActions"
        },
        wiki: {
            shorthand: "repoActions"
        },
        graphs: {
            shorthand: "repoActions"
        },
        "#issue": {
            pattern: /#[0-9]+/,
            suggest: function (args) {
                var prefix, issue, content;
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
            children: {
                issue: {
                    prefix: "this repo's",
                    suggest: function (args) {
                        var prefix = this.value.prefix ? this.value.prefix + " " : "";
                        if (args[0][0] !== "!") {
                            return {
                                content: args[0] + " " + args[1] + " issue",
                                description: args[0] + " " + args[1] + " issue"
                            }
                        } else {
                            return {
                                content: prefix + args[0] + " issue",
                                description: prefix + args[0] + " issue"
                            }
                        }
                    },
                    decide: function (args) {
                        return getFullRepo(args).done(function (fullRepo) {
                            return fullRepo + "/issues/new";
                        })
                    }
                },
                pull: {
                    shorthand: "easyAlias",
                    alias: function (args) {
                        return args[0][0] === "!" ?
                            "!compare" :
                            args[0] + " compare";
                    }
                }
            }
        },
        clone: {
            shorthand: "repoActions",
            decide: function (args) {
                return getFullRepo(args).done(function (fullRepo) {
                    return "github-mac://openRepo/https://github.com/" + fullRepo;
                });
            }
        },
        travis: {
            shorthand: "repoActions",
            decide: function (args) {
                return getFullRepo(args).done(function (fullRepo) {
                    return "https://travis-ci.org/" + fullRepo
                });
            }
        },
        "@branch": {
            pattern: /^@\w+/, // This pattern is changed for "!@branch"
            suggest: function (args, text) {
                return {
                    content: text,
                    description: args[0][0] === "!" ?
                        "this repo's " + args[0].substring(1) :
                        text
                };
            },
            decide: function (args) {
                return getFullRepo(args).done(function (fullRepo) {
                    if (args[0][0] !== "!") {
                        return fullRepo + "/tree/" + args[1].substring(1);
                    } else {
                        return fullRepo + "/tree/" + args[0].substring(2);
                    }
                });
            },
            children: {
                "/path": {
                    pattern: /^\/\w+/,
                    suggest: function (args, text) {
                        return {
                            content: text,
                            description: args[0][0] === "!" ?
                                "this repo's " + args[0].substring(1) + " " + args[1] :
                                text
                        };
                    },
                    decide: function (args) {
                        return getFullRepo(args).done(function (fullRepo) {
                            if (args[0][0] === "!") {
                                return fullRepo + "/blob/" + args[0].substring(2) + args[1];
                            } else {
                                return fullRepo + "/blob/" + args[1].substring(1) + args[2];
                            }
                        });
                    }
                }
            }
        },
        "/path": {
            pattern: /^\/\w+/, // This pattern is changed for "!/path"
            suggest: function (args, text) {
                return {
                    content: text,
                    description: args[0][0] === "!" ?
                        "this repo's " + args[0].substring(1) :
                        text
                };
            },
            decide: function (args) {
                return getFullRepo(args).done(function (fullRepo) {
                    if (args[0][0] === "!") {
                        return fullRepo + "/blob/master" + args[0].substring(1);
                    } else {
                        return fullRepo + "/blob/master" + args[1];
                    }
                });
            }
        }
    };

    StepManager.loadPatterns({
        registerShorthands: shorthands,
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
            prefix: "this repo's"
        }, value);
    });
    thisRepoActions["!@branch"].pattern = /^!@\w+/;
    thisRepoActions["!/path"].pattern = /^!\/\w+/;

    StepManager.loadPatterns(thisRepoActions);

}());