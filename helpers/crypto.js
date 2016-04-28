'use strict';

var CryptoJS = require("crypto-js");
var uuid = require('uuid-js');

//----------------------------- MAKE UUID
exports.makeID = function () {
    return uuid.create().toString();
};

//----------------------------- ENCRYPT
exports.encrypt = function (text) {
    return CryptoJS.AES.encrypt(text, process.env.AUTH_SECRET);
};

//----------------------------- DECRYPT
exports.decrypt = function (text) {
    var bytes  = CryptoJS.AES.decrypt(text.toString(), process.env.AUTH_SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
};


