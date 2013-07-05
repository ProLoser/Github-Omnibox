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
        },
        myStraightFwd: function (value, aStep) {
            var road = aStep.getRoad();

            return _.extend({
                suggest: function () {
                    return {
                        content: road,
                        description: road
                    };
                },
                decide: function () {
                    return omni.user + "/" + value.url;
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
            starred: {
                shorthand: "straightFwd",
                url: "stars"
            },
            settings: {
                shorthand: "straightFwd",
                url: "dashboard/settings"
            },
            followers: {
                shorthand: "myStraightFwd",
                url: "followers"
            },
            following: {
                shorthand: "myStraightFwd",
                url: "following"
            },
            repositories: {
                shorthand: "myStraightFwd",
                url: "?tab=repositories"
            },
            activities: {
                shorthand: "myStraightFwd",
                url: "?tab=activity"
            }
        }
    }
});