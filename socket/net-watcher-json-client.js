// 客户端
'use strict';

const net = require('net');
// client 为socket对象
const client = net.connect({port: 60300});

client.on('data', data => {
  // 接收一个buffer对象data
  const message = JSON.parse(data);
  if (message.type === 'watching'){
    console.log(`Now watching: ${message.file}`);
  } else if (message.type === 'changed'){
    const date = new Date(message.timestamp);
    console.log(`File changed: ${date}`);
  } else {
    console.log(`Unrecognized message type: ${message.type}s`);
  }
});

client.on('end', () => {
  console.log('Connenction end');
});

client.on('error', (err) => {
  throw Error(`Error: ${err}`);
})