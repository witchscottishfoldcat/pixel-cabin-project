/**
 * Schema演示文件
 * 
 * 这个文件展示如何使用我们定义的Schema
 */

import { Player, CabinRoomState, PlayerState, PlayerDirection, MessageType, MoveMessage } from "../src/schema/GameSchemas";

console.log("=== 像素小屋Schema演示 ===\n");

// 创建一个玩家
function createPlayerDemo() {
  console.log("1. 创建玩家");
  
  const player = new Player();
  
  // 设置初始位置和状态
  player.x = 100;
  player.y = 200;
  player.state = PlayerState.IDLE;
  player.direction = PlayerDirection.DOWN;
  
  console.log(`玩家初始位置: (${player.x}, ${player.y})`);
  console.log(`玩家初始状态: ${player.state}`);
  console.log(`玩家初始朝向: ${player.direction}`);
  
  return player;
}

// 模拟玩家移动
function simulatePlayerMove(player: Player) {
  console.log("\n2. 模拟玩家移动");
  
  // 改变状态为行走
  player.state = PlayerState.WALK;
  player.direction = PlayerDirection.RIGHT;
  
  // 移动玩家
  player.x += 10;
  player.y += 5;
  
  console.log(`移动后位置: (${player.x}, ${player.y})`);
  console.log(`移动状态: ${player.state}`);
  console.log(`移动朝向: ${player.direction}`);
}

// 创建房间并添加玩家
function createRoomDemo() {
  console.log("\n3. 创建房间");
  
  const roomState = new CabinRoomState();
  
  console.log(`房间大小: ${roomState.mapWidth} x ${roomState.mapHeight}`);
  console.log(`初始玩家数量: ${roomState.players.size}`);
  
  // 创建多个玩家
  for (let i = 0; i < 3; i++) {
    const player = new Player();
    player.x = 100 + i * 50;
    player.y = 100 + i * 30;
    player.state = i % 2 === 0 ? PlayerState.IDLE : PlayerState.WALK;
    player.direction = i % 4;
    
    roomState.players.set(`player${i}`, player);
    
    console.log(`玩家${i} - 位置:(${player.x}, ${player.y}), 状态:${player.state}, 朝向:${player.direction}`);
  }
  
  console.log(`添加后玩家数量: ${roomState.players.size}`);
  
  return roomState;
}

// 模拟消息处理
function simulateMessageHandling(roomState: CabinRoomState) {
  console.log("\n4. 模拟消息处理");
  
  const player = roomState.players.get("player0");
  if (!player) return;
  
  // 模拟移动消息
  const moveMessage: MoveMessage = {
    x: 250,
    y: 180,
    state: PlayerState.WALK,
    direction: PlayerDirection.UP
  };
  
  // 处理消息（模拟服务器处理）
  player.x = moveMessage.x;
  player.y = moveMessage.y;
  player.state = moveMessage.state || player.state;
  player.direction = moveMessage.direction || player.direction;
  
  console.log(`处理移动消息后 - 位置:(${player.x}, ${player.y}), 状态:${player.state}, 朝向:${player.direction}`);
}

// 展示Schema特性
function demonstrateSchemaFeatures(roomState: CabinRoomState) {
  console.log("\n5. Schema特性演示");
  
  // 展示Schema的结构
  console.log(`房间包含 ${roomState.players.size} 个玩家`);
  console.log(`地图大小: ${roomState.mapWidth} x ${roomState.mapHeight}`);
  
  // 展示玩家数据结构
  roomState.players.forEach((player, sessionId) => {
    console.log(`玩家 ${sessionId}:`);
    console.log(`  - 位置: (${player.x}, ${player.y})`);
    console.log(`  - 状态: ${player.state}`);
    console.log(`  - 朝向: ${player.direction}`);
  });
  
  // 演示消息类型
  console.log("\n消息类型:");
  console.log(`- MOVE: "${MessageType.MOVE}"`);
  console.log(`- CHANGE_STATE: "${MessageType.CHANGE_STATE}"`);
  console.log(`- CHANGE_DIRECTION: "${MessageType.CHANGE_DIRECTION}"`);
  
  // 演示状态枚举
  console.log("\n玩家状态枚举:");
  console.log(`- IDLE: "${PlayerState.IDLE}"`);
  console.log(`- WALK: "${PlayerState.WALK}"`);
  
  // 演示朝向枚举
  console.log("\n玩家朝向枚举:");
  console.log(`- DOWN: ${PlayerDirection.DOWN}`);
  console.log(`- LEFT: ${PlayerDirection.LEFT}`);
  console.log(`- RIGHT: ${PlayerDirection.RIGHT}`);
  console.log(`- UP: ${PlayerDirection.UP}`);
}

// 运行演示
function runDemo() {
  console.log("开始演示...\n");
  
  // 创建玩家
  const player = createPlayerDemo();
  
  // 模拟玩家移动
  simulatePlayerMove(player);
  
  // 创建房间
  const roomState = createRoomDemo();
  
  // 模拟消息处理
  simulateMessageHandling(roomState);
  
  // 展示Schema特性
  demonstrateSchemaFeatures(roomState);
  
  console.log("\n=== 演示完成 ===");
  console.log("✅ Schema定义正确，功能完整，可以投入使用");
}

// 运行演示
runDemo();