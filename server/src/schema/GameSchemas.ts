/**
 * 世界的DNA - 核心数据结构定义
 * 
 * 这个文件定义了Colyseus需要同步的所有核心数据结构。
 * 设计原则：只同步必要的数据，保持最小化，让前端处理表现层。
 */

import { Schema, type, MapSchema } from "@colyseus/schema";

/**
 * 玩家状态枚举
 */
export enum PlayerState {
  IDLE = "idle",    // 站立不动
  WALK = "walk",    // 行走中
  // 未来可扩展：JUMP, SIT, INTERACT 等
}

/**
 * 玩家朝向枚举
 */
export enum PlayerDirection {
  DOWN = 0,   // 朝下（默认）
  LEFT = 1,   // 朝左
  RIGHT = 2,  // 朝右
  UP = 3      // 朝上
}

/**
 * Player Schema - 定义每个玩家的核心状态
 * 
 * 后端只关心最基本的游戏状态数据，不处理视觉表现
 */
export class Player extends Schema {
  /**
   * 玩家X坐标 - 水平位置
   */
  @type("number") x: number = 0;
  
  /**
   * 玩家Y坐标 - 垂直位置
   */
  @type("number") y: number = 0;
  
  /**
   * 玩家当前状态 - 站立、行走等
   * 默认为IDLE（站立）
   */
  @type("string") state: PlayerState = PlayerState.IDLE;
  
  /**
   * 玩家朝向 - 决定前端播放哪个方向的动画
   * 0: 下, 1: 左, 2: 右, 3: 上
   */
  @type("number") direction: PlayerDirection = PlayerDirection.DOWN;
}

/**
 * CabinRoomState Schema - 游戏房间的完整状态
 * 
 * 这是房间的根状态，包含所有需要同步的数据
 */
export class CabinRoomState extends Schema {
  /**
   * 所有在线玩家 - Map结构，key为sessionId，value为Player对象
   * Colyseus会自动同步这个Map中的所有Player数据变化
   */
  @type({ map: Player }) players = new MapSchema<Player>();
  
  /**
   * 地图宽度 - 用于边界检测
   */
  @type("number") mapWidth: number = 800;
  
  /**
   * 地图高度 - 用于边界检测
   */
  @type("number") mapHeight: number = 600;
  
  // 未来扩展预留：
  // @type("boolean") lightOn: boolean = true;  // 灯的开关状态
  // @type({ map: Note }) notes = new MapSchema<Note>();  // 笔记状态
}

/**
 * 网络消息类型枚举 - 客户端与服务器通信的消息类型
 */
export enum MessageType {
  // 客户端到服务器的消息
  MOVE = "move",                    // 玩家移动
  CHANGE_STATE = "change_state",   // 玩家状态改变
  CHANGE_DIRECTION = "change_direction", // 玩家朝向改变
  
  // 服务器到客户端的消息
  PLAYER_JOINED = "player_joined",  // 新玩家加入
  PLAYER_LEFT = "player_left",      // 玩家离开
}

/**
 * 移动消息的数据结构
 */
export interface MoveMessage {
  x: number;
  y: number;
  state?: PlayerState;  // 可选，如果移动会改变状态
  direction?: PlayerDirection;  // 可选，如果移动会改变朝向
}