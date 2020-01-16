const io = require("socket.io-client");
const process = require("process");

const socket = io("http://localhost:3000");
socket.on("connect", () => {
    console.log(`socket connected`);
});   

console.log('test finished');
setTimeout(()=>{
    process.exit()
}, 10*1000)






