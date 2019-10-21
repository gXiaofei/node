const net = require('net');
// net.createServer 返回一个socket对象
const server = net.createServer(connection => {
  console.log('connection success');
});

server.listen(60300);
