var request = require('request');

function makeAddress(){
    return new Promise(function(resolve, reject) {   
        request('http://coinoutlet.biz:4700/newaddress', function (error, response, body) {
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

function getBallence(address){
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

function transferFunds(fromAddress, amount, toAddress, privateKey, currency){
    return new Promise(function(resolve, reject) {   
    request('http://coinoutlet.biz:4700/sendCurrency?fromAddress='+fromAddress+'&amount='+amount+'&toAddress='+toAddress+'&privateKey='+privateKey+'&currency='+currency+'&fromPhone='+fromPhone+'&toPhone='+toPhone, function (error, response, body) {
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

var fromAddress = '1NVXG5252Lq44QYwokZVjhKVg2K1aZ9fcb&'
var privateKey = '263da4c2186abcfd6b429258842c1224d0c6a354e780212fcc78aca4efcf85aa'
var amount = '100'
var currency = 'USD'
var fromPhone = '4083297423'
var toPhone = '4083297423'

makeAddress()
    .then(function(data){
        var data = JSON.parse(data);
        console.log('----------------------');
        console.log('----- SENDING TO -----');
        console.log('Bitcoin Address: '+data.publicAddress);
        console.log('privateKey: '+data.privateKey);
        var toAddress = data.publicAddress;
        console.log('----- SENDING FROM -----');
        console.log('From Address: '+fromAddress);
        console.log('Private Key: '+privateKey);
        console.log('Amount: '+amount);
        console.log('To Address: '+toAddress);
        console.log('Currency: '+currency);
            transferFunds(fromAddress, amount, toAddress, privateKey, currency)
            .then(function(data){
                var data = JSON.parse(data);
                console.log('----- TRANSACTION -----');
                console.log('multisigOutputs: '+data.multisigOutputs);
                console.log('coloredOutputIndexes: '+data.coloredOutputIndexes);
                console.log('financeTxid: '+data.financeTxid);
                console.log('txid: '+data.txid);
                    getBallence(toAddress)
                    .then(function(data){
                        var data = JSON.parse(data);
                        console.log('----- ACCOUNT BALLANCE -----');
                        console.log('USD: '+data[0].Total);
                        console.log('INR: '+data[1].Total);
                        console.log('----- TEST RESULT -----');
                        if(data[0].Total > 0 || data[1].Total > 0){
                            console.log('PASSED');
                            console.log('-----------------------');
                        }
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            })
            .catch(function(err) {
                console.log(err);
            });
    })        
    .catch(function(err) {
        console.log(err);
    })





// http://coinoutlet.biz:4700/sendCurrency?
// fromAddress=1NVXG5252Lq44QYwokZVjhKVg2K1aZ9fcb&
// amount=51&
// toAddress=1DKiv8Zy3wvEJabbZq5rmwnkeLvekiEUSC&
// privateKey=263da4c2186abcfd6b429258842c1224d0c6a354e780212fcc78aca4efcf85aa&
// currency=INR

// http://coinoutlet.biz:4700/sendCurrency?
// fromAddress=16WBguy6KVyTGnF4KX7Vmdx8ztj4wENh4W&
// amount=10&
// toAddress=1FkWUmKfxo6dSr3mLXU494dHaZkFFUtMMA&
// privateKey=KwFmrKDWXT6oNKQ9QosHTU3Vpp6EPT9ExVbq7n8Rq613ARsSr8vs&
// currency=INR

