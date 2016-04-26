'use strict';

//-- SETUP MONGO
var mongoClient = require('mongodb').MongoClient;

//--- SET SMS 
exports.setSMS = function (phoneNumber, verificationCode) {
 return new Promise(function(resolve, reject) {

// OPEN CONNECTION     
      mongoClient.connect(process.env.MONGO_DB, function (err, db) {
        if (err) {
            reject(err);
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            console.log('Mongo connection open');
            resolve(db);
        }

// PREPARE DATA

    var collection = db.collection('users');
    var doc = {
        phoneNumber: phoneNumber,
        verificationCode: verificationCode
    };
         
// UPDATE         
   collection.update({phoneNumber:phoneNumber}, {$set:{verificationCode:verificationCode}}, function(err, result) {});
       
// CLOSE DB
    db.close();

      }); //-- END CONNECT      
 }); //-- END PROMISE
}; //-- END FUNCTION





