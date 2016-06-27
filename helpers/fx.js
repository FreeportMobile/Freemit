'use strict';
var request = require('request');
//------------------------------------------------- FX NOW --------------------------
exports.exchange = function (fromCurrency, toCurrency, amount) {
    console.log('FIRE EXCHANGE 1');
     return new Promise(function(resolve, reject) {
        var url = 'http://api.fixer.io/latest?base=' + fromCurrency;
        request(url, function (err, result, body) {
            console.log(result.rates[toCurrency]);
            var result = JSON.parse(body);
            if (result.rates[toCurrency]) {
                console.log('FIRE EXCHANGE 3');
                resolve(result.rates[toCurrency])
            }
            else {
                reject("Not Found");
            }
        });
    });
};
//------------------------- CONVERT UN TO CURRENCY --------------------------
exports.currency = function (un) {
     return new Promise(function(resolve, reject) {

        if (un == 'USA'){
            var currency = 'USD';
            resolve(currency)
        }
        if (un == 'IND'){
            var currency = 'INR';
            resolve(currency)
        }
        if (un == 'CHN'){
            var currency = 'CNY';
            resolve(currency)
        }
        if (un != 'USA' || un != 'IND' || un != 'CHN' ){
            reject("No UN Found");
        }

    });
};
//------------------------------------------------- END --------------------------
