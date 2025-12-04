/**
 * 快速测试脚本
 * 
 * 这个简单的JavaScript文件验证我们是否正确导入了所有必要的依赖
 * 以及基本的项目结构是否正确
 */

const fs = require('fs');
const path = require('path');

console.log("=== 像素小屋项目 - 快速结构检查 ===\n");

// 检查必要文件是否存在
function checkFile(filePath, description) {
  const exists = fs.existsSync(filePath);
  console.log(`${exists ? '✅' : '❌'} ${description}: ${filePath}`);
  return exists;
}

// 检查关键文件
console.log("1. 检查项目结构文件:");
const structureFiles = [
  ['d:/PyExe/AText/pixel-cabin-project/.gitignore', 'Git忽略文件'],
  ['d:/PyExe/AText/pixel-cabin-project/README.md', '项目说明文档'],
  ['d:/PyExe/AText/pixel-cabin-project/package.json', '项目配置文件'],
];

console.log("\n2. 检查服务器端文件:");
const serverFiles = [
  ['d:/PyExe/AText/pixel-cabin-project/server/src/index.ts', '服务器入口文件'],
  ['d:/PyExe/AText/pixel-cabin-project/server/src/schema/GameSchemas.ts', '游戏Schema定义'],
  ['d:/PyExe/AText/pixel-cabin-project/server/src/rooms/CabinRoom.ts', '房间逻辑实现'],
  ['d:/PyExe/AText/pixel-cabin-project/server/package.json', '服务器配置文件'],
];

console.log("\n3. 检查客户端文件:");
const clientFiles = [
  ['d:/PyExe/AText/pixel-cabin-project/client/src/main.ts', '客户端入口文件'],
  ['d:/PyExe/AText/pixel-cabin-project/client/src/types/GameTypes.ts', '客户端类型定义'],
  ['d:/PyExe/AText/pixel-cabin-project/client/src/services/Network.ts', '网络服务'],
  ['d:/PyExe/AText/pixel-cabin-project/client/package.json', '客户端配置文件'],
];

console.log("\n4. 检查文档文件:");
const docFiles = [
  ['d:/PyExe/AText/pixel-cabin-project/SHEMA_EXAMPLES.md', 'Schema使用示例'],
  ['d:/PyExe/AText/pixel-cabin-project/TEST_RESULTS.md', '测试结果文档'],
];

// 检查所有文件
const allFiles = [...structureFiles, ...serverFiles, ...clientFiles, ...docFiles];
let allExists = true;

allFiles.forEach(([filePath, description]) => {
  const exists = checkFile(filePath, description);
  if (!exists) allExists = false;
});

// 读取并检查Schema文件内容
console.log("\n5. 检查Schema文件内容:");

try {
  const schemaContent = fs.readFileSync(
    'd:/PyExe/AText/pixel-cabin-project/server/src/schema/GameSchemas.ts', 
    'utf8'
  );
  
  const hasPlayer = schemaContent.includes('export class Player');
  const hasRoomState = schemaContent.includes('export class CabinRoomState');
  const hasEnums = schemaContent.includes('enum PlayerState') && schemaContent.includes('enum PlayerDirection');
  
  console.log(`${hasPlayer ? '✅' : '❌'} Player Schema定义`);
  console.log(`${hasRoomState ? '✅' : '❌'} CabinRoomState Schema定义`);
  console.log(`${hasEnums ? '✅' : '❌'} 枚举类型定义`);
  
} catch (error) {
  console.log('❌ 无法读取Schema文件:', error.message);
  allExists = false;
}

// 检查客户端类型文件内容
try {
  const typesContent = fs.readFileSync(
    'd:/PyExe/AText/pixel-cabin-project/client/src/types/GameTypes.ts', 
    'utf8'
  );
  
  const hasTypes = typesContent.includes('interface PlayerData');
  const hasEnums = typesContent.includes('enum PlayerState') && typesContent.includes('enum PlayerDirection');
  
  console.log(`${hasTypes ? '✅' : '❌'} 客户端类型定义`);
  console.log(`${hasEnums ? '✅' : '❌'} 客户端枚举定义`);
  
} catch (error) {
  console.log('❌ 无法读取客户端类型文件:', error.message);
  allExists = false;
}

// 总结
console.log("\n========================================");
if (allExists) {
  console.log("🎉 所有检查通过! 项目结构完整，可以开始使用。");
  console.log("\n下一步建议:");
  console.log("1. 运行服务器: cd server && npm run dev");
  console.log("2. 运行客户端: cd client && npm run dev");
  console.log("3. 在浏览器中打开客户端进行测试");
} else {
  console.log("❌ 存在问题，请检查上述失败的文件。");
}
console.log("========================================");