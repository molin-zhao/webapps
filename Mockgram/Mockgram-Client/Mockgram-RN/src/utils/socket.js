import io from 'socket.io-client';

export const createSocket = (url, clientInfo) => {
    const socket = io(url);
    socket.emit('establish-connection', clientInfo);
    socket.on('connect', () => {
        console.log('try to establish connection with server');
    });
    socket.on('establish-connection-failed', err => {
        console.log(err);
        socket.disconnect();
    })
    socket.on('establish-connection-success', socketId => {
        console.log(`success established connection with server with socket ${socketId}`);
    })
    socket.on('disconnect', () => {
        console.log('disconnect from the server');
        socket.disconnect();
    })
    socket.on('logout', () => {
        console.log('logout');
        socket.disconnect();
    });
    return socket;
}