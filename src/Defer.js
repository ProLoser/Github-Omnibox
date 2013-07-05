
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
        this.resolveValue = value;
        if (this.cb) {
            _.forEach(this.cb, function (cb) {
                this.resolveValue = cb(this.resolveValue) || this.resolveValue;
            }, this);
        }
        this.resolved = true;
        return this;
    },
    done: function (cb) {
        if (this.resolved) {
            var self = this;
            setTimeout(function () {
                self.resolveValue = cb(self.resolveValue) || self.resolveValue;
            }, 0)
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


Defer.eachDone = function (value, eachDone) {
    if (_.isArray(value)) {
        _.forEach(value, function (value, index) {
            if (value instanceof Defer) {
                value.done(function (value) {
                    if (_.isArray(value)) {
                        _.each(value, function(value, i, list) {
                            var addedIndex = (i+1) / (list.length+2);
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