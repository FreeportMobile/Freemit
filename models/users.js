// Setup Mongoose
var mongoose = require('mongoose');
//  Mongoose Schema that defines the user
var User = new mongoose.Schema({
        name: String,
        phone_number: String,
        un: String,
        bitcoin_address: String,
        private_key: String,
    },
    {timestamps: true});
//console.log(mongoose.connection.readyState);
// Create connection if its not alreayd instantiated as a singleton
if (!mongoose.connection.readyState) {
    mongoose.connect(process.env.MONGO_DB);
}
// Setup module to export the model
var users = mongoose.model('users', User);
module.exports = users;