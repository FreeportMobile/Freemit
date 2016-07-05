'use strict';

//----------------------- SORT ITEMS/OBJECTS IN AN ARRAY ----------------------------

// SORTS ELEMENTS OF AN ARRAY
var sortBy = (function () {
  
  var _toString = Object.prototype.toString,
      //the default parser function
      _parser = function (x) { return x; },
      //gets the item to be sorted
      _getItem = function (x) {
        return this.parser((x !== null && typeof x === "object" && x[this.prop]) || x);
      };
  
  /* PROTOTYPE VERSION */
  // Creates the sort method in the Array prototype
  Object.defineProperty(Array.prototype, "sortBy", {
    configurable: false,
    enumerable: false,
    // @o.prop: property name (if it is an Array of objects)
    // @o.desc: determines whether the sort is descending
    // @o.parser: function to parse the items to expected type
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
        //return ((a > b) - (b > a)) * o.desc;
      });
    }
  });
  
  /* FUNCTION VERSION */
  // Sorts the elements of an array
  // @array: the Array
  // @o.prop: property name (if it is an Array of objects)
  // @o.desc: determines whether the sort is descending
  // @o.parser: function to parse the items to expected type
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
  
}());