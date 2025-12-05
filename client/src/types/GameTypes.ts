/**
 * 游戏类型定义 - 客户端类型定义
 * 
 * 这个文件确保客户端和服务器之间的数据结构保持一致
 */

// 从服务器同步过来的枚举值保持一致
export enum PlayerState {
  IDLE = "idle",    // 站立不动
  WALK = "walk",    // 行走中
}

export enum PlayerDirection {
  DOWN = 0,   // 朝下（默认）
  LEFT = 1,   // 朝左
  RIGHT = 2,  // 朝右
  UP = 3      // 朝上
}

export enum MessageType {
  // 客户端到服务器的消息
  MOVE = "move",                    // 玩家移动
  CHANGE_STATE = "change_state",   // 玩家状态改变
  CHANGE_DIRECTION = "change_direction", // 玩家朝向改变
  
  // 服务器到客户端的消息
  PLAYER_JOINED = "player_joined",  // 新玩家加入
  PLAYER_LEFT = "player_left",      // 玩家离开
}

// 与服务器Player Schema对应的接口
export interface PlayerData {
  x: number;
  y: number;
  state: PlayerState;
  direction: PlayerDirection;
}

// 与服务器CabinRoomState Schema对应的接口
// 注意：实际运行时，players是一个Colyseus MapSchema对象，具有onAdd/onRemove等方法
export interface RoomState {
  players: any; // 实际上是MapSchema，但使用any以避免类型冲突
  mapWidth: number;
  mapHeight: number;
}

// 客户端扩展的Player数据 - 包含服务器不需要知道的视觉信息
export interface ClientPlayer extends PlayerData {
  sessionId: string;  // 会话ID
  // 前端专有数据（不与服务器同步）
  sprite?: any;  // Phaser精灵对象
  isLocalPlayer?: boolean;  // 是否是本地玩家
  playerName?: string;  // 玩家名称（可选）
  // 未来可扩展：
  // clothingColor: number;  // 衣服颜色
  // accessoryType: number;   // 配饰类型
}

// 移动消息的数据结构
export interface MoveMessage {
  x: number;
  y: number;
  state?: PlayerState;
  direction?: PlayerDirection;
}

// 通用网络消息结构
export interface NetworkMessage {
  type: string;
  data: any;
}