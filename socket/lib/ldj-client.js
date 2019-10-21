// 用来处理接收到的数据，并把数据合并成有效的消息
// 继承 EventEmitter类

const EventEmiiter = require('events').EventEmitter;

// 实现一个LDJ缓存模块来解决JSON分块消息的问题
// LDJClient是一个类， 所以可以通过new LDJClient(stream)得到它的实例
class LDJClient extends EventEmiiter{
  constructor(stream){
    // 构造函数通过super()调用父类EventEmitter的构造函数
    super(stream);
    // 用buffer来存储数据
    let buffer = '';
    stream.on('data', (data) => {
      buffer += data;
      let boundary = buffer.indexOf('\n');
      // 从前往后找消息结束符
      while(boundary !== -1){
        const input = buffer.substring(0, boundary)
        buffer = buffer.substring(boundary + 1);
        try{
          // input 可能不是JSON格式数据
          // 利用this.emit发送消息出去
          this.emit('message', JSON.parse(input));
        }catch(e){
          this.emit('message', `${input}不是JSON格式`);
        }
        boundary = buffer.indexOf('\n');
      }
    });
    // stream.on('close', () => {
    //   try{
    //     // input 可能不是JSON格式数据
    //     // 利用this.emit发送消息出去
    //     this.emit('message', JSON.parse(buffer));
    //   }catch(e){
    //     this.emit('message', `${buffer}不是JSON格式`);
    //   }
    // })
  }

  static connect(stream) {
    return new LDJClient(stream);
  }
}

module.exports = LDJClient;