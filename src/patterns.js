// Stil prototyping

//This is not 100% end structure
var patterns = {
    my: {
        children: {
            issues: {
                shorthand: "straightFwd", // look in "Step" class definition
                url: "dashboard/issues"
            },
            dash: {
                shorthand: "straightFwd",
                url: ""
            },
            pulls: {
                shorthand: "straightFwd",
                url: "dashboard/pulls"
            },
            stars: {
                shorthand: "straightFwd",
                url: "stars"
            },
            settings: {
                shorthand: "straightFwd",
                url: "dashboard/settings"
            },
            followers: {
                shorthand: "straightFwd",
                url: "<%= user.name %>/followers"
            },
            following: {
                shorthand: "straightFwd",
                url: "<%= user.name %>/following"
            },
            starred: {
                shorthand: "straightFwd",
                url: "stars"
            },
            repositories: {
                shorthand: "straightFwd",
                url: "<%= user.name %>/?tab=repositories"
            },
            activities: {
                shorthand: "straightFwd",
                url: "<%= user.name %>/?tab=activity"
            }
        }
    },

    '!': {
        pattern: /!\w+/,
        //TODO description prefix 'this repo'
        children: {
            io: {
                pattern: /^(io|pages)$/,
                suggest: function (args) {
                    return {
                        content: "!io",
                        description: "this repo's io"
                    }
                },
                decide: function (args) {

                }
            },
            pulls: {
                shorthand: "straightFwd",
                url: "<%= user.name %>/<$= repo.name %>/pulls"
            },
            network: {
                shorthand: "straightFwd",
                url: "<%= user.name %>/<$= repo.name %>/network"
            },
            pulse: {
                shorthand: "straightFwd",
                url: "<%= user.name %>/<$= repo.name %>/pulse"
            },
            settings: {
                shorthand: "straightFwd",
                url: "<%= user.name %>/<$= repo.name %>/settings"
            },
            issues: {
                shorthand: "straightFwd",
                url: "<%= user.name %>/<$= repo.name %>/issues"
            },
            contributors: {
                shorthand: "straightFwd",
                url: "<%= user.name %>/<$= repo.name %>/contributors"
            },
            compare: {
                shorthand: "straightFwd",
                url: "<%= user.name %>/<$= repo.name %>/compare"
            },
            wiki: {
                shorthand: "straightFwd",
                url: "<%= user.name %>/<$= repo.name %>/wiki"
            },
            graphs: {
                shorthand: "straightFwd",
                url: "<%= user.name %>/<$= repo.name %>/graphs"
            },
            '#': { // TODO
                suggest: function (args) {

                },
                decide: function (args) {

                }
            }
        }
    },

    'new': {
        children: { // TODO
            issue: {
                suggest: function (args) {

                },
                decide: function (args) {

                }
            },
            repo: {
                suggest: function (args) {

                },
                decide: function (args) {

                }
            }
        }
    },

    '@user': {
        pattern: /^@\w+/,
        suggest: function (args) {

        },
        decide: function (args) {

        },
        children: {
            followers: {
                suggest: function (args) {

                },
                decide: function (args) {

                }
            },
            following: {
                suggest: function (args) {

                },
                decide: function (args) {

                }
            },
            starred: {
                suggest: function (args) {

                },
                decide: function (args) {

                }
            },
            repositories: {
                suggest: function (args) {

                },
                decide: function (args) {

                }
            },
            activities: {
                suggest: function (args) {

                },
                decide: function (args) {

                }
            }
        }
    },

    'user/repo': {
        pattern: /^\w+\/[\-\w\.]+/, //TODO space at the end
        suggest: function (args) {

        },
        decide: function (args) {

        },

        children: {
            'new': {
                children: {
                    issue: {
                        suggest: function (args) {

                        },
                        decide: function (args) {

                        }
                    },
                    pull: {
                        suggest: function (args) {

                        },
                        decide: function (args) {

                        }
                    }
                }
            },
            issues: {
                suggest: function (args) {

                },
                decide: function (args) {

                }
            },
            io: {
                pattern: /^(io|pages)$/,
                suggest: function (args) {

                },
                decide: function (args) {

                }
            },
            clone: {
                suggest: function (args) {

                },
                decide: function (args) {

                }
            },
            travis: {
                pattern: /^(travis|travis-ci|ci)$/,
                suggest: function (args) {

                },
                decide: function (args) {

                }
            },
            actions: {
                pattern: /^(network|contributors|pulls|pulse|issues|settings|graphs|compare|wiki)$/,
                suggest: function (args) {

                },
                decide: function (args) {

                }
            },
            '#': {
                pattern: /^#[0-9]+/,
                suggest: function (args) {

                },
                decide: function (args) {

                }
            },
            branch: {
                pattern: /^@/,
                suggest: function (args) {

                },
                decide: function (args) {

                }
            },
            path: {
                pattern: /^\/.*/,
                suggest: function (args) {

                },
                decide: function (args) {

                }
            }
        }
    },

    'user/': {
        pattern: /^\w+\//,
        suggest: function (args) {

        },
        decide: function (args) {

        }
    },

    '/repo': {
        pattern: /^\/[\-\w\.]*/,
        suggest: function (args) {

        },
        decide: function (args) {

        }
    }
};

