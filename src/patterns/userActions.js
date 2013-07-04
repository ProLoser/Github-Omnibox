StepManager.loadPatterns({
    registerShorthands: {
        userActions: function (value, aStep) {
            var road = aStep.getRoad();

            return _.extend({
                suggest: function (args) {
                    return {
                        content: aStep.parent ? args[0] + " " + aStep.label : args[0],
                        description: aStep.parent ? args[0] + " " + aStep.label : args[0]
                    };
                },
                decide: function (args) {
                    var user;
                    if (args[0][0] == "@") {
                        user = args[0][0].substring(1) + "/";
                    } else {
                        user = args[0];
                    }
                    return user + value.url;
                }
            }, value);
        }
    },
    "@user/": {
        pattern: /^\w+\/|@\w+/, //also accepts user/
        shorthand: "userActions",
        url: "",

        children: {
            followers: {
                shorthand: "userActions",
                url: "followers"
            },
            following: {
                shorthand: "userActions",
                url: "following"
            },
            starred: {
                shorthand: "userActions",
                url: "following#starred"
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