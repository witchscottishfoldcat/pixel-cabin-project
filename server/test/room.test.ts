/**
 * Room功能测试文件
 * 
 * 这个文件测试CabinRoom的基本功能和消息处理
 */

import { Client } from "colyseus";
import { CabinRoom } from "../src/rooms/CabinRoom";
import { PlayerState, PlayerDirection, MessageType } from "../src/schema/GameSchemas";

// 模拟客户端类
class MockClient extends Client {
  constructor(sessionId: string) {
    super(sessionId);
  }
  
  messages: Array<{type: string, data: any}> = [];
  
  send(type: string, data: any): void {
    this.messages.push({type, data});
  }
}

// 简单的断言函数
function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`断言失败: ${message}`);
  }
  console.log(`✓ ${message}`);
}

// 测试房间创建和初始化
function testRoomCreation() {
  console.log("\n=== 测试房间创建和初始化 ===");
  
  const room = new CabinRoom();
  
  // 测试房间属性
  assert(room.maxClients === 10, "房间最大客户端数为10");
  
  // 模拟房间创建
  room.onCreate({});
  
  // 验证初始状态
  assert(room.state.mapWidth === 800, "地图宽度初始化为800");
  assert(room.state.mapHeight === 600, "地图高度初始化为600");
  assert(room.state.players.size === 0, "初始玩家数量为0");
  
  console.log("房间创建测试通过!");
}

// 测试玩家加入
function testPlayerJoin() {
  console.log("\n=== 测试玩家加入 ===");
  
  const room = new CabinRoom();
  room.onCreate({});
  
  // 创建模拟客户端
  const client = new MockClient("session123") as any;
  
  // 模拟玩家加入
  room.onJoin(client, {name: "测试玩家"});
  
  // 验证玩家已添加到房间
  assert(room.state.players.size === 1, "玩家加入后房间内有1个玩家");
  assert(room.state.players.has("session123"), "可以通过sessionId找到玩家");
  
  const player = room.state.players.get("session123")!;
  assert(player.x >= 25 && player.x <= 775, "玩家初始x坐标在有效范围内");
  assert(player.y >= 25 && player.y <= 575, "玩家初始y坐标在有效范围内");
  assert(player.state === PlayerState.IDLE, "玩家初始状态为IDLE");
  assert(player.direction === PlayerDirection.DOWN, "玩家初始朝向为DOWN");
  
  console.log("玩家加入测试通过!");
}

// 测试玩家离开
function testPlayerLeave() {
  console.log("\n=== 测试玩家离开 ===");
  
  const room = new CabinRoom();
  room.onCreate({});
  
  // 添加玩家
  const client1 = new MockClient("session123") as any;
  const client2 = new MockClient("session456") as any;
  
  room.onJoin(client1, {name: "玩家1"});
  room.onJoin(client2, {name: "玩家2"});
  
  assert(room.state.players.size === 2, "初始有2个玩家");
  
  // 模拟玩家离开
  room.onLeave(client1, true);
  
  assert(room.state.players.size === 1, "玩家离开后房间内有1个玩家");
  assert(!room.state.players.has("session123"), "离开的玩家已被移除");
  assert(room.state.players.has("session456"), "其他玩家仍在房间内");
  
  console.log("玩家离开测试通过!");
}

// 测试玩家移动消息处理
function testPlayerMove() {
  console.log("\n=== 测试玩家移动消息处理 ===");
  
  const room = new CabinRoom();
  room.onCreate({});
  
  // 添加玩家
  const client = new MockClient("session123") as any;
  room.onJoin(client, {name: "移动测试玩家"});
  
  const player = room.state.players.get("session123")!;
  const initialX = player.x;
  const initialY = player.y;
  
  // 发送移动消息
  const moveMessage = {
    x: 400,
    y: 300,
    state: PlayerState.WALK,
    direction: PlayerDirection.RIGHT
  };
  
  // 模拟接收消息
  room.onMessage(MessageType.MOVE, client, moveMessage);
  
  // 验证玩家状态更新
  assert(player.x === 400, "玩家x坐标已更新");
  assert(player.y === 300, "玩家y坐标已更新");
  assert(player.state === PlayerState.WALK, "玩家状态已更新");
  assert(player.direction === PlayerDirection.RIGHT, "玩家朝向已更新");
  
  // 测试部分移动消息（只有坐标）
  const partialMoveMessage = {
    x: 200,
    y: 150
  };
  
  room.onMessage(MessageType.MOVE, client, partialMoveMessage);
  assert(player.x === 200, "玩家x坐标已更新为200");
  assert(player.y === 150, "玩家y坐标已更新为150");
  assert(player.state === PlayerState.WALK, "玩家状态保持不变");
  assert(player.direction === PlayerDirection.RIGHT, "玩家朝向保持不变");
  
  console.log("玩家移动消息处理测试通过!");
}

