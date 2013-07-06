StepManager.loadPatterns({
    "new": {
        children: {
            issue: {
                suggest: function (args, text) {
                    return StepManager.suggest("!new issue");
                },
                decide: function (args, text) {
                    return StepManager.decide("!new issue");
                }
            },
            repo: {
                suggest: function () {
                    return {
                        content: this.getRoad(),
                        description: this.getRoad()
                    };
                },
                decide: "new"
            }
        }
    }
});