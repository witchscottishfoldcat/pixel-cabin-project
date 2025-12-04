const WebSocket = require('ws');

console.log('🔗 正在连接到像素小屋服务器...');

const ws = new WebSocket('ws://localhost:2567');

ws.on('open', function open() {
  console.log('✅ 连接成功！');
  
  // 发送一个测试消息
  ws.send(JSON.stringify({
    type: 'join_room',
    data: {
      roomName: 'cabin_room',
      options: {
        name: '测试玩家'
      }
    }
  }));
  
  // 5秒后关闭连接
  setTimeout(() => {
    console.log('🔌 关闭连接...');
    ws.close();
  }, 5000);
});

ws.on('message', function message(data) {
  console.log('📨 收到消息:', data.toString());
});

ws.on('close', function close() {
  console.log('❌ 连接已关闭');
});

ws.on('error', function error(err) {
  console.error('❌ 连接错误:', err.message);
});