'use strict';

//-- SETUP MONGO
var mongoClient = require('mongodb').MongoClient;


//----------------------- SET CONTACTS ----------------------------------//

exports.setContacts = function (name, phoneNumber, countryCode) {
    return new Promise(function(resolve, reject) {
console.log('FIRE3');
        // OPEN CONNECTION     
        mongoClient.connect(process.env.MONGO_DB, function (err, db) {
            if (err) {
                reject(err);
                console.log('Unable to connect to the mongoDB server. Error:', err);
            } 

            // PREPARE DATA
            var collection = db.collection('users');
            var doc = {
                name: name,
                phone_number: phoneNumber,
                country_code: countryCode,
            };
         
                 // UPDATE         
        collection.update({phone_number:phoneNumber}, 
        {$set:doc}, { upsert: true }, function(err, result) {
        
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

//----------------------- SET COUNTRY CODE ----------------------------------//

exports.setCountryCode = function (country_name, currency_symbol, currency_abbreviation, dialing_code) {
    return new Promise(function(resolve, reject) {

        // OPEN CONNECTION     
        mongoClient.connect(process.env.MONGO_DB, function (err, db) {
            if (err) {
                reject(err);
                console.log('Unable to connect to the mongoDB server. Error:', err);
            } 

            // PREPARE DATA
            var collection = db.collection('country_codes');
            var doc = {
                country_name: country_name,
                currency_symbol: currency_symbol,
                currency_abbreviation: currency_abbreviation,
                dialing_code: dialing_code
            };
         
         
        // INSERT
        
        collection.insert(doc, {w:1}, function(err, result) {
           
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


//----------------------- SET CARD ----------------------------------//

exports.setCard = function (encPhoneNumber, encCardNumber, encCardCVC, encCardMonth, encCardYear, lastFour, encCardType) {
    return new Promise(function(resolve, reject) {
        console.log('SET CARD')

        // OPEN CONNECTION     
        mongoClient.connect(process.env.MONGO_DB, function (err, db) {
            if (err) {
                reject(err);
                console.log('Unable to connect to the mongoDB server. Error:', err);
   
            } else {

            // PREPARE DATA
            var collection = db.collection('users');
            var doc = {
                last_seen: Date.now().toString(),
                card_type: encCardType,
                phone_number: encPhoneNumber,
                card_number: encCardNumber,
                card_CVC: encCardCVC,
                card_month: encCardMonth,
                card_year: encCardYear,
                last_four: lastFour,
            };
         
         
        // UPDATE         
        collection.update({phone_number:encPhoneNumber}, 
        {$set:doc}, { upsert: true }, function(err, result) {
        
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
            
            db.close();
            
        });

            } //-- END ELSE
        }); //-- END CONNECT      
    }); //-- END PROMISE
}; //-- END FUNCTION


//----------------------- SET SMS ----------------------------------//

exports.setSMS = function (encPhoneNumber, verificationCode, currencySymbol, currencyAbbreviation, country, countryCode, bitcoinAddress, encPrivateKey) {
    return new Promise(function (resolve, reject) {
        console.log('SET SMS');
        // OPEN CONNECTION     
        mongoClient.connect(process.env.MONGO_DB, function (err, db) {
            if (err) {
                reject(err);
                console.log('Unable to connect to the mongoDB server. Error:', err);
            }

            // PREPARE DATA
            var collection = db.collection('users');
            var doc = {
                first_seen: Date.now().toString(),
                country: country,
                currency_abbreviation: currencyAbbreviation,
                currency_symbol: currencySymbol,
                verification_code: verificationCode,
                bitcoin_address: bitcoinAddress,
                private_key: encPrivateKey,
            };


            // UPDATE         
            collection.update({ phone_number: encPhoneNumber },
                { $set: doc }, { upsert: true }, function (err, result) {

                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                    db.close();

                });


        }); //-- END CONNECT      
    }); //-- END PROMISE
}; //-- END FUNCTION


//-------------------------- GET BITCOIN ADDRESS -----------------------//

exports.getBitcoinAddress = function (encPhoneNumber) {
    return new Promise(function(resolve, reject) {
           
       // OPEN CONNECTION     
        mongoClient.connect(process.env.MONGO_DB, function (err, db) {
        if (err) {
            reject(err);
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {

        // SELECT THE COLLECTION
        var collection = db.collection('users');
    
        // GET   
        // TODO: Figure out how to only return the records for the card and not the rest     
        collection.findOne({phone_number:encPhoneNumber}, function(err, item) {
            if(err){
                reject(err);
            }else{
                resolve(item);                 
            };
            db.close();
        });
       
            }//-- END ELSE
        }); //-- END CONNECT   
    }); //-- END PROMISE
}; //-- END FUNCTION


//-------------------------- GET COUNTRY CODE -----------------------//

exports.getCountryCode = function (encPhoneNumber) {
    return new Promise(function(resolve, reject) {
           
       // OPEN CONNECTION     
        mongoClient.connect(process.env.MONGO_DB, function (err, db) {
        if (err) {
            reject(err);
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {

        // SELECT THE COLLECTION
        var collection = db.collection('users');
    
        // GET   
        // TODO: Figure out how to only return the records for the card and not the rest     
        collection.findOne({phone_number:encPhoneNumber}, function(err, item) {
            if(err){
                reject(err);
            }else{
                resolve(item);                 
            };
            db.close();
        });
       
            }//-- END ELSE
        }); //-- END CONNECT   
    }); //-- END PROMISE
}; //-- END FUNCTION


//-------------------------- GET CARD -----------------------//

exports.getCard = function (encPhoneNumber) {
    return new Promise(function(resolve, reject) {
           
       // OPEN CONNECTION     
        mongoClient.connect(process.env.MONGO_DB, function (err, db) {
        if (err) {
            reject(err);
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {

        // SELECT THE COLLECTION
        var collection = db.collection('users');
    
        // GET   
        // TODO: Figure out how to only return the records for the card and not the rest     
        collection.findOne({phone_number:encPhoneNumber}, function(err, item) {
            if(err){
                reject(err);
            }else{
                resolve(item);                 
            };
            db.close();
        });
       
            }//-- END ELSE
        }); //-- END CONNECT   
    }); //-- END PROMISE
}; //-- END FUNCTION



//-------------------------- GET BALANCE -----------------------//

exports.getBalance = function (encPhoneNumber) {
    return new Promise(function(resolve, reject) {
        
        
        
       // OPEN CONNECTION     
        mongoClient.connect(process.env.MONGO_DB, function (err, db) {
        if (err) {
            reject(err);
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {

        // SELECT THE COLLECTION
        var collection = db.collection('users');
    
        // GET        
        collection.findOne({phone_number:encPhoneNumber}, function(err, item) {
            if(err){
                reject(err);
            }else{
                resolve(item);                 
            };
            db.close();
        });
       
            }//-- END ELSE
        }); //-- END CONNECT   
    }); //-- END PROMISE
}; //-- END FUNCTION



//-------------------------- GET CURRENCY FROM PHONE NUMBER -----------------------//

exports.getCurrency = function (countryCode) {
    return new Promise(function(resolve, reject) {
        
                // OPEN CONNECTION     
        mongoClient.connect(process.env.MONGO_DB, function (err, db) {
        if (err) {
            reject(err);
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } 

        // SELECT THE COLLECTION
        var collection = db.collection('country_codes');
    
   
        // GET        
        collection.findOne({dialing_code:countryCode}, function(err, item) {
            if(err){
                reject(err);
            }else{
               resolve(item);     
            };
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
        collection.findOne({phone_number:phoneNumber}, function(err, item) {
            if(err){
                reject(err);
            }else{
                if(phoneNumber == item.phone_number && verificationCode == item.verification_code){
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