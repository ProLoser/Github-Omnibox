var CSS_PREFIX = "github-omnibox-";

var heading = document.querySelector('.js-current-repository'),
    items = [
    {
        img: 'https://secure.travis-ci.org/{owner}/{repo}.png',
        url: 'http://travis-ci.org/{owner}/{repo}',
        icon: {
            src: "http://travis-ci.org/favicon.ico",
            className: CSS_PREFIX + "travis-icon"
        }
    },{
        img: 'https://david-dm.org/{owner}/{repo}.png',
        url: 'https://david-dm.org/{owner}/{repo}',
        icon: {
            src: "http://david-dm.org/favicon.ico",
            className: CSS_PREFIX + "david-icon"
        }
    }
];

if (heading && items && items.length) {

    var tokens = heading.href.split('/').slice(-2),
        sidebar = document.querySelector(".repo-container .repo-nav-contents");

    if (sidebar) {
        sidebar.appendChild($el("div", {
            className: "repo-menu-separator only-with-full-nav"
        }));

        sidebar.appendChild($el("ul", {
            className: "repo-menu only-with-full-nav",
            children: items.map(function (item) {
                return {
                    tagName: "li",
                    className: CSS_PREFIX + "sidebar-item",
                    children: {
                        "a": {
                            href: item.url.
                                replace('{owner}', tokens[0]).
                                replace('{repo}', tokens[1]),
                            children: addOptionalIcon([
                                {
                                    tagName: "img",
                                    src: item.img.
                                        replace('{owner}', tokens[0]).
                                        replace('{repo}', tokens[1])
                                }
                            ])
                        }
                    }
                };

                function addOptionalIcon(children) {
                    if (item.icon) {
                        children.unshift(merge({tagName: "img"}, item.icon));
                    }
                    return children;
                }
            })
        }));
    }
}


// ** Helper methods ** //

function $el(tagName, properties) {
    if (!properties) {
        properties = tagName;
        tagName = properties.tagName;
    }
    var el = document.createElement(tagName);
    forEach(properties, function (value, key) {
        switch (key) {
            case "children":
                if (isArray(value)) {
                    forEach(value, function (child) {
                        el.appendChild($el(child));
                    });
                } else {
                    // relaying on v8 keeping iteration order == definition
                    forEach(value, function (child, tagName) {
                        el.appendChild($el(tagName, child));
                    });
                }
                break;
            case "style":
                merge(el.style, value);
                break;
            default:
                el[key] = value;
                break;
        }
    });

    return el;
}


/**
 * Invokes the `iterator` function once for each item in `obj` collection, which can be either an object or an array.
 * the `iterator` function is invoked with iterator(value, key|index), with it's `this` being the `context`
 *
 * @param {Object|Array} obj Object to iterate over
 * @param {Function} iterator Iterator function
 * @param {*} [context] The context (`this`) for the iterator function
 * @returns {*} The obj passed in
 */
function forEach(obj, iterator, context) {
    var key, len;
    if (obj) {
        if (isFn(obj)) {
            for (key in obj) {
                if (obj.hasOwnProperty(key) && key != "prototype" && key != "length" && key != "name") {
                    iterator.call(context, obj[key], key);
                }
            }
        } else if (isArray(obj) || obj.hasOwnProperty("length")) {
            for (key = 0, len = obj.length; key < len; key++) {
                iterator.call(context, obj[key], key);
            }
        } else if (obj.forEach && obj.forEach !== forEach) {
            obj.forEach(iterator, context);
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

/**
 * Determine whether the argument is an array or not
 *
 * @param arr Variable to test on
 * @returns {boolean} Whether the argument is an array or not
 */
function isArray(arr) {
    return Object.prototype.toString.call(arr) === "[object Array]";
}

/**
 * Determine whether the argument is a function or not
 *
 * @param fn Variable to test on
 * @returns {boolean} Whether the argument is a function or not
 */
function isFn(fn) {
    return typeof fn === "function";
}

/**
 * Merges the `destination` and the `source` objects
 * by copying all of the properties from the source object to the destination object.
 *
 * @param {Object} destination Destination Object
 * @param {Object} source Source Object
 * @returns {Object} The mutated `destination` Object
 */
function merge(destination, source) {
    if (destination && source) {
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                destination[key] = source[key];
            }
        }
    }
    return destination;
}