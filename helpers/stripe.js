'use strict';

var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);




exports.paymentIn = function (amount, currency, source, description, metadata, idempotency_key) {
    return new Promise(function(resolve, reject) {
      
        stripe.charges.create({
            amount: amount, // value or amount 400 = 400 CHECK decimal position!
            currency: currency, // usd, gbp
            source: source, // obtained with Stripe.js ?????
            description: description, // string 
            metadata: metadata // JSON FORMATED
        }, {
            idempotency_key: idempotency_key // unique key for each charge gnerate on client
            }, function(err, charge) {
                
                if (err){
                    reject(err);
                } else {
                    resolve(charge);
                }

        }); //-- END CREATE CHARGE
    }); //-- END PROMISE
}; //-- END FUNCTION





exports.paymentOut = function (phoneNumber, verificationCode) {
    return new Promise(function(resolve, reject) {
 
         
    }); //-- END PROMISE
}; //-- END FUNCTION