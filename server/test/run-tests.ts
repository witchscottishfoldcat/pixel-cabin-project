/**
 * 测试运行器
 * 
 * 这个文件运行所有测试，验证我们的Schema和Room实现是否正确工作
 */

import { runAllTests as runSchemaTests } from "./schemas.test";
import { runAllTests as runRoomTests } from "./room.test";

console.log("========================================");
console.log("像素小屋项目 - 数据结构测试套件");
console.log("========================================");

async function runAllTests() {
  console.log("开始运行所有测试...\n");
  
  try {
    // 运行Schema测试
    console.log("📋 第一部分: Schema测试");
    runSchemaTests();
    
    console.log("\n" + "=".repeat(40) + "\n");
    
    // 运行Room测试
    console.log("📋 第二部分: Room功能测试");
    runRoomTests();
    
    console.log("\n========================================");
    console.log("🎉 所有测试通过! 数据结构设计正确，可以投入使用。");
    console.log("========================================\n");
    
    console.log("下一步建议:");
    console.log("1. 实现边界检查和验证逻辑");
    console.log("2. 添加更多游戏功能扩展");
    console.log("3. 实现客户端渲染逻辑");
    console.log("4. 进行端到端测试");
    
  } catch (error) {
    console.error("\n========================================");
    console.error("❌ 测试失败:", error);
    console.error("========================================\n");
    
    process.exit(1);
  }
}

// 运行测试
runAllTests();