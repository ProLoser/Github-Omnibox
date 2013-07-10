(function () {
    StepsManager.loadPatterns({
        "@user": {
            pattern: /^@[\w-]*$/, // accepts @user
            suggest: function (args) {
                var user = getUser(args).toLowerCase();
                var suggestions = [
                    {
                        content: "@" + user,
                        description: "@" + user
                    }
                ];
                _.each(omni.caches.my.following, function (followedUser) {
                    var login = followedUser.login.toLowerCase();
                    if (!user || (login.indexOf(user) === 0 && login !== user)) {
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
                },
                help: {
                    suggest: function(args){
                        return [
                            { content: args[0] + ' starred',      description: '<match>' + args[0].substr(0) + '</match> <url>starred</url>'},
                            { content: args[0] + ' followers',    description: '<match>' + args[0].substr(0) + '</match> <url>followers</url>'},
                            { content: args[0] + ' following',    description: '<match>' + args[0].substr(0) + '</match> <url>following</url>'},
                            { content: args[0] + ' repositories', description: '<match>' + args[0].substr(0) + '</match> <url>repositories</url>'},
                            { content: args[0] + ' activities',   description: '<match>' + args[0].substr(0) + '</match> <url>activities</url>'}
                        ];
                    },
                }
            }
        }
    });

    function getUser(args) {
        return args[0].substring(1);
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
}());