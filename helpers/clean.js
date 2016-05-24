'use strict';

//-- SETUP XSS
var xss = require('xss');
//-- SETUP PHONE
var phone = require('phone');

//----------------------- CLEAN ME ----------------------------------//
exports.me = function (item) {
    return new Promise(function (resolve, reject) {
        cleanedResult = xss(item);
        resolve(cleanedResult);  
    }); //-- END PROMISE
}; //-- END FUNCTION

//----------------------- CLEAN NUMBER ----------------------------------//
exports.num = function (num) {
    return new Promise(function (resolve, reject) {
        cleanedPhone = phone(num);
        resolve(cleanedPhone[0]); 
    }); //-- END PROMISE
}; //-- END FUNCTION

