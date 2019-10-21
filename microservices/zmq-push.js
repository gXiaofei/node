'use strict';

const zmq = require('zeromq');

const pusher = zmq.socket('push');

for(let i = 0;i < 100;i++){
  pusher.send(JSON.stringify({
    details: `Dateils about job ${i}`
  }))
}

pusher.bind("tcp://localhost:60401", err => {
  console.log('Listening for zmq requesters...');
});