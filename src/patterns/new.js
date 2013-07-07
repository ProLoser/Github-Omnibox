StepsManager.loadPatterns({
    "new": {
        children: {
            issue: {
                suggest: function (args, text) {
                    return StepsManager.suggest("!new issue");
                },
                decide: function (args, text) {
                    return StepsManager.decide("!new issue");
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