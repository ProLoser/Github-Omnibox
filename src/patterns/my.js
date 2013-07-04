StepManager.loadPatterns({
    registerShorthands: {
        straightFwd: function (value, aStep) {
            var road = aStep.getRoad();

            return _.extend({
                suggest: function () {
                    return {
                        content: road,
                        description: road
                    };
                },
                decide: function () {
                    return value.url;
                }
            }, value);
        }
    },
    my: {
        children: {
            issues: {
                shorthand: "straightFwd",
                url: "dashboard/issues"
            },
            dash: {
                shorthand: "straightFwd",
                url: ""
            },
            pulls: {
                shorthand: "straightFwd",
                url: "dashboard/pulls"
            },
            stars: {
                shorthand: "straightFwd",
                url: "stars"
            },
            settings: {
                shorthand: "straightFwd",
                url: "dashboard/settings"
            },
            followers: {
                shorthand: "straightFwd",
                url: "<%= gh.user.name %>/followers"
            },
            following: {
                shorthand: "straightFwd",
                url: "<%= gh.user.name %>/following"
            },
            starred: {
                shorthand: "straightFwd",
                url: "stars"
            },
            repositories: {
                shorthand: "straightFwd",
                url: "<%= gh.user.name %>/?tab=repositories"
            },
            activities: {
                shorthand: "straightFwd",
                url: "<%= gh.user.name %>/?tab=activity"
            },
            testing: {
                suggest: function () {
                    var defer = Defer();
                    setTimeout(function () {
                        defer.resolve({content: 2, description: 2})
                    }, 2000);
                    return [
                        {content: 1, description: 1},
                        defer,
                        {content: 3, description: 3}
                    ];
                },
                decide: function () {
                    var defer = Defer();
                    setTimeout(function () {
                        defer.resolve("WORKS")
                    }, 2000);
                    return defer;
                }
            }
        }
    }
});