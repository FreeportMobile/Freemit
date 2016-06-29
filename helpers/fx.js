'use strict';
var request = require('request');
//------------------------------------------------- FX NOW --------------------------
exports.exchange = function (fromCurrency, toCurrency, amount) {
    return new Promise(function(resolve, reject) {
        if(fromCurrency === toCurrency){
            resolve(1)
        } else {
            var url = 'http://api.fixer.io/latest?base=' + fromCurrency;
            request(url, function (err, result, body) {
            var body = JSON.parse(body);
                if (body.rates[toCurrency]) {
                    resolve(body.rates[toCurrency])
                }
                else {
                    reject("Not Found");
                }
            });
        }


    });
};
//------------------------- CONVERT UN TO CURRENCY --------------------------
exports.currency = function (un) {
        if (un == 'USA'){
            var currency = 'USD';
            return currency
        }
        if (un == 'IND'){
            var currency = 'INR';
            return currency
        }
        if (un == 'CHN'){
            var currency = 'CNY';
            return currency 
        }
};
//------------------------------------------------- END --------------------------
