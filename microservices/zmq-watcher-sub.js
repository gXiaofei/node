// 发布者/订阅者模式

'use strict';
const zmq = require('zeromq');

// 创建一个subscriber节点
const subscriber = zmq.socket('sub');

// 告诉zmq接收所有的消息
subscriber.subscribe('');

subscriber.on('message', data => {
  const message = JSON.parse(data);
  const date = new Date(message.timestamp);
  console.log(`File "${message.file}" changed at ${date}`);
});
// 使用connect建立链接
subscriber.connect("tcp://localhost:60400");