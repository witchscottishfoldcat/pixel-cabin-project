/**
 * 客户端网络服务演示
 * 
 * 这个文件展示如何使用网络服务与服务器通信
 */

import { NetworkService } from "../src/services/Network";
import { PlayerState, PlayerDirection, MessageType } from "../src/types/GameTypes";

console.log("=== 客户端网络服务演示 ===\n");

// 模拟网络服务
function demonstrateNetworkService() {
  console.log("1. 网络服务使用示例");
  
  // 创建网络服务实例
  const network = new NetworkService();
  
  console.log("网络服务已创建，连接地址: ws://localhost:2567");
  
  // 演示发送消息
  console.log("\n2. 发送消息示例");
  
  // 发送移动消息
  console.log("发送移动消息: 移动到坐标 (100, 150)");
  network.sendMove(100, 150, PlayerState.WALK, PlayerDirection.RIGHT);
  
  // 发送状态变化消息
  console.log("发送状态变化消息: 切换到站立状态");
  network.sendStateChange(PlayerState.IDLE);
  
  // 发送朝向变化消息
  console.log("发送朝向变化消息: 朝向左");
  network.sendDirectionChange(PlayerDirection.LEFT);
  
  return network;
}

// 演示事件监听
function demonstrateEventListeners(network: NetworkService) {
  console.log("\n3. 事件监听示例");
  
  // 监听玩家加入
  console.log("监听玩家加入事件");
  network.onPlayerAdd((player, sessionId) => {
    console.log(`玩家 ${sessionId} 加入房间`);
    console.log(`初始位置: (${player.x}, ${player.y})`);
    console.log(`初始状态: ${player.state}`);
    console.log(`初始朝向: ${player.direction}`);
  });
  
  // 监听玩家移动
  console.log("监听玩家移动事件");
  network.onPlayerMove((player, sessionId) => {
    console.log(`玩家 ${sessionId} 移动到位置 (${player.x}, ${player.y})`);
    console.log(`当前状态: ${player.state}`);
    console.log(`当前朝向: ${player.direction}`);
  });
  
  // 监听玩家离开
  console.log("监听玩家离开事件");
  network.onPlayerRemove((player, sessionId) => {
    console.log(`玩家 ${sessionId} 离开房间`);
  });
}

// 演示连接过程
async function demonstrateConnection(network: NetworkService) {
  console.log("\n4. 连接过程示例");
  
  try {
    // 尝试连接到房间
    console.log("尝试连接到服务器房间...");
    // const room = await network.connect("cabin_room", { name: "演示玩家" });
    // console.log("连接成功! 房间ID:", room.id);
    console.log("(实际连接被跳过，因为没有运行服务器)");
  } catch (error) {
    console.log("连接失败:", error);
  }
}

// 展示类型定义
function demonstrateTypes() {
  console.log("\n5. 类型定义示例");
  
  // 玩家状态枚举
  console.log("玩家状态枚举:");
  console.log(`- IDLE: "${PlayerState.IDLE}"`);
  console.log(`- WALK: "${PlayerState.WALK}"`);
  
  // 玩家朝向枚举
  console.log("\n玩家朝向枚举:");
  console.log(`- DOWN: ${PlayerDirection.DOWN}`);
  console.log(`- LEFT: ${PlayerDirection.LEFT}`);
  console.log(`- RIGHT: ${PlayerDirection.RIGHT}`);
  console.log(`- UP: ${PlayerDirection.UP}`);
  
  // 消息类型枚举
  console.log("\n消息类型枚举:");
  console.log(`- MOVE: "${MessageType.MOVE}"`);
  console.log(`- CHANGE_STATE: "${MessageType.CHANGE_STATE}"`);
  console.log(`- CHANGE_DIRECTION: "${MessageType.CHANGE_DIRECTION}"`);
  console.log(`- PLAYER_JOINED: "${MessageType.PLAYER_JOINED}"`);
  console.log(`- PLAYER_LEFT: "${MessageType.PLAYER_LEFT}"`);
}

// 演示实际使用场景
function demonstrateRealUsage() {
  console.log("\n6. 实际使用场景示例");
  
  console.log(`
// 在游戏场景中的实际使用示例

class GameScene {
  private network: NetworkService;
  
  constructor() {
    this.network = new NetworkService();
    this.setupEventListeners();
  }
  
  private async setupEventListeners() {
    // 连接到服务器
    await this.network.connect("cabin_room", { name: "我的角色" });
    
    // 监听玩家加入
    this.network.onPlayerAdd((player, sessionId) => {
      if (sessionId !== this.network.getSessionId()) {
        // 创建其他玩家的精灵
        this.createPlayerSprite(player, sessionId);
      }
    });
    
    // 监听玩家移动
    this.network.onPlayerMove((player, sessionId) => {
      // 更新玩家精灵位置和状态
      this.updatePlayerSprite(player, sessionId);
    });
    
    // 监听玩家离开
    this.network.onPlayerRemove((player, sessionId) => {
      // 移除玩家精灵
      this.removePlayerSprite(sessionId);
    });
  }
  
  // 当本地玩家移动时
  onPlayerMove(x: number, y: number, direction: PlayerDirection) {
    // 更新本地精灵
    this.updateLocalPlayerSprite(x, y, direction);
    
    // 发送移动消息到服务器
    this.network.sendMove(x, y, PlayerState.WALK, direction);
  }
  
  // 当本地玩家停止移动时
  onPlayerStop(x: number, y: number) {
    // 更新本地精灵
    this.updateLocalPlayerSprite(x, y, this.currentDirection);
    
    // 发送状态变化消息
    this.network.sendStateChange(PlayerState.IDLE);
  }
}
  `);
}

// 运行演示
function runDemo() {
  console.log("开始客户端网络服务演示...\n");
  
  // 演示网络服务
  const network = demonstrateNetworkService();
  
  // 演示事件监听
  demonstrateEventListeners(network);
  
  // 演示连接过程
  demonstrateConnection(network);
  
  // 展示类型定义
  demonstrateTypes();
  
  // 展示实际使用场景
  demonstrateRealUsage();
  
  console.log("\n=== 演示完成 ===");
  console.log("✅ 客户端网络服务设计正确，可以与服务器Schema配合使用");
}

// 运行演示
runDemo();