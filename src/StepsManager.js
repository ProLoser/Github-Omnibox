var StepManager = (function () {
    var steps = [];

    return {
        steps: steps,
        loadPatterns: function (patterns) {
            if (patterns.registerShorthands) {
                _.extend(Step.shorthands, patterns.registerShorthands);
                delete patterns.registerShorthands;
            }
            if (patterns.shorthand && Step.shorthands[patterns.shorthand]) {
                patterns = Step.shorthands[patterns.shorthand](patterns, null);
            }

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
                if (decision !== null) {
                    return decision;
                }
            }
            return null;
        }
    }
}());