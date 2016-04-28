'use strict';

//-- SETUP MONGO
var mongoClient = require('mongodb').MongoClient;

//----------------------- SET SMS ----------------------------------//

exports.setSMS = function (phoneNumber, verificationCode) {
    return new Promise(function(resolve, reject) {

        // OPEN CONNECTION     
        mongoClient.connect(process.env.MONGO_DB, function (err, db) {
            if (err) {
                reject(err);
                console.log('Unable to connect to the mongoDB server. Error:', err);
            } 

            // PREPARE DATA
            var collection = db.collection('users');
            var doc = {
                phoneNumber: phoneNumber,
                verificationCode: verificationCode
            };
         
         
        // UPDATE         
        collection.update({phoneNumber:phoneNumber}, 
        {$set:{verificationCode:verificationCode}}, { upsert: true }, function(err, result) {
        
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
            db.close();
            
        });


        }); //-- END CONNECT      
    }); //-- END PROMISE
}; //-- END FUNCTION

//-------------------------- GET VERIFICATION -----------------------//

exports.getVerification = function (phoneNumber, verificationCode) {
    return new Promise(function(resolve, reject) {
        
                // OPEN CONNECTION     
        mongoClient.connect(process.env.MONGO_DB, function (err, db) {
        if (err) {
            reject(err);
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } 

        // SELECT THE COLLECTION
        var collection = db.collection('users');
    
   
        // GET        
        collection.findOne({phoneNumber:phoneNumber}, function(err, item) {
            if(err){
                reject(err);
            }else{
                if(phoneNumber == item.phoneNumber && verificationCode == item.verificationCode){
                    resolve(200);
                }else{
                    reject(404);
                };
            
            };
            db.close();
        });
       
       
        }); //-- END CONNECT   
    }); //-- END PROMISE
}; //-- END FUNCTION

//-------------------------- END -----------------------//