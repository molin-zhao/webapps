module.exports = function(io, socketArr, message, data){
  for(var i=0; i<socketArr.length; i++){
    io.sockets.to(socketArr[i].socketId).emit(message, data);
  }
}
