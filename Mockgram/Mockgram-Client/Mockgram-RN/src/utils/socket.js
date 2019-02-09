import io from 'socket.io-client';

export const createSocket = async (url, clientInfo) => {
    const socket = io(url);
    await socket.emit('establish-connection', clientInfo);
    socket.on('connect', () => {
        console.log('try to establish connection with server');
    });
    socket.on('establish-connection-failed', (err) => {
        console.log(err);
        socket.disconnect();
    })
    socket.on('establish-connection-success', () => {
        console.log('success established connection with server');
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