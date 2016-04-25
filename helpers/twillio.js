'use strict';

//--- SMS CODE
exports.sendSMS = function (phoneNumber, message) {

 return new Promise(function(resolve, reject) {
	
	// SEND SMS VIA TWILLIO
    console.log(phoneNumber);
    console.log(message);
    
      someTwillioFunction({
          
          // TODO: link this up to twillio


        }, function (error, data) {
            if (error){
                reject(error);
            } else {
                resolve(data);
            }
        });


}); //-- END PROMISE
}; //-- END FUNCTION




