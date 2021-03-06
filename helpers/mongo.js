'use strict';

//-- SETUP MONGO
var mongoClient = require('mongodb').MongoClient;
// -- Setup Mongoose models
var users = require('../models/users.js');

//----------------------- SET CHAT ----------------------------------//

exports.setChat = function (fromEncPhoneNumber, toEncPhoneNumber, chatText) {
    return new Promise(function(resolve, reject) {
        // OPEN CONNECTION     
        mongoClient.connect(process.env.MONGO_DB, function (err, db) {
            if (err) {
                reject(err);
                console.log(err);
            } 
    // PREPARE DATA
            var collection = db.collection('chat');
            var doc = {
                from_phone: fromEncPhoneNumber,
                to_phone: toEncPhoneNumber,
                chat_text: chatText,
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

//----------------------- SET CONTACTS ----------------------------------//

exports.setContacts = function (name, phoneNumber, phoneUn, bitcoinAddress, encPrivateKey) {

    return new Promise(function(resolve, reject) {
        // OPEN CONNECTION     
        mongoClient.connect(process.env.MONGO_DB, function (err, db) {
            if (err) {
                reject(err);
                console.log(err);
            } 
    // PREPARE DATA
            var collection = db.collection('users');
            var doc = {
                name: name,
                phone_number: phoneNumber,
                un: phoneUn,
                bitcoin_address: bitcoinAddress,
                private_key: encPrivateKey,
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

exports.setCountryCode = function (countryName, currencySymbol, currencyAbbreviation, dialingCode) {
    return new Promise(function(resolve, reject) {
    // OPEN CONNECTION     
        mongoClient.connect(process.env.MONGO_DB, function (err, db) {
            if (err) {
                reject(err);
                console.log(err);
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


//----------------------- SET BANK IN ----------------------------------//

exports.setBankIn = function (transactionID, status, value, currency, userID, cardID, fingerprint, created) {
    return new Promise(function(resolve, reject) {
    // OPEN CONNECTION     
        mongoClient.connect(process.env.MONGO_DB, function (err, db) {
            if (err) {
                reject(err);
                console.log(err);
            } else {
    // PREPARE DATA
            var collection = db.collection('bankIn');
            var doc = {
                transaction_id:transactionID,
                value:value,
                currency:currency,
                user_id:userID,
                card_id:cardID,
                fingerprint:fingerprint,
                created:created,                
            };                
    // UPDATE         
        collection.update({transaction_id:transactionID}, 
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

//----------------------- SET CARD ----------------------------------//

exports.setCard = function (encPhoneNumber, encCardNumber, encCardCVC, encCardMonth, encCardYear, lastFour, encCardType) {
    return new Promise(function(resolve, reject) {

        // OPEN CONNECTION     
        mongoClient.connect(process.env.MONGO_DB, function (err, db) {
            if (err) {
                reject(err);
                console.log(err);
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


//----------------------- SET KNOWN USER ----------------------------------//

exports.setKnownUser = function (encPhoneNumber, verificationCode, currencySymbol, currencyAbbreviation, country, countryCode, un) {
    return new Promise(function (resolve, reject) {
    // OPEN CONNECTION     
        mongoClient.connect(process.env.MONGO_DB, function (err, db) {
            if (err) {
                reject(err);
                console.log(err);
            }
    // PREPARE DATA
            var collection = db.collection('users');
            var doc = {
                first_seen: Date.now().toString(),
                country: country,
                currency_abbreviation: currencyAbbreviation,
                currency_symbol: currencySymbol,
                country_code: countryCode,
                verification_code: verificationCode,
                un: un,
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


//----------------------- SET NEW USER ----------------------------------//

exports.setNewUser = function (encPhoneNumber, verificationCode, currencySymbol, currencyAbbreviation, country, countryCode, bitcoinAddress, encPrivateKey, un) {
    return new Promise(function (resolve, reject) {
    // OPEN CONNECTION     
        mongoClient.connect(process.env.MONGO_DB, function (err, db) {
            if (err) {
                reject(err);
                console.log(err);
            }
    // PREPARE DATA
            var collection = db.collection('users');
            var doc = {
                first_seen: Date.now().toString(),
                country: country,
                currency_abbreviation: currencyAbbreviation,
                currency_symbol: currencySymbol,
                country_code: countryCode,
                verification_code: verificationCode,
                bitcoin_address: bitcoinAddress,
                private_key: encPrivateKey,
                un: un,
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


//-------------------------- GET CHAT -----------------------//

exports.getChat = function (fromEncPhoneNumber, toEncPhoneNumber) {
    return new Promise(function(resolve, reject) {
    // OPEN CONNECTION     
        mongoClient.connect(process.env.MONGO_DB, function (err, db) {
        if (err) {
            reject(err);
            console.log(err);
        } else {
    // SELECT THE COLLECTION
        var collection = db.collection('chat');
    // TODO: I need to get all chats where either...
    // from_phone == fromEncPhoneNumber && to_phone == toEncPhoneNumber || from_phone == toEncPhoneNumber && to_phone == fromEncPhoneNumber 
    // I need them as an array of objects
    // I need to somehow signal who sent them, this can be a second step!
    // The line below is incorrect!
        collection.findOne({from_phone:fromEncPhoneNumber}, function(err, item) {
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


//-------------------------- GET ONE USER -----------------------//

exports.getOneUser = function (encPhoneNumber) {
    return new Promise(function(resolve, reject) {
    // OPEN CONNECTION     
        mongoClient.connect(process.env.MONGO_DB, function (err, db) {
        if (err) {
            reject(err);
            console.log(err);
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
//-------------------------- GET LAST FOUR -----------------------//

exports.getLastFour = function (encPhoneNumber) {
    return new Promise(function(resolve, reject) {
    // OPEN CONNECTION     
        mongoClient.connect(process.env.MONGO_DB, function (err, db) {
        if (err) {
            reject(err);
            console.log(err);
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
            console.log(err);
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
            console.log(err);
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
            console.log(err);
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
            console.log(err);
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
            console.log(err);
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