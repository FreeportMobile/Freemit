'use strict';
var request = require('request');
//------------------------------------------------- FX NOW --------------------------
exports.fxNow = function (fromCurrency, toCurrency, amount) {
    return new Promise(function (fulfill, reject) { // Create Promise
        var url = 'http://api.fixer.io/latest?base=' + fromCurrency;
        request(url, function (err, result, body) {
            var result = JSON.parse(body);
            if (result.rates[toCurrency]) {
                fulfill(result.rates[toCurrency])
            }
            else {
                reject("Not Found");
            }
//            console.log(result.rates[toCurrency]);
            //console.log(result.rates);
        });
        // fulfill(result);
    });
};
//------------------------------------------------- END --------------------------
