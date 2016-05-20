'use strict';

var accountSid = process.env.ACCOUNT_SID; 
var authToken = process.env.AUTH_TOKEN; 
var smsFrom =  process.env.SMS_FROM; 
var client = require('twilio')(accountSid, authToken); 

//--- SEND SMS
exports.sendSMS = function (phoneNumber, message) {
 return new Promise(function(resolve, reject) {
     
    client.messages.create({ 
        to: phoneNumber, 
        from: smsFrom, 
        body: message,   
    }, function(err, message) { 
        if(err){
            reject(err);
        } else {
            resolve(message);
        }  
    });
    
}); //-- END PROMISE
}; //-- END FUNCTION




