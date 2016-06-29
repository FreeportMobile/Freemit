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
        return(cleanedPhone[0]); 
}; //-- END FUNCTION

//----------------------- CLEAN NUMBER + UN ----------------------------------//
exports.numUn = function (num, un) {
        var cleanedPhone = phone(num, un);
        return(cleanedPhone[0]); 
}; //-- END FUNCTION

//----------------------- GET UN ----------------------------------//
exports.getUn = function (num) {
        var phoneUn = phone(num);
        return(phoneUn[1]); 
}; //-- END FUNCTION

//----------------------- CLEAN NUMBER SENT BY ----------------------------------//
exports.sentNum = function (sentNumber, fromPhoneUn, countryCode) {
            var isPlus = sentNumber.substring(0,1);
            if (isPlus =='+'){
                var phoneNumber = exports.num(sentNumber);
            } else {
                var phoneNumber = exports.numUn(sentNumber, fromPhoneUn);
            }
            if (phoneNumber == undefined || phoneNumber == [] || phoneNumber == null || phoneNumber == ''){
                var phoneNumber = exports.num(countryCode + sentNumber); 
            } 
            if(phoneNumber != undefined){
                return(phoneNumber); 
            }  
}; //-- END FUNCTION

