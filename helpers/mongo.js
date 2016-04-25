'use strict';

//-- SETUP MONGO
var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;

var mongoConnect = 'mongodb://127.0.0.1:27017/Freemit';

//-- CS: PLease only use set or get naming in here

//--- SET SMS 
exports.setSMS = function (phoneNumber, verificationCode) {
 return new Promise(function(resolve, reject) {
     MongoClient.connect(mongoConnect, function (err, db) {
         var jsonToAdd = {};
         jsonToAdd.phoneNumber = phoneNumber;
         jsonToAdd.verificationCode = verificationCode;

         db.collection('PhoneAuth').insertOne(jsonToAdd);

     });

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




