'use strict';

//-- SETUP MONGO
var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/my_database');

//-- CS: PLease only use set or get naming in here

//--- SET SMS 
exports.setSMS = function (phoneNumber, verificationCode) {
 return new Promise(function(resolve, reject) {
	
	// SAVE TO MONGO
    console.log(phoneNumber);
    console.log(verificationCode);
    
      someMongoFunction({   
          // TODO: link this up to mongo
        }, function (error, data) {
            if (error){
                reject(error);
            } else {
                resolve(data);
            }
        });
}); //-- END PROMISE
}; //-- END FUNCTION




