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
            },

            auth: {
                shorthand: "myStraightFwd",
                decide: function () {
                    omni.authorize();
                    alert("You can unauthorize at any time by doing \"gh my unauth\"");
                    return false;
                }
            },
            unauth: {
                shorthand: "myStraightFwd",
                decide: function () {
                    omni.unauthorize();
                    alert('You can authorize at any time by doing "gh my auth"');
                    return false;
                }
            },
            reset: {
                shorthand: "myStraightDwf",
                decide: function () {
                    omni.reset();
                    alert('Cache has been reset'); // TODO reset or clear?
                    return false;
                }
            }
        }
    }
});