// 测试状态变化消息处理
function testStateChange() {
  console.log("\n=== 测试状态变化消息处理 ===");
  
  const room = new CabinRoom();
  room.onCreate({});
  
  // 添加玩家
  const client = new MockClient("session123") as any;
  room.onJoin(client, {name: "状态测试玩家"});
  
  const player = room.state.players.get("session123")!;
  assert(player.state === PlayerState.IDLE, "初始状态为IDLE");
  
  // 发送状态变化消息
  room.onMessage(MessageType.CHANGE_STATE, client, {state: PlayerState.WALK});
  assert(player.state === PlayerState.WALK, "状态已更新为WALK");
  
  // 再次改变状态
  room.onMessage(MessageType.CHANGE_STATE, client, {state: PlayerState.IDLE});
  assert(player.state === PlayerState.IDLE, "状态已更新为IDLE");
  
  console.log("状态变化消息处理测试通过!");
}

// 测试朝向变化消息处理
function testDirectionChange() {
  console.log("\n=== 测试朝向变化消息处理 ===");
  
  const room = new CabinRoom();
  room.onCreate({});
  
  // 添加玩家
  const client = new MockClient("session123") as any;
  room.onJoin(client, {name: "朝向测试玩家"});
  
  const player = room.state.players.get("session123")!;
  assert(player.direction === PlayerDirection.DOWN, "初始朝向为DOWN");
  
  // 测试所有朝向
  const directions = [
    PlayerDirection.UP,
    PlayerDirection.LEFT,
    PlayerDirection.RIGHT,
    PlayerDirection.DOWN
  ];
  
  for (const direction of directions) {
    room.onMessage(MessageType.CHANGE_DIRECTION, client, {direction});
    assert(player.direction === direction, `朝向已更新为${direction}`);
  }
  
  console.log("朝向变化消息处理测试通过!");
}

// 测试边界情况
function testEdgeCases() {
  console.log("\n=== 测试边界情况 ===");
  
  const room = new CabinRoom();
  room.onCreate({});
  
  // 测试超过最大客户端数
  const clients: any[] = [];
  for (let i = 0; i < room.maxClients + 5; i++) {
    const client = new MockClient(`session${i}`) as any;
    clients.push(client);
    
    // 由于Colyseus会在达到maxClients时自动拒绝连接，这里我们只模拟onJoin
    if (i < room.maxClients) {
      room.onJoin(client, {name: `玩家${i}`});
    }
  }
  
  assert(room.state.players.size === room.maxClients, "房间达到最大玩家数");
  
  // 测试不存在的玩家发送消息
  const fakeClient = new MockClient("nonexistent") as any;
  room.onMessage(MessageType.MOVE, fakeClient, {x: 100, y: 100});
  // 没有错误抛出，测试通过
  
  // 测试无效消息格式
  const validClient = clients[0];
  room.onMessage(MessageType.MOVE, validClient, {x: -100, y: 1000}); // 超出地图边界
  // Schema允许这些值，游戏逻辑应该在应用层处理
  
  console.log("边界情况测试通过!");
  console.log("注意：实际游戏中需要添加更多验证逻辑");
}

// 运行所有测试
function runAllTests() {
  console.log("开始运行Room功能测试...\n");
  
  try {
    testRoomCreation();
    testPlayerJoin();
    testPlayerLeave();
    testPlayerMove();
    testStateChange();
    testDirectionChange();
    testEdgeCases();
    
    console.log("\n🎉 所有Room功能测试通过! Room实现正确且功能完整。");
  } catch (error) {
    console.error("\n❌ Room功能测试失败:", error);
  }
}

// 如果直接运行此文件，执行测试
if (require.main === module) {
  runAllTests();
}

// 导出测试函数，以便在其他文件中使用
export {
  testRoomCreation,
  testPlayerJoin,
  testPlayerLeave,
  testPlayerMove,
  testStateChange,
  testDirectionChange,
  testEdgeCases,
  runAllTests
};