function Defer() {
    if (!(this instanceof Defer)) {
        return new Defer();
    }
    this.resolved = false;
    this.resolveValue = null;
    this.cb = null;
}

Defer.prototype = {
    resolve: function (value) {
        this.resolved = true;
        this.resolveValue = value;
        if (this.cb) {
            _.forEach(this.cb, function (cb) {
                this.resolveValue = cb(this.resolveValue) || this.resolveValue;
            }, this);
        }
        return this;
    },
    //could be synchronous if already resolved!
    done: function (cb) {
        if (this.resolved) {
            this.resolveValue = cb(this.resolveValue) || this.resolveValue;
        } else {
            if (!this.cb) {
                this.cb = [cb];
            } else {
                this.cb.push(cb);
            }
        }
        return this;
    }
};

Defer.allDone = function (values, eachDone) {
    var startingIndex;
    values = values.slice();
    if (_.isArray(values)) {
        startingIndex = values.length;
        for (var i = values.length - 1; i >= 0; i--) {
            if (values[i] instanceof Defer) {
                if (values[i].resolved) {
                    startingIndex = i;
                    if (_.isArray(values[i].resolveValue)) {
                        values.splice.apply(values, [i, 1].concat(values[i].resolveValue));
                    } else {
                        values[i] = values[i].resolveValue
                    }
                } else {
                    (function (startingIndex) {
                        values.splice(i, 1)[0].done(function (val) {
                            val = _.isArray(val) ? val : [val];
                            eachDone(val, startingIndex);
                        });
                    }(i));
                }
            } else {
                startingIndex = i;
            }
        }
        eachDone(values, startingIndex);

    } else {
        if (values instanceof Defer) {
            values.done(eachDone);
        } else {
            eachDone(values);
        }
    }
};

Defer.eachDone = function (value, eachDone) {
    if (_.isArray(value)) {
        _.forEach(value, function (value, index) {
            if (value instanceof Defer) {
                value.done(function (value) {
                    if (_.isArray(value)) {
                        _.each(value, function (value, i, list) {
                            var addedIndex = (i + 1) / (list.length + 2);
                            eachDone(value, index + addedIndex);
                        });
                    } else {
                        eachDone(value, index);
                    }
                });
            } else {
                eachDone(value, index);
            }
        });
    } else {
        if (value instanceof Defer) {
            value.done(eachDone);
        } else {
            eachDone(value);
        }
    }
};