(function () {
    StepsManager.loadPatterns({
        my: {
            suggest: function () {
                var suggestions = [
                    { content: 'my dash', description: '<dim>my</dim> <url>dash</url>'},
                    { content: 'my new repo', description: '<dim>my</dim> <url>new repo</url>'},
                    { content: 'my issues', description: '<dim>my</dim> <url>issues</url>'},
                    { content: 'my pulls', description: '<dim>my</dim> <url>pulls</url>'},
                    { content: 'my stars', description: '<dim>my</dim> <url>stars</url>'},
                    { content: 'my starred', description: '<dim>my</dim> <url>starred</url>'},
                    { content: 'my notifications', description: '<dim>my</dim> <url>notifications</url>'},
                    { content: 'my settings', description: '<dim>my</dim> <url>settings</url>'},
                    { content: 'my followers', description: '<dim>my</dim> <url>followers</url>'},
                    { content: 'my following', description: '<dim>my</dim> <url>following</url>'},
                    { content: 'my repositories', description: '<dim>my</dim> <url>repositories</url>'},
                    { content: 'my activities', description: '<dim>my</dim> <url>activities</url>'},
                    { content: 'my reset', description: '<dim>github omnibox</dim> <url>reset cache</url>' }
                ];
                if (localStorage.setup === 'false')
                    suggestions.push({ content: 'my auth', description: '<dim>github omnibox</dim> <url>authorize with github</url>' });
                if (localStorage.setup === 'true')
                    suggestions.push({ content: 'my unauth', description: '<dim>github omnibox</dim> <url>unauthorize from github</url>' });
                return suggestions;
            },
            children: {
                issues: {
                    suggest: suggestOwnRoad,
                    decide: "dashboard/issues"
                },
                dash: {
                    suggest: suggestOwnRoad,
                    decide: ""
                },
                pulls: {
                    suggest: suggestOwnRoad,
                    decide: "dashboard/pulls"
                },
                stars: {
                    suggest: suggestOwnRoad,
                    decide: "stars"
                },
                starred: {
                    suggest: suggestOwnRoad,
                    decide: "stars"
                },
                notifications: {
                    suggest: suggestOwnRoad,
                    decide: "notifications"
                },
                settings: {
                    suggest: suggestOwnRoad,
                    decide: "dashboard/settings"
                },
                followers: {
                    suggest: suggestOwnRoad,
                    decide: decideWithUser("/followers")
                },
                following: {
                    suggest: suggestOwnRoad,
                    decide: decideWithUser("/following")
                },
                repositories: {
                    suggest: suggestOwnRoad,
                    decide: decideWithUser("?tab=repositories")
                },
                activities: {
                    suggest: suggestOwnRoad,
                    decide: decideWithUser("?tab=activity")
                },
                auth: {
                    suggest: suggestOwnRoad,
                    decide: function () {
                        omni.authorize();
                        alert("You can unauthorize at any time by doing \"gh my unauth\"");
                        return false;
                    }
                },
                unauth: {
                    suggest: suggestOwnRoad,
                    decide: function () {
                        omni.unauthorize();
                        alert('You can authorize at any time by doing "gh my auth"');
                        return false;
                    }
                },
                reset: {
                    suggest: suggestOwnRoad,
                    decide: function () {
                        omni.reset();
                        alert('Cache has been reset'); // TODO reset or clear?
                        return false;
                    }
                },
                "new" : {
                    children: {
                        repo: {
                            suggest: suggestOwnRoad,
                            decide: 'new'
                        }
                    }
                }
            }
        }
    });

    //suggest's the step's road
    function suggestOwnRoad() {
        return {
            content: this.getRoad(),
            description: this.getRoad().replace(/my (.+)/, "<dim>my</dim> <url>$1</url>")
        };
    }

    function decideWithUser(url) {
        return function () {
            return omni.user + url;
        }
    }

}());