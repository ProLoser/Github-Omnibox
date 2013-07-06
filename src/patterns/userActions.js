(function () {
    function getUser(args) {
        var user;
        if (args[0][0] == "@") {
            user = args[0].substring(1);
        } else {
            user = args[0].substring(0, args[0].length - 1);
        }
        return user;
    }

    function suggestOwnLabel(args) {
        return {
            content: args[0] + " " + this.label,
            description: args[0] + " " + this.label
        }
    }

    //generates a decide fn
    function decideUrlForUser(url) {
        return function (args) {
            return getUser(args) + url;
        }
    }

    StepManager.loadPatterns({
        "@user/": {
            // TODO not sure this regex is good
            pattern: /^\w\/$|^@\w*$/, // accepts @user and user/
            suggest: function (args) {
                var user = getUser(args);
                var suggestions = [
                    {
                        content: "@" + user,
                        description: "@" + user
                    }
                ];
                _.each(omni.caches.my.following, function (followedUser) {
                    if (!user || (followedUser.login.indexOf(user) === 0 && followedUser.login !== user)) {
                        suggestions.push({
                            content: "@" + followedUser.login,
                            description: "@" + followedUser.login
                        });
                    }
                });
                return suggestions;
            },
            decide: decideUrlForUser(""),

            children: {
                followers: {
                    suggest: suggestOwnLabel,
                    decide: decideUrlForUser("/followers")
                },
                following: {
                    suggest: suggestOwnLabel,
                    decide: decideUrlForUser("/following")
                },
                starred: {
                    suggest: suggestOwnLabel,
                    decide: decideUrlForUser("/following#starred")
                },
                repositories: {
                    suggest: suggestOwnLabel,
                    decide: decideUrlForUser("?tab=repositories")
                },
                activities: {
                    suggest: suggestOwnLabel,
                    decide: decideUrlForUser("?tab=activities")
                }
            }
        }
    });

}());