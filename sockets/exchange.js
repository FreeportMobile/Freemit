'use strict';

//--- ADD EXCHANGE
exports.add = function (socket, io, msg) {
    console.log('Add Exchange');
    io.to(socket.id).emit('addexchange', {msg: 200});
};