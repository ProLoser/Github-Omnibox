StepsManager.loadPatterns({
    "new": {
        children: {
            issue: {
                suggest: function () {
                    return StepsManager.suggest("!new issue");
                },
                decide: function () {
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