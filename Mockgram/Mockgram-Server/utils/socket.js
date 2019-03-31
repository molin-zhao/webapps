module.exports.pushSocketToLocalStorage = (userId, socket, userSockets) => {
    let socketId = socket.id;
    userSockets.userIdToSocketId[userId] = socketId;
    userSockets.socketIdToUserId[socketId] = userId;
    userSockets.socketIdToSocket[socketId] = socket;
    console.log(`------------------------- saving socket -------------------------`)
    console.log(`pushed userId:${userId}-socketId:${socketId} to local storage`);
    console.log(`-------------------------- end  saving --------------------------`)
}

module.exports.popSocketToLocalStorage = (socket, userSockets) => {
    let socketId = socket.id;
    let userId = userSockets.socketIdToUserId[socketId];
    delete userSockets.socketIdToSocket[socketId];
    delete userSockets.socketIdToUserId[socketId];
    delete userSockets.userIdToSocketId[userId];
    console.log(`************************ deleting socket ************************`)
    console.log(`popped userId:${userId}-socketId:${socketId} out of local storage`);
    console.log(`************************* end  deleting *************************`)
}