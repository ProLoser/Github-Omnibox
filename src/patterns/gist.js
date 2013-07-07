(function () {
    StepManager.loadPatterns({
        gist: {
            suggest: function () {
                return {
                    content: "gist",
                    description: "gist"
                }
            },
            decide: function () {
                return "https://gist.github.com/" + omni.user;
            },
            children: {
                id: {
                    pattern: /[0-9]+/,
                    suggest: function (args) {
                        return suggestGist(omni.user, args[1]);
                    },
                    decide: decideGist
                },
                "user/id": {
                    pattern: /^[\w-]+\/[0-9]+$/,
                    suggest: function (args) {
                        var info = args[1].split("/");
                        return suggestGist(info[0], info[1]);
                    },
                    decide: decideGist
                },
                "user/": {
                    pattern: /^[\w-]+\/?$/,
                    suggest: function (args) {
                        return [
                            {
                                content: args.join(" ") + "/",
                                description: args.join(" ") + "/"
                            }
                        ].concat(suggestGist(args[1].replace("/", ""), null));
                    },
                    decide: function (args) {
                        return "https://gist.github.com/" + args[1].replace("/", "");
                    }
                }
            }
        }
    });

    function suggestGist(user, id) {
        var suggestions = [];
        _.each(omni.caches.my.gists, function (gist) {
            if (gist.user.login === user && (!id || gist.id.indexOf(id) === 0)) {
                var url = gist.user.login + "/" + gist.id;
                suggestions.push({
                    content: "gist " + url,
                    description: "gist <url>" + url + "</url>: <dim>" + gist.description.split('&').join('&amp;') + "</dim>"
                });
            }
        });
        return suggestions;
    }

    function decideGist(args) {
        var info = args[1].match(/^([\w-]+\/)?([0-9]+)$/),
            user = info[1] ? info[1].replace("/", "") : omni.user;

        return "https://gist.github.com/" + user + "/" + info[2];
    }
}());