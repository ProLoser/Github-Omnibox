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
    StepManager.loadPatterns({
        registerShorthands: {
            userActions: function (value, aStep) {
                return _.extend({
                    suggest: function (args) {
                        return {
                            content: aStep.parent ? args[0] + " " + aStep.label : args[0],
                            description: aStep.parent ? args[0] + " " + aStep.label : args[0]
                        };
                    },
                    decide: function (args) {
                        return getUser(args) + value.url;
                    }
                }, value);
            }
        },
        "@user/": {
            // TODO not sure this regex is good
            pattern: /^\w*\/$|^@\w*$/, // accepts @user and user/
            shorthand: "userActions",
            url: "",
            suggest: function (args) {
                var user = getUser(args);
                var suggestions = [{
                    content: "@" + user,
                    description: "@" + user
                }];
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

            children: {
                followers: {
                    shorthand: "userActions",
                    url: "/followers"
                },
                following: {
                    shorthand: "userActions",
                    url: "/following"
                },
                starred: {
                    shorthand: "userActions",
                    url: "/following#starred"
                },
                repositories: {
                    shorthand: "userActions",
                    url: "?tab=repositories"
                },
                activities: {
                    shorthand: "userActions",
                    url: "?tab=activities"
                }
            }
        }
    });

}());