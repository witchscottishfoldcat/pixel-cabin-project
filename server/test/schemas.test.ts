/**
 * Schema测试文件
 * 
 * 这个文件测试我们定义的Player和CabinRoomState Schema是否正确工作
 */

import { Schema } from "@colyseus/schema";
import { Player, CabinRoomState, PlayerState, PlayerDirection, MessageType, MoveMessage } from "../src/schema/GameSchemas";

// 简单的断言函数
function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`断言失败: ${message}`);
  }
  console.log(`✓ ${message}`);
}

// 测试Player Schema
function testPlayerSchema() {
  console.log("\n=== 测试Player Schema ===");
  
  // 创建新玩家
  const player = new Player();
  
  // 测试初始值
  assert(player.x === 0, "Player初始x坐标为0");
  assert(player.y === 0, "Player初始y坐标为0");
  assert(player.state === PlayerState.IDLE, "Player初始状态为IDLE");
  assert(player.direction === PlayerDirection.DOWN, "Player初始朝向为DOWN");
  
  // 测试属性设置
  player.x = 100;
  player.y = 200;
  player.state = PlayerState.WALK;
  player.direction = PlayerDirection.RIGHT;
  
  assert(player.x === 100, "Player x坐标设置为100");
  assert(player.y === 200, "Player y坐标设置为200");
  assert(player.state === PlayerState.WALK, "Player状态设置为WALK");
  assert(player.direction === PlayerDirection.RIGHT, "Player朝向设置为RIGHT");
  
  console.log("Player Schema测试通过!");
}

// 测试CabinRoomState Schema
function testCabinRoomStateSchema() {
  console.log("\n=== 测试CabinRoomState Schema ===");
  
  // 创建新房间状态
  const roomState = new CabinRoomState();
  
  // 测试初始值
  assert(roomState.mapWidth === 800, "地图初始宽度为800");
  assert(roomState.mapHeight === 600, "地图初始高度为600");
  assert(roomState.players.size === 0, "初始玩家数量为0");
  
  // 测试添加玩家
  const player1 = new Player();
  player1.x = 100;
  player1.y = 100;
  player1.state = PlayerState.IDLE;
  player1.direction = PlayerDirection.DOWN;
  
  const player2 = new Player();
  player2.x = 200;
  player2.y = 200;
  player2.state = PlayerState.WALK;
  player2.direction = PlayerDirection.LEFT;
  
  // 添加玩家到房间
  roomState.players.set("session1", player1);
  roomState.players.set("session2", player2);
  
  assert(roomState.players.size === 2, "添加2个玩家后数量为2");
  assert(roomState.players.get("session1") === player1, "可以通过sessionId获取玩家");
  assert(roomState.players.get("session1")?.x === 100, "玩家1的x坐标正确");
  assert(roomState.players.get("session2")?.state === PlayerState.WALK, "玩家2的状态正确");
  
  // 测试删除玩家
  roomState.players.delete("session1");
  assert(roomState.players.size === 1, "删除1个玩家后数量为1");
  assert(!roomState.players.has("session1"), "session1已被删除");
  assert(roomState.players.has("session2"), "session2仍然存在");
  
  console.log("CabinRoomState Schema测试通过!");
}

// 测试Schema序列化/反序列化
function testSchemaSerialization() {
  console.log("\n=== 测试Schema序列化/反序列化 ===");
  
  // 创建房间状态并添加玩家
  const roomState = new CabinRoomState();
  const player = new Player();
  player.x = 150;
  player.y = 250;
  player.state = PlayerState.WALK;
  player.direction = PlayerDirection.UP;
  
  roomState.players.set("testSession", player);
  
  // 序列化
  const serialized = (roomState as any).encode();
  assert(serialized.length > 0, "序列化结果不为空");
  console.log(`序列化大小: ${serialized.length} bytes`);
  
  // 创建新对象并反序列化
  const newState = new CabinRoomState();
  (newState as any).decode(serialized);
  
  // 验证反序列化结果
  assert(newState.mapWidth === 800, "反序列化后地图宽度正确");
  assert(newState.mapHeight === 600, "反序列化后地图高度正确");
  assert(newState.players.size === 1, "反序列化后玩家数量正确");
  
  const deserializedPlayer = newState.players.get("testSession");
  assert(deserializedPlayer !== undefined, "反序列化后玩家存在");
  assert(deserializedPlayer?.x === 150, "反序列化后玩家x坐标正确");
  assert(deserializedPlayer?.y === 250, "反序列化后玩家y坐标正确");
  assert(deserializedPlayer?.state === PlayerState.WALK, "反序列化后玩家状态正确");
  assert(deserializedPlayer?.direction === PlayerDirection.UP, "反序列化后玩家朝向正确");
  
  console.log("Schema序列化/反序列化测试通过!");
}

