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
        easyAlias: function (value, aStep) {
            return {
                suggest: function (args, text) {
                    var alias = _.isFunction(value.alias) ? value.alias(args, text) : value.alias;
                    return StepManager.suggest(alias);
                },
                decide: function (args, text) {
                    var alias = _.isFunction(value.alias) ? value.alias(args, text) : value.alias;
                    return StepManager.decide(alias);
                }
            }
        }
    },
    "new": {
        shorthand: "straightFwd",
        url: "new",
        children: {
            issue: {
                shorthand: "easyAlias",
                alias: "!new issue"
            },
            repo: {
                shorthand: "straightFwd",
                url: "new"
            }
        }
    }
});