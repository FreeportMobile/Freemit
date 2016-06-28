'use strict';

var request = require('request');

exports.makeAddress = function(){
    console.log("MAKING ADDRESS");
    return new Promise(function(resolve, reject) {   
        request('http://coinoutlet.biz:4700/newaddress', function (error, response, body) {
            if(error){
                console.log('ERROR'); 
                reject(error);
            }
            if (!error && response.statusCode == 200) {
                var json = JSON.parse(body); 
                console.log(json);
                resolve(json);
            }
        })
    }); //-- END PROMISE
}; // END FUNCTION


exports.getBallence = function(address){
    return new Promise(function(resolve, reject) {   
        request('http://coinoutlet.biz:4700/getbalance?address='+address, function (error, response, body) {
            if(error){
                console.log('ERROR');  
                reject(error); 
            }
            if (!error && response.statusCode == 200) {
            resolve(body);
            }
        })
    }); //-- END PROMISE
}; // END FUNCTION


exports.transferFunds = function(fromAddress, amount, toAddress, privateKey, currency, fromPhone, toPhone){
    return new Promise(function(resolve, reject) { 
        var startDate = new Date();
        var startTime = startDate.getTime();
        console.log(' ------------ START SENDING ------------'); 
        console.log('From Address: '+fromAddress);
        console.log('Amount: '+amount);
        console.log('To Address: '+toAddress);
        console.log('Private Key: '+privateKey);
        console.log('Currency: '+currency);
        console.log('From Phone: '+fromPhone);
        console.log('To Phone: '+toPhone);
        request('http://coinoutlet.biz:4700/sendCurrency?fromAddress='+fromAddress+'&amount='+amount+'&toAddress='+toAddress+'&privateKey='+privateKey+'&currency='+currency+'&fromPhone='+fromPhone+'&toPhone='+toPhone, function (error, response, body) {
        if(error){
            reject(error);  
        }
        if (!error && response.statusCode == 200) {
            var EndDate = new Date();
            var EndTime = EndDate.getTime();
            var FetchTime = EndTime - startTime;
            console.log('Time to fetch: '+ FetchTime);
            console.log(' ------------ END SENDING ------------'); 
            resolve(body);
        }
    })
    }); //-- END PROMISE
}; // END FUNCTION
