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
        easyAlias: function (value) {
            return {
                suggest: function (args, text) {
                    var alias = _.isFunction(value.alias) ? value.alias(args, text) : value.alias.split(" ");
                    return StepManager.suggest(alias);
                },
                decide: function (args, text) {
                    var alias = _.isFunction(value.alias) ? value.alias(args, text) : value.alias.split(" ");
                    return StepManager.decide(alias);
                }
            }
        }
    },
    help: {
        shorthand: "straightFwd",
        decide: function () {
            return chrome.extension.getURL("help.html");
        }
    }
});