// 测试消息类型
function testMessageTypes() {
  console.log("\n=== 测试消息类型 ===");
  
  // 测试移动消息
  const moveMessage: MoveMessage = {
    x: 120,
    y: 180,
    state: PlayerState.WALK,
    direction: PlayerDirection.RIGHT
  };
  
  assert(moveMessage.x === 120, "移动消息x坐标正确");
  assert(moveMessage.y === 180, "移动消息y坐标正确");
  assert(moveMessage.state === PlayerState.WALK, "移动消息状态正确");
  assert(moveMessage.direction === PlayerDirection.RIGHT, "移动消息朝向正确");
  
  // 测试可选字段
  const partialMoveMessage: MoveMessage = {
    x: 50,
    y: 75
  };
  
  assert(partialMoveMessage.x === 50, "部分移动消息x坐标正确");
  assert(partialMoveMessage.y === 75, "部分移动消息y坐标正确");
  assert(partialMoveMessage.state === undefined, "部分移动消息未定义状态");
  assert(partialMoveMessage.direction === undefined, "部分移动消息未定义朝向");
  
  console.log("消息类型测试通过!");
}

// 测试边界条件和异常情况
function testEdgeCases() {
  console.log("\n=== 测试边界条件和异常情况 ===");
  
  const roomState = new CabinRoomState();
  
  // 测试添加大量玩家
  for (let i = 0; i < 100; i++) {
    const player = new Player();
    player.x = Math.random() * roomState.mapWidth;
    player.y = Math.random() * roomState.mapHeight;
    player.state = i % 2 === 0 ? PlayerState.IDLE : PlayerState.WALK;
    player.direction = i % 4;
    
    roomState.players.set(`session${i}`, player);
  }
  
  assert(roomState.players.size === 100, "成功添加100个玩家");
  
  // 验证所有玩家数据正确
  for (let i = 0; i < 100; i++) {
    const player = roomState.players.get(`session${i}`);
    assert(player !== undefined, `玩家${i}存在`);
    assert(player!.x >= 0 && player!.x <= roomState.mapWidth, `玩家${i}的x坐标在有效范围内`);
    assert(player!.y >= 0 && player!.y <= roomState.mapHeight, `玩家${i}的y坐标在有效范围内`);
    assert(
      player!.state === PlayerState.IDLE || player!.state === PlayerState.WALK,
      `玩家${i}的状态有效`
    );
  }
  
  // 测试无效坐标（虽然Schema允许，但游戏逻辑应该处理）
  const invalidPlayer = new Player();
  invalidPlayer.x = -100;
  invalidPlayer.y = 1000;
  invalidPlayer.state = PlayerState.WALK;
  invalidPlayer.direction = 5; // 无效的朝向值
  
  roomState.players.set("invalid", invalidPlayer);
  assert(roomState.players.get("invalid")?.x === -100, "允许负坐标");
  assert(roomState.players.get("invalid")?.y === 1000, "允许超出地图的坐标");
  assert(roomState.players.get("invalid")?.direction === 5, "允许无效的朝向值");
  
  console.log("边界条件测试通过!");
  console.log("注意：实际游戏中需要添加边界检查和验证逻辑");
}

// 运行所有测试
function runAllTests() {
  console.log("开始运行Schema测试...\n");
  
  try {
    testPlayerSchema();
    testCabinRoomStateSchema();
    testSchemaSerialization();
    testMessageTypes();
    testEdgeCases();
    
    console.log("\n🎉 所有测试通过! Schema定义正确且功能完整。");
  } catch (error) {
    console.error("\n❌ 测试失败:", error);
  }
}

// 如果直接运行此文件，执行测试
if (require.main === module) {
  runAllTests();
}

// 导出测试函数，以便在其他文件中使用
export {
  testPlayerSchema,
  testCabinRoomStateSchema,
  testSchemaSerialization,
  testMessageTypes,
  testEdgeCases,
  runAllTests
};