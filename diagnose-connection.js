// 诊断连接问题
const fs = require('fs');
const path = require('path');

console.log('🔍 开始诊断连接问题...\n');

// 1. 检查服务器是否运行
function checkServerStatus() {
  return new Promise((resolve) => {
    const http = require('http');
    
    const req = http.request({
      hostname: 'localhost',
      port: 2567,
      path: '/health',
      method: 'GET',
      timeout: 3000
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log('✅ 服务器健康检查通过');
        console.log(`   响应状态: ${res.statusCode}`);
        console.log(`   响应内容: ${data}`);
        resolve(true);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ 服务器健康检查失败');
      console.log(`   错误: ${err.message}`);
      resolve(false);
    });
    
    req.on('timeout', () => {
      console.log('❌ 服务器健康检查超时');
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
}

// 2. 检查端口是否被占用
function checkPortInUse() {
  const { exec } = require('child_process');
  
  return new Promise((resolve) => {
    exec('netstat -an | findstr 2567', (error, stdout) => {
      if (stdout.includes('LISTENING')) {
        console.log('✅ 端口2567正在监听连接');
        resolve(true);
      } else {
        console.log('❌ 端口2567未被监听');
        resolve(false);
      }
    });
  });
}

// 3. 检查必要的文件是否存在
function checkProjectFiles() {
  console.log('\n📁 检查项目文件结构:');
  
  const files = [
    'server/dist/index.js',
    'server/dist/rooms/CabinRoom.js',
    'server/dist/schema/GameSchemas.js',
    'client/dist/index.html'
  ];
  
  files.forEach(file => {
    if (fs.existsSync(path.join(__dirname, file))) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} - 文件不存在`);
    }
  });
}

// 4. 检查浏览器控制台错误的建议
function showBrowserDebugTips() {
  console.log('\n🌐 浏览器调试建议:');
  console.log('1. 打开浏览器开发者工具 (F12)');
  console.log('2. 转到 Console 标签页');
  console.log('3. 访问 http://localhost:5173/');
  console.log('4. 查看控制台输出的错误信息');
  console.log('5. 尝试访问 http://localhost:5173/debug-connection.html');
}

// 5. 建议的解决方案
function showSolutions() {
  console.log('\n🔧 常见连接问题解决方案:');
  console.log('1. 确保服务器正在运行 (启动服务器: cd server && npm start)');
  console.log('2. 确保客户端开发服务器正在运行 (启动客户端: cd client && npm run dev)');
  console.log('3. 检查防火墙是否阻止了localhost连接');
  console.log('4. 尝试清除浏览器缓存并刷新页面');
  console.log('5. 在浏览器中禁用广告拦截器');
}

// 运行所有诊断
async function runDiagnosis() {
  const serverRunning = await checkServerStatus();
  const portInUse = await checkPortInUse();
  checkProjectFiles();
  showBrowserDebugTips();
  showSolutions();
  
  console.log('\n📋 诊断总结:');
  if (serverRunning && portInUse) {
    console.log('✅ 服务器配置正常，问题可能在客户端');
    console.log('   请检查浏览器控制台错误信息');
  } else {
    console.log('❌ 服务器配置有问题，请检查服务器日志');
  }
}

runDiagnosis();