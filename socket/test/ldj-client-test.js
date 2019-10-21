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
      assert.deepEqual(message, {foo: 'bar'});
      done();
    });
    stream.emit('data', '{"foo": "bar"}\n');
  })
})