/**
 * What a "Step" is:
 *
 * imagine in our patterns, there is "my issues",
 * then "my" is represented as a Step, with "issues" as a child Step
 *
 * Each Step know it's label (can be "my" or "issues" here), it also knows about
 * - it's parent
 * - it's children
 * - it's level (issues' level is 1 here)
 * - it's pattern (regex or string)
 * - it's value (which is the original object that is specified in the patterns object up there)
 *      I use the value to get the "suggest" and "decide" function for example
 *      Also, any "match" or "startsWith" function on the value overwrites the default ones
 *
 */
var Step = (function () {

    //to not be repetitive
    var StepValueShorthand = {
        straightFwd: function (value, aStep) {
            //getting the "road" to get to this step
            //so here we're constructing the string "my issues"
            var steps = [];
            do {
                steps.unshift(aStep.label);
            } while (aStep = aStep.parent);
            steps = steps.join(" ");

            return {
                suggest: function () {
                    return {
                        content: steps,
                        description: steps
                    };
                },
                decide: function () {
                    return value.url;
                }
            }
        }
    };

    function Step(label, value, level, parent) {
        this.label = label;
        this.level = level;
        this.parent = parent || null;

        if (value.shorthand && StepValueShorthand[value.shorthand]) {
            this.value = StepValueShorthand[value.shorthand](value, this);
        } else {
            this.value = value;
        }

        this.pattern = value.pattern || label;
        this.children = [];
        if (value.match) {
            this.match = value.match;
        }
        if (value.startsWith) {
            this.startsWith = value.startsWith;
        }

        forEach(value.children, function (childVal, childKey) {
            this.children.push(new Step(childKey, childVal, this.level + 1, this));
        }, this);
    }

    Step.prototype = {
        // does this Step match those args?
        // only called when parent matches too
        match: function (args/*, text*/) {
            if (isRegExp(this.pattern)) {
                return this.pattern.test(args[this.level]);
            } else {
                return this.pattern === args[this.level];
            }
        },
        // only called when parent matches too
        startsWith: function (args/*, text*/) {
            if (isRegExp(this.pattern)) {
                return this.pattern.test(args[this.level]);
            } else {
                return this.pattern.indexOf(args[this.level]) === 0;
            }
        },

        // gives suggestions for self and children (if there are still other args, children come first)
        suggest: function (args, text) {
            var suggestions = [];
            if (this.level === args.size0) {
                if (this.startsWith(args) && this.value.suggest) {
                    suggestions = suggestions.concat(this.value.suggest(args, text));
                }
                suggestions = suggestions.concat(this.getChildSuggest(args, text));

            } else if (this.level < args.size0) {
                if (this.match(args)) {
                    suggestions = suggestions.concat(this.getChildSuggest(args, text));
                    if (this.value.suggest) {
                        suggestions = suggestions.concat(this.value.suggest(args, text));
                    }
                }
            }
            return suggestions;
        },
        //gives the suggestions of children
        getChildSuggest: function (args, text) {
            var suggestions = [];
            forEach(this.children, function (childStep) {
                suggestions = suggestions.concat(childStep.suggest(args, text));
            });
            return suggestions;
        },

        //gives the decision of self, or children if there are other args
        decide: function (args, text) {
            var childDecision;
            if (this.match(args)) {
                if (this.level === args.size0) {
                    if (this.value.decide) {
                        return this.value.decide(args, text);
                    }
                } else if (this.level < args.size0) {

                    for (var i = 0; i < this.children.length; i++) {
                        childDecision = this.children[i].decide(args, text);
                        if (childDecision) {
                            return childDecision;
                        }
                    }
                }
            }
            return null;
        }
    };

    return Step;

}());


var StepManager = (function () {
    var steps = [];

    return {
        loadPatterns: function (patterns) {
            forEach(patterns, function (value, key) {
                steps.push(new Step(key, value, 0));
            });
        },
        suggest: function (args, text) {
            var suggestions = [];
            forEach(steps, function (aStep) {
                suggestions = suggestions.concat(aStep.suggest(args, text));
            });
            return suggestions;
        },
        decide: function (args, text) {
            var decision;
            for (var i = 0; i < steps.length; i++) {
                decision = steps[i].decide(args, text);
                if (decision) {
                    return decision;
                }
            }
            return null;
        }
    }

}());
StepManager.loadPatterns(patterns);


//Testing if it works (I'm using node)

var text = "my s";
var args = text.split(' ');
//size0 is the length, starting from 0 instead of 1
args.size0 = args.length - 1;

console.log("Suggesting or deciding for:", text);

console.log(StepManager.suggest(args, text));


// I wasn't using underscore, will switch later if needed
function isArray(arr) {
    return Object.prototype.toString.call(arr) === "[object Array]";
}

function isObject(obj) {
    return Object.prototype.toString.call(obj) === "[object Object]";
}

function isRegExp(regexp) {
    return Object.prototype.toString.call(regexp) === "[object RegExp]";
}

function forEach(obj, iterator, context) {
    var key, len;
    if (obj) {
        if (isArray(obj) || obj.hasOwnProperty("length")) {
            for (key = 0, len = obj.length; key < len; key++) {
                iterator.call(context, obj[key], key);
            }
        } else {
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    iterator.call(context, obj[key], key);
                }
            }
        }
    }
    return obj;
}