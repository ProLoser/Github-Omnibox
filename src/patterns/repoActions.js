(function () {
    var shorthands = {
        repoActions: function (value, aStep) {
            var prefix = value.prefix ? value.prefix + " " : "";

            return _.extend({
                suggest: function (args) {
                    var content;
                    if (args[0][0] === "!") {
                        content = "!" + aStep.label;
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
                        return fullRepo + "/" + (value.action || aStep.label);
                    });
                }
            }, value);
        },
        easyAlias: function (value, aStep) {
            return {
                suggest: function (args, text) {
                    var alias = _.isFunction(value.alias) ? value.alias(args, text) : value.alias.split(" ");
                    return StepManager.suggest(alias);
                },
                decide: function (args, text) {
                    var alias = _.isFunction(value.alias) ? value.alias(args, text) : value.alias.split(" ");
                    return StepManager.decide(alias);
                }
            }
        }
    };

    function getFullRepo(args) {
        var defer = Defer(), firstArg = args[0];
        if (firstArg[0] === "!") { // !
            chrome.tabs.getSelected(null, function (tab) {
                var match, repo, user;
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
            pattern: /^(io|pages)$/,
            suggest: function (args) {
                return {
                    content: args[0] + " io",
                    description: "this repo's io"
                }
            },
            decide: function (args) {
                return getFullRepo(args).done(function (fullRepo) {
                    var repo = fullRepo.split("/");
                    return "http://" + repo[0] + ".github.io/" + repo[1];
                })

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
        "#issue": { // TODO !#issue, user/repo #issue
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
                return {
                    content: content,
                    description: prefix + content
                };
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
        clone: { // TODO
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
            pattern: /^@\w+/,
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
            pattern: /^\/\w+/,
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
            pattern: /^\w+\/[\-\w\.]+/,
            children: repoActions,
            suggest: function (args) {
                return [];
            },
            decide: function (args) {
                return args[0];
            }
        },
        "/repo": {
            pattern: /^\/[\-\w\.]*/,
            children: repoActions,
            suggest: function (args) {
                return [];
            },
            decide: function (args) {
                return gh.user.name + args[0];
            }
        }
    });

    var thisRepoActions = {};
    _.each(repoActions, function (value, key) {
        thisRepoActions["!" + key] = _.extend({
            prefix: "this repo's"
        }, value);
    });
    StepManager.loadPatterns(thisRepoActions);

}());