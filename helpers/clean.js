'use strict';

//-- SETUP XSS
var xss = require('xss');
//-- SETUP PHONE
var phone = require('phone');

//----------------------- CLEAN ME ----------------------------------//
exports.me = function (item) {
        var cleanedResult = xss(item);        
        return(cleanedResult);  
}; //-- END FUNCTION

//----------------------- CLEAN NUMBER ----------------------------------//
exports.num = function (num) {
        var cleanedPhone = phone(num);
        console.log(cleanedPhone);
        return(cleanedPhone[0]); 
}; //-- END FUNCTION

//----------------------- CLEAN NUMBER + UN ----------------------------------//
exports.numUn = function (num, un) {
        var cleanedPhone = phone(num, un);
        console.log(cleanedPhone[0]);
        return(cleanedPhone[0]); 
}; //-- END FUNCTION

