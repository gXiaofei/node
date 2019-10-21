// 服务发送的信息数据可能存在多段的
// 如果客户端不做处理， 会报错
'use strict';

const server = require('net').createServer(c => {
  console.log('Subscriber connected.');

  // 模拟将数据分成多段发送
  // 把数据分成两段发送
  const firstChunk = '{"type": "changed", "timesta';
  const secondChunk = 'mp": 14555555}\n';

  // 先发送第一段
  c.write(firstChunk);

  const timeout = setTimeout(() => {
    // 发送第二段
    c.write(secondChunk);
    c.end();
  }, 100);

  c.on('end', () => {
    clearTimeout(timeout);
    console.log(`Subscriber, disconnected.`);
  })
}).listen(60300, () => console.log('Test server listening for subscribers....'));

