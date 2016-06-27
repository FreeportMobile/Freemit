'use strict';

//-- SETUP XSS
var xss = require('xss');
//-- SETUP PHONE
var phone = require('phone');
//-- MAKE MONGO AVAILABLE
var mongo = require('./mongo.js');


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

//----------------------- CLEAN NUMBER SENT BY ----------------------------------//
exports.sentNum = function (sentNumber, encPhoneNumber) {
        mongo.getCountryCode(encPhoneNumber)
        .then(function (data) {
            console.log('5');
            var phoneUn = data.un;
            console.log('UN '+phoneUn);
            var countryCode = data.country_code;
            console.log('countryCode '+countryCode);
            var isPlus = sentNumber.substring(0,1);
            if (isPlus =='+'){
                var phoneNumber = exports.num(sentNumber);
            } else {
                var phoneNumber = exports.numUn(sentNumber, phoneUn);
            }
            if (phoneNumber == undefined || phoneNumber == [] || phoneNumber == null || phoneNumber == ''){
                var phoneNumber = exports.num(countryCode + sentNumber); 
            } 
            if(phoneNumber != undefined){
                return(phoneNumber); 
            } else{
                return('error'); 
            }   
            
        })
        .catch(function(err) {
        // some error
        })
}; //-- END FUNCTION


