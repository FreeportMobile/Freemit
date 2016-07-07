// Setup Mongoose
var mongoose = require('mongoose');
//  Mongoose Schema that defines the user
var Chat = new mongoose.Schema({
        fromEncPhoneNumber: String,
        toEncPhoneNumber: String,
        message: String,
        time: Number,
        type: String
    },
    {timestamps: false});
if (!mongoose.connection.readyState) {
    mongoose.connect(process.env.MONGO_DB);
}


//--- GET CHATS

Chat.statics.getChat = function (fromEncPhoneNumber, toEncPhoneNumber) {
    return new Promise(function (fulfill, reject) {
        var joinedResults = [];
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
                        fulfill(joinedResults);
                    }
                });
            }
        });
    });
}

//--- SET CHATS 

Chat.statics.setChat = function (fromEncPhoneNumber, toEncPhoneNumber, message, messageType) {
    return new Promise(function (fulfill, reject) {

        var chatSave = new chats();
        chatSave.fromEncPhoneNumber = fromEncPhoneNumber;
        chatSave.toEncPhoneNumber = toEncPhoneNumber;
        chatSave.message = message;
        var insertDate = new Date();
        var epoch = insertDate.getTime();
        chatSave.time = epoch;
        chatSave.type = messageType;
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