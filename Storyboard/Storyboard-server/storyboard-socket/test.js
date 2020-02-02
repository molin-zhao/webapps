const socketIo = require('socket.io-client');

const socket = socketIo('http://localhost:3030');
socket.on('connect', ()=>{
	console.log('connected');
})
