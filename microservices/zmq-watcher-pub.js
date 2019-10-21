// 发布者/订阅者模式   PUB/SUB

'use strict';
const fs = require('fs');
const zmq = require('zeromq');
const filename = process.argv[2];

// 创建一个消息发布节点
const publisher = zmq.socket('pub');

fs.watch(filename, () => {
    // 当文件有变化 调用发布者的send()方法，这个消息会发送给所有的订阅者
    publisher.send(JSON.stringify({
      type: 'changed',
      file: filename,
      timestamp: Date.now()
    }))
});

// Listen on TCP port 60400
publisher.bind('tcp://*:60400', err => {
  if(err) throw err;
  console.log('Listening for zmq subscribers...');
});

// 虽然这个服务也是基于TCP协议的，但zmq服务需要匹配zmq客户端，不能简单的使用nc建立连接