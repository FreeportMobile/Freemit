'use strict';

//----------------------- SORT ITEMS/OBJECTS IN AN ARRAY ----------------------------

exports.sortBy = function () {

    var _toString = Object.prototype.toString,
        _parser = function (x) { return x; },
        _getItem = function (x) {
        return this.parser((x !== null && typeof x === "object" && x[this.prop]) || x);
        };

    Object.defineProperty(Array.prototype, "sortBy", {
    configurable: false,
    enumerable: false,
    value: function (o) {
            if (_toString.call(o) !== "[object Object]")
            o = {};
            if (typeof o.parser !== "function")
            o.parser = _parser;
            o.desc = !!o.desc ? -1 : 1;
            return this.sort(function (a, b) {
            a = _getItem.call(o, a);
            b = _getItem.call(o, b);
            return o.desc * (a < b ? -1 : +(a > b));
            });
        }
    });

return function (array, o) {
    if (!(array instanceof Array) || !array.length)
        return [];
    if (_toString.call(o) !== "[object Object]")
        o = {};
    if (typeof o.parser !== "function")
        o.parser = _parser;
        o.desc = !!o.desc ? -1 : 1;
    return array.sort(function (a, b) {
        a = _getItem.call(o, a);
        b = _getItem.call(o, b);
        return o.desc * (a < b ? -1 : +(a > b));
    });
};

};