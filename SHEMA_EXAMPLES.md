# 游戏Schema使用示例

## 世界的DNA - 数据结构设计

我们已经为像素小屋项目定义了一套清晰、专注的数据结构，这是实现多人同步的基础。

### 核心设计原则

1. **最小化同步数据**：只同步游戏状态，不同步视觉表现
2. **可扩展性**：预留扩展点，便于后续添加功能
3. **类型安全**：前后端使用相同的类型定义，确保一致性

### Player Schema - 玩家数据结构

```typescript
export class Player extends Schema {
  @type("number") x: number = 0;         // X坐标
  @type("number") y: number = 0;         // Y坐标
  @type("string") state: PlayerState = PlayerState.IDLE;  // 状态：站立/行走
  @type("number") direction: PlayerDirection = PlayerDirection.DOWN;  // 朝向
}
```

**注意：** 我们故意排除了玩家名称、颜色、服装等视觉数据，这些由前端自行管理。

### CabinRoomState Schema - 房间状态

```typescript
export class CabinRoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type("number") mapWidth: number = 800;
  @type("number") mapHeight: number = 600;
  // 未来可扩展：
  // @type("boolean") lightOn: boolean = true;
  // @type({ map: Note }) notes = new MapSchema<Note>();
}
```

### 客户端与服务器通信

#### 1. 玩家移动

```typescript
// 客户端发送移动消息
room.send(MessageType.MOVE, {
  x: 100,
  y: 150,
  state: PlayerState.WALK,
  direction: PlayerDirection.RIGHT
});
```

#### 2. 监听状态变化

```typescript
// 监听玩家加入
room.state.players.onAdd((player, sessionId) => {
  console.log(`Player ${sessionId} joined at (${player.x}, ${player.y})`);
  
  // 监听玩家状态变化
  player.onChange(() => {
    console.log(`Player ${sessionId} state changed to ${player.state}`);
  });
});

// 监听玩家离开
room.state.players.onRemove((player, sessionId) => {
  console.log(`Player ${sessionId} left`);
});
```

### 未来扩展示例

#### 添加灯光控制

```typescript
// 在CabinRoomState中添加
@type("boolean") lightOn: boolean = true;

// 客户端控制灯光
room.send("toggleLight", {});

// 服务器处理
this.onMessage("toggleLight", (client) => {
  this.state.lightOn = !this.state.lightOn;
});
```

#### 添加交互式笔记

```typescript
// 定义Note Schema
export class Note extends Schema {
  @type("number") x: number = 0;
  @type("number") y: number = 0;
  @type("string") content: string = "";
  @type("boolean") isVisible: boolean = true;
}

// 在CabinRoomState中添加
@type({ map: Note }) notes = new MapSchema<Note>();
```

### 开发流程

1. **数据结构定义**：首先定义Schema，这是游戏世界的"DNA"
2. **服务器逻辑**：实现房间逻辑，处理消息和状态变更
3. **客户端渲染**：根据同步的状态渲染游戏世界，添加视觉效果
4. **测试同步**：确保多客户端状态同步正常

### 文件结构

```
server/src/
├── schema/
│   └── GameSchemas.ts      # 核心数据结构定义
├── rooms/
│   └── CabinRoom.ts        # 房间逻辑实现
└── index.ts                # 服务器入口

client/src/
├── types/
│   └── GameTypes.ts        # 客户端类型定义
└── services/
    └── Network.ts          # 网络服务
```

### 最佳实践

1. **保持Schema最小化**：只包含必要的状态数据
2. **使用枚举代替魔法数字**：如PlayerDirection、PlayerState
3. **添加详细注释**：解释每个字段的用途和限制
4. **前后端类型同步**：确保接口定义完全一致
5. **预留扩展点**：为未来功能预留数据字段

这套数据结构为像素小屋项目提供了坚实的基础，能够支持多人实时同步，并为未来的功能扩展留下了空间。