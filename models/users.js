var mongoose = require('mongoose');
var User = new mongoose.Schema({
        name: String,
        phone_number: String,
        un: String,
        bitcoin_address: String,
        private_key: String,
    },
    {timestamps: true });
//console.log(mongoose.connection.readyState);

if (!mongoose.connection.readyState) {
    mongoose.connect(process.env.MONGO_DB);
}
var users = mongoose.model('users', User);
module.exports = users;