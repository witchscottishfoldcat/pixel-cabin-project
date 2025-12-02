import { Room, Client } from "colyseus";
import { CabinRoomState, Player, MessageType, MoveMessage } from "../schema/GameSchemas";

/**
 * CabinRoom - 游戏房间类
 * 
 * 这个类处理房间的生命周期和客户端交互逻辑
 * 核心职责：
 * 1. 管理玩家加入和离开
 * 2. 处理玩家移动和状态变化
 * 3. 维护游戏状态同步
 */
export class CabinRoom extends Room<CabinRoomState> {
  // 最大玩家数量
  maxClients = 10;
  
  // 房间创建时调用
  onCreate(options: any) {
    console.log("Cabin Room created!", options);
    
    // 初始化房间状态
    this.setState(new CabinRoomState());
    
    // 注册消息处理器
    this.setupMessageHandlers();
  }
  
  /**
   * 设置消息处理器
   */
  private setupMessageHandlers() {
    // 处理玩家移动消息
    this.onMessage(MessageType.MOVE, (client, message: MoveMessage) => {
      const player = this.state.players.get(client.sessionId);
      if (player) {
        // 更新坐标
        player.x = message.x;
        player.y = message.y;
        
        // 如果消息中包含状态和朝向，也一并更新
        if (message.state !== undefined) {
          player.state = message.state;
        }
        
        if (message.direction !== undefined) {
          player.direction = message.direction;
        }
        
        console.log(`Player ${client.sessionId} moved to (${player.x}, ${player.y})`);
      }
    });
    
    // 处理状态变化消息
    this.onMessage(MessageType.CHANGE_STATE, (client, message) => {
      const player = this.state.players.get(client.sessionId);
      if (player && message.state) {
        player.state = message.state;
        console.log(`Player ${client.sessionId} changed state to ${player.state}`);
      }
    });
    
    // 处理朝向变化消息
    this.onMessage(MessageType.CHANGE_DIRECTION, (client, message) => {
      const player = this.state.players.get(client.sessionId);
      if (player && message.direction !== undefined) {
        player.direction = message.direction;
        console.log(`Player ${client.sessionId} changed direction to ${player.direction}`);
      }
    });
  }
  
  // 客户端加入时调用
  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    
    // 创建新玩家
    const player = new Player();
    
    // 设置初始位置 - 在地图范围内随机位置
    player.x = Math.floor(Math.random() * (this.state.mapWidth - 50)) + 25;
    player.y = Math.floor(Math.random() * (this.state.mapHeight - 50)) + 25;
    
    // 设置初始状态和朝向
    player.state = PlayerState.IDLE;
    player.direction = PlayerDirection.DOWN;
    
    // 将玩家添加到状态中，Colyseus会自动同步给所有客户端
    this.state.players.set(client.sessionId, player);
    
    // 通知所有客户端有新玩家加入
    this.broadcast(MessageType.PLAYER_JOINED, {
      sessionId: client.sessionId,
      player: player
    }, { except: client }); // 不发送给加入者自己
  }
  
  // 客户端离开时调用
  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    
    // 从状态中移除玩家，Colyseus会自动同步给所有客户端
    this.state.players.delete(client.sessionId);
    
    // 通知所有客户端有玩家离开
    this.broadcast(MessageType.PLAYER_LEFT, {
      sessionId: client.sessionId
    });
  }
  
  // 房间销毁时调用
  onDispose() {
    console.log("Room", this.roomId, "disposing...");
  }
}