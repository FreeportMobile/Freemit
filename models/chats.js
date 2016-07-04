// Setup Mongoose
var mongoose = require('mongoose');
//  Mongoose Schema that defines the user
var Chat = new mongoose.Schema({
        fromEncPhoneNumber: String,
        toEncPhoneNumber: String,
        message: String
    },
    {timestamps: true});
//console.log(mongoose.connection.readyState);
// Create connection if its not alreayd instantiated as a singleton
if (!mongoose.connection.readyState) {
    mongoose.connect(process.env.MONGO_DB);
}


//--- GET CHATS

Chat.statics.getChat = function (fromEncPhoneNumber, toEncPhoneNumber) {
    return new Promise(function (fulfill, reject) {
        var joinedResults = [];
        console.log(joinedResults);

        chats.find({
            fromEncPhoneNumber: fromEncPhoneNumber,
            toEncPhoneNumber:  toEncPhoneNumber
        }, function (err, results) {
            if (err) {
                reject(err);
            }
            else {
                for (i in results){
                joinedResults.push(results[i]);
                }
                console.log(joinedResults);
                chats.find({
                    fromEncPhoneNumber: toEncPhoneNumber,
                    toEncPhoneNumber:  fromEncPhoneNumber
                }, function (err, results2) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        for (q in results2)
                        {
                            joinedResults.push(results2[q]);  // Push results into original
                        }
                        console.log(joinedResults);
                        fulfill(joinedResults);
                    }
                });
            }
        });
    });
}

//--- SET CHATS 

Chat.statics.setChat = function (fromEncPhoneNumber, toEncPhoneNumber, message) {
    return new Promise(function (fulfill, reject) {
        console.log(fromEncPhoneNumber);
        console.log(toEncPhoneNumber);
        console.log(message);
        var chatSave = new chats();
        chatSave.fromEncPhoneNumber = fromEncPhoneNumber;
        chatSave.toEncPhoneNumber = toEncPhoneNumber;
        chatSave.message = message;
        chatSave.save(function (err, results) {
            if (err) {
                reject(err);
            }
            else {
                fulfill(results);
            }
        });
    });
}

// Setup module to export the model
var chats = mongoose.model('chats', Chat);
module.exports = chats;