// 请求/响应模式

// 创建一个REQ socket

// 请求/响应模式 有个特点，其中的节点每次只处理一件事情，没有并行处理能力
'use strict';
const zmq = require('zeromq');
const filename = process.argv[2];

const requester = zmq.socket('req');

requester.on('message', data => {
  const response = JSON.parse(data);
  console.log('Received, response: ', response);
});

requester.connect('tcp://localhost:60401');

console.log(`Sending a request for ${filename}`);
for(let i = 0;i < 10;i++){
  requester.send(JSON.stringify({path: filename}));
}
