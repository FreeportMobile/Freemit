'use strict';
var request = require('request');
//------------------------------------------------- FX NOW --------------------------
exports.exchange = function (fromCurrency, toCurrency, amount) {
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
        });
    });
};
//------------------------- CONVERT UN TO CURRENCY --------------------------
exports.currency = function (un) {
    return new Promise(function (fulfill, reject) { // Create Promise

        if (un == 'USA'){
            var currency = 'USD';
            fulfill(currency)
        }
        if (un == 'IND'){
            var currency = 'INR';
            fulfill(currency)
        }
        if (un == 'CHN'){
            var currency = 'CNY';
            fulfill(currency)
        }
        if (un != 'USA' || un != 'IND' || un != 'CHN' ){
            reject("No UN Found");
        }

    });
};
//------------------------------------------------- END --------------------------
