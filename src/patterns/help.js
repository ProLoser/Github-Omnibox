StepsManager.loadPatterns({
    help: {
        suggest: function () {
            return {
                content: "help",
                description: "help"
            }
        },
        decide: function () {
            return chrome.extension.getURL("help.html");
        }
    }
});