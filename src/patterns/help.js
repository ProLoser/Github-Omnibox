StepsManager.loadPatterns({
    help: {
        suggest: function () {
            return [
                { content: '', description: '<dim>jump to </dim> <url>user</url><match>/</match><url>repo</url>' },
                { content: '/', description: '<dim>search for my</dim> <match>/</match><url>repo</url>' },
                { content: '!', description: '<dim>this repo</dim> <match>!</match><url>action</url>' },
                { content: 'my ', description: '<dim>my account</dim> <match>my</match> <url>action</url>' },
                { content: 'gist ', description: '<dim>gists</dim> <match>gist</match> <url>id</url>' },
                { content: '@', description: '<dim>user actions</dim> <match>@</match><url>user</url>' },
                { content: '*', description: '<dim>favorite repo</dim> <match>*</match><url>repo</url>' }
            ];
        },
        decide: function () {
            return chrome.extension.getURL("help.html");
        }
    }
});