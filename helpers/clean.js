'use strict';

//-- SETUP XSS
var xss = require('xss');
//-- SETUP PHONE
var phone = require('phone');

//----------------------- CLEAN ME ----------------------------------//
exports.me = function (item) {
    return new Promise(function (resolve, reject) {
        var cleanedResult = xss(item);
        resolve(cleanedResult);  
    }); //-- END PROMISE
}; //-- END FUNCTION

//----------------------- CLEAN NUMBER ----------------------------------//
exports.num = function (num) {
    return new Promise(function (resolve, reject) {
        var cleanedPhone = phone(num);
        resolve(cleanedPhone); 
    }); //-- END PROMISE
}; //-- END FUNCTION

