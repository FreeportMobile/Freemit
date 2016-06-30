'use strict';

//-- MAKE STRIPE AVAILABLE
var colu = require('../helpers/colu.js');
//-- MAKE MONGO
var mongo = require('../helpers/mongo.js');
var crypto = require('../helpers/crypto.js');

//------------------------- TRANSFER TO WALLET-------------------------
exports.toWallet = function (fromPhone, toPhone, currency, amount) {
    return new Promise(function(resolve, reject) {
        var encFromPhone = fromPhone;
        var toAddress =  process.env.BITCOIN_ADDRESS;   
        var encPhoneNumber = fromPhone;
        mongo.getOneUser(encPhoneNumber)
            .then(function(data) {
                var fromAddress = data.bitcoin_address;
                var privateKey = crypto.decrypt(data.private_key);
                var fromPhone = crypto.decrypt(encFromPhone);
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
    console.log(fromPhone);
    console.log(toPhone);
    console.log(currency);
    console.log(amount);
    return new Promise(function(resolve, reject) {
        var encFromPhone = fromPhone;
        var fromAddress = process.env.BITCOIN_ADDRESS;
        var privateKey =  process.env.BITCOIN_ADDRESS_KEY;
        var encPhoneNumber = crypto.encrypt(toPhone);
            mongo.getOneUser(encPhoneNumber)
            .then(function(data) {
                var toAddress = data.bitcoin_address;
                var fromPhone = crypto.decrypt(encFromPhone);
                   console.log('--4--');
                    colu.transferFunds(fromAddress, amount, toAddress, privateKey, currency, fromPhone, toPhone)
                    .then(function(data) { 
                           console.log('--5--');  
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


