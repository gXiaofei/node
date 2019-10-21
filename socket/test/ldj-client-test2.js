'use strict';
const assert = require('assert');
const EventEmitter = require('events').EventEmitter;
const LDJClient = require('../lib/ldj-client');

// 利用mocha中的describe()方法创建一个测试LDJClient的上下文环境
describe('LDJClient', () => {
  let stream = null;
  let client = null;

  beforeEach(() => {
    stream = new EventEmitter();
    client = new LDJClient(stream);
  })

  it('should emit a message event form a single data event', done => {
    client.on('message', message=> {
      console.log(message);
      assert.deepEqual(message, {foo: 'bar'});
      done();
    });
    // 测试数据分成多份
    stream.emit('data', '{"foo":');
    // process.nextTick能够让回调函数里的代码在当前代码执行结束后立即执行
    process.nextTick(() => {
      stream.emit('data', '"bar"}\n')
      // stream.emit('close');
    });
  }).timeout(5000);// 可以设置超时时间
})