'use strict';

//--- ADD BANK
exports.add = function (socket, io, msg) {
    console.log('Add Bank');
    io.to(socket.id).emit('addbank', {msg: 200});
};


