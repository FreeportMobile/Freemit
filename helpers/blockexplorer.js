'use strict';

var request = require('request');
// https://github.com/blockchain/api-v1-client-node/tree/master/blockexplorer

//------------------------- NEW BITCOIN ADDRESS -------------------------
exports.getAddress = function (address) {
    return new Promise(function(resolve, reject) {   
        var URL = 'https://blockchain.info/address/'+address+'?format=json';
        request(URL, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            resolve(body);
        } else{
            reject(error);
        };
        })
    }); //-- END PROMISE
};// END FUNCTION


//------------------------- UNSPENT OUTPUTS -------------------------
exports.getUnspentOutputs = function (address) {
    return new Promise(function(resolve, reject) {   
        var URL = 'https://blockchain.info/unspent?active='+address;
        request(URL, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            resolve(body);
        } else{
            reject(error);
        };
        })
    }); //-- END PROMISE
};// END FUNCTION

