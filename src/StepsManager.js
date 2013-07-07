var StepsManager = (function () {
    var steps = [];

    return {
        steps: steps,
        loadPatterns: function (patterns) {
            _.forEach(patterns, function (value, key) {
                steps.push(new Step(key, value, 0));
            });
        },
        suggest: function (text) {
            var args = text.split(" ");
            args.size0 = args.length - 1;

            var suggestions = [];
            _.forEach(steps, function (aStep) {
                suggestions = suggestions.concat(aStep.suggest(args, text));
            });
            return suggestions;
        },
        decide: function (text) {
            var args = text.split(" ");
            args.size0 = args.length - 1;

            var decision;
            for (var i = 0; i < steps.length; i++) {
                decision = steps[i].decide(args, text);
                if (!_.isUndefined(decision)) {
                    return decision;
                }
            }
            return null;
        }
    }
}());