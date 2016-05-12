'use strict';

var bitcoin = require('bitcoinjs-lib');

//---NEW BITCOIN ADDRESS
exports.makeAddress = function () {
     return new Promise(function(resolve, reject) {
         
        var publicKey = bitcoin.ECKey.makeRandom();
        var bitcoinAddress = publicKey.pub.getAddress().toString();
        var privateKey = publicKey.toWIF();
        var keySet = {bitcoinAddress:bitcoinAddress, privateKey:privateKey};
              
        if(publicKey && bitcoinAddress && privateKey){
            resolve(keySet);
        }else{
            reject('Error');
        };
        
}); //-- END PROMISE
};// END FUNCTION



