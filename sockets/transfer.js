'use strict';

//-- MAKE STRIPE AVAILABLE
var colu = require('../helpers/colu.js');
//-- MAKE MONGO
var mongo = require('../helpers/mongo.js');
var crypto = require('../helpers/crypto.js');

//------------------------- TRANSFER TO WALLET-------------------------
exports.toWallet = function (fromPhone, toPhone, currency, amount) {
    return new Promise(function(resolve, reject) {
        console.log('---------------');
        console.log('From Phone: '+ fromPhone);
        var toAddress =  process.env.BITCOIN_ADDRESS;   
        var encPhoneNumber = fromPhone;
        mongo.getOneUser(encPhoneNumber)
            .then(function(data) {
                var fromAddress = data.bitcoin_address;
                var privateKey = crypto.decrypt(data.private_key);
                //var fromPhone = crypto.decrypt(fromPhone);
                colu.transferFunds(fromAddress, amount, toAddress, privateKey, currency, fromPhone, toPhone)
                .then(function(data) {   
                resolve(data);     
                })
                .catch(function(err) {
                console.log(err);
                reject(err);
                })
            })
            .catch(function(err) {
            console.log(err);
            reject(err);
            })
    }); //-- END PROMISE
};// END FUNCTION


//------------------------- TRANSFER FROM WALLET-------------------------
exports.fromWallet = function (fromPhone, toPhone, currency, amount) {
    return new Promise(function(resolve, reject) {
        
        console.log('---------------');
        console.log('From Phone: '+ fromPhone);
        var fromAddress = process.env.BITCOIN_ADDRESS;
        var privateKey =  process.env.BITCOIN_ADDRESS_KEY;
        var encPhoneNumber = crypto.encrypt(toPhone);
            mongo.getOneUser(encPhoneNumber)
            .then(function(data) {
                var toAddress = data.bitcoin_address;
                console.log('---------------');
                console.log('From Phone:'+fromPhone);
                var fromPhone = crypto.decrypt(fromPhone);
                console.log('From Phone Decrypted:'+fromPhone);
                console.log('---------------');
                    colu.transferFunds(fromAddress, amount, toAddress, privateKey, currency, fromPhone, toPhone)
                    .then(function(data) {   
                        resolve(data);     
                    })
                    .catch(function(err) {
                        console.log(err);
                        reject(err);
                    })
            }) 
            .catch(function(err) {   
                console.log(data);
                reject(err);
            })
    }); //-- END PROMISE
};// END FUNCTION


