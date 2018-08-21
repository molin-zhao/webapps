var os = require('os');
var IPv4;

for(var i=0;i<os.networkInterfaces().en0.length;i++){
  if(os.networkInterfaces().en0[i].family=='IPv4'){
    IPv4=os.networkInterfaces().en0[i].address;
  }
}
console.log(IPv4);
module.exports = IPv4;
