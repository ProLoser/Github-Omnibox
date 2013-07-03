// Stil prototyping

//This is not 100% end structure
var patterns = {
    my: {
        children: {
            issues: {
                shorthand: "straightForward", // look in "Step" class definition
                url: "dashboard/issues"
            },
            dash: {
                shorthand: "straightForward",
                url: ""
            },
            pulls: {
                shorthand: "straightForward",
                url: "dashboard/pulls"
            },
            stars: {
                shorthand: "straightForward",
                url: "stars"
            },
            settings: {
                shorthand: "straightForward",
                url: "dashboard/settings"
            },
            followers: {
                shorthand: "straightForward",
                url: "<%= user.name %>/followers"
            },
            following: {
                shorthand: "straightForward",
                url: "<%= user.name %>/following"
            },
            starred: {
                shorthand: "straightForward",
                url: "stars"
            },
            repositories: {
                shorthand: "straightForward",
                url: "<%= user.name %>/?tab=repositories"
            },
            activities: {
                shorthand: "straightForward",
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
                shorthand: "straightForward",
                url: "<%= user.name %>/<$= repo.name %>/pulls"
            },
            network: {
                shorthand: "straightForward",
                url: "<%= user.name %>/<$= repo.name %>/network"
            },
            pulse: {
                shorthand: "straightForward",
                url: "<%= user.name %>/<$= repo.name %>/pulse"
            },
            settings: {
                shorthand: "straightForward",
                url: "<%= user.name %>/<$= repo.name %>/settings"
            },
            issues: {
                shorthand: "straightForward",
                url: "<%= user.name %>/<$= repo.name %>/issues"
            },
            contributors: {
                shorthand: "straightForward",
                url: "<%= user.name %>/<$= repo.name %>/contributors"
            },
            compare: {
                shorthand: "straightForward",
                url: "<%= user.name %>/<$= repo.name %>/compare"
            },
            wiki: {
                shorthand: "straightForward",
                url: "<%= user.name %>/<$= repo.name %>/wiki"
            },
            graphs: {
                shorthand: "straightForward",
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
            whatever: {
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

//Represent an "arg"
var Step = (function () {

    var StepValueShorthand = {
        straightForward: function (value, aStep) {
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

        if (value.shorthand && StepValueShorthand[value.shorthand]) {
            this.value = StepValueShorthand[value.shorthand](value, this);
        } else {
            this.value = value;
        }

        this.parent = parent;

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
        match: function (args/*, text*/) {
            if (isRegExp(this.pattern)) {
                return this.pattern.test(args[this.level]);
            } else {
                return this.pattern !== args[this.level];
            }
        },
        startsWith: function (args/*, text*/) {
            if (isRegExp(this.pattern)) {
                return this.pattern.test(args[this.level]);
            } else {
                return this.pattern.indexOf(args[this.level]) != -1;
            }
        },

        canSuggest: function (args/*, text*/) {
            return this.level <= args.length;
        },


        suggest: function (args, text) {
            var suggestions = [];
            if (this.level === args.length) {
                if (this.value.suggest) {
                    return this.value.suggest(args, text);
                }
            } else if(this.level < args.length) {
                forEach(this.value.children, function (childStep) {
                    suggestions = suggestions.concat(childStep.suggest(args, text));
                });
            }

            return suggestions;

            /*var suggestions = this.value.suggest ? this.value.suggest(args, text) : [];
             forEach(this.value.children, function (childStep) {
             suggestions = suggestions.concat(childStep.suggest(args, text));
             });
             return suggestions;*/
        },
        decide: function (args, text) {
            if (this.level === args.length) {
                if (this.value.decide) {
                    return this.value.decide(args, text);
                } else {
                    return null;
                }
            }
        }
    };

    return Step;

}());


var StepManager = (function () {
    var steps = [];

    return {
        loadPatterns: function (patterns) {
            forEach(patterns, function (value, key) {
                steps.push(new Step(key, value, 1, null));
            });
        }
    }

}());

StepManager.loadPatterns(patterns);

var suggest = (function () {
    function suggest(text) {
        var args = text.split(' ');

        loopThroughPatterns(patterns, function (value, key, road) {
            if (args.length <= road.length && matchRoad(args, road)) {
                console.log(!!value.decide, joinRoad(road));
            }
        });
    }


    return suggest;

    function joinRoad(road) {
        var labels = [];
        forEach(road, function (val) {
            labels.push(val.label);
        });
        return labels.join('.');
    }

    /*function isEmptyObject(obj) {
     for(var key in obj) {
     if(obj.hasOwnProperty(key)) {
     return false;
     }
     }
     return true;
     }*/

    function loopThroughPatterns(obj, iterator, context, _road) {
        _road = _road || [];
        forEach(obj, function (value, key) {
            var road;
            if (isObject(value)) {
                road = _road.concat([
                    {
                        label: key,
                        value: value,
                        pattern: value.pattern || key
                    }
                ]);

                if (iterator.call(this, value, key, road) !== false) {
                    loopThroughPatterns(value.children, iterator, this, road);
                }
            }
        }, context);
    }

    function matchRoad(args, road) {
        var lastIndex = args.length - 1;
        for (var i = 0, ii = lastIndex - 1; i <= ii; i++) {
            if (isRegExp(road[i].pattern) ? !road[i].pattern.test(args[i]) : road[i].pattern !== args[i]) {
                return false;
            }
        }
        return isRegExp(road[lastIndex].pattern) ? !!road[lastIndex].pattern.test(args[lastIndex]) : road[lastIndex].pattern.indexOf(args[lastIndex]) != -1;
    }

}());

suggest('rodyhaddad/dsahb');

// I wasn't using underscore
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