'use strict';

const fs = require('fs');
const net = require('net');
// 监听的文件名
const filename = process.argv[2];

if(!filename){
  throw Error('Error: No filename specifed.');
}

net.createServer(connection => {
  // Reporting
  console.log('Subscriber connected.');
  // 通过connecting.write发送给客户端
  connection.write(`Now watching "${filename}" for changes...\n`);

  // watcher setup
  const watcher = fs.watch(filename, () => connection.write(`File changed: ${new Date()}\n`));

  connection.on('close', () => {
    console.log('Subscriber disconnected.');
    watcher.close();
  })
}).listen(60300, () => console.log('Listening for subscribers....'));