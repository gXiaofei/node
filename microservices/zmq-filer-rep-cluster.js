'use strict';
const cluster = require('cluster');
const fs = require('fs');
const zmq = require('zeromq');

// 获取cpu数量
const numWorkers = require('os').cpus().length;

// 判断是不是主进程
if(cluster.isMaster){
  console.log('numWorkers', numWorkers);
  // master process creates ROUTER and DEALER sockets and binds endpoints
  // ROUTER监听60401端口 准备tcp链接
  const router = zmq.socket('router').bind('tcp://127.0.0.1:60401');
  // DEALER绑定到进程间的通信（IPC）节点
  const dealer = zmq.socket('dealer').bind('ipc://filer-dealer.ipc');

  //Forward message between the router and dealer.
  router.on('message', (...frames) => dealer.send(frames));
  dealer.on('message', (...frames) => router.send(frames));

  // Listen for workers to come online
  cluster.on('online', worker => {
    console.log(`Worker ${worker.process.pid} is online.`);
  })

  // Fork a worker process for each CPU
  for(let i = 0;i < numWorkers;i++){
    cluster.fork();
  }
}else{
  // Worker processes create a REP socket and connect to the DEALER
  const responder = zmq.socket('rep').connect('ipc://filer-dealer.ipc');
  responder.on('message', data => {
    // Parse incoming message
    const request = JSON.parse(data);
    console.log(`${process.pid} received request for: ${request.path}`);

    fs.readFile(request.path, (err, content) => {
      console.log(`${process.pid} sending response`);
      responder.send(JSON.stringify({
        content: content.toString(),
        timestamp: Date.now(),
        pid: process.pid
      }))
    })
  })
}