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
// Setup module to export the model
var chats = mongoose.model('chats', Chat);
module.exports = chats;
Chat.statics.getChat = function (fromEncPhoneNumber, toEncPhoneNumber) {
    return new Promise(function (fulfill, reject) {
        Chat.find({
            fromEncPhoneNumber: {$in: [fromEncPhoneNumber, toEncPhoneNumber]},
            $and: [{toEncPhoneNumber: {$in: [fromEncPhoneNumber, toEncPhoneNumber]}}]
        }, function (err, results) {
            if (err) {
                reject(err);
            }
            else {
                fulfill(results);
            }
        });
    });
}
Chat.statics.setChat = function (fromEncPhoneNumber, toEncPhoneNumber, message) {
    return new Promise(function (fulfill, reject) {
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

