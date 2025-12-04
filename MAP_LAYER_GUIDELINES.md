# 像素小屋 - 地图分层策略指南

## 概述

本文档定义了Tiled地图编辑中的分层策略，确保游戏逻辑清晰、可维护。遵循这些规范可以避免后期因图层混乱导致的bug。

## 图层规范

### 1. 背景层 (Background Layer)

**作用**：纯视觉层，不包含任何游戏逻辑。

**内容**：
- 地板材质
- 地毯
- 装饰性元素（如墙画、植物装饰）
- 环境光照效果

**技术要求**：
- 这一层的所有元素永远在玩家脚下
- **没有物理碰撞**
- 渲染顺序：在最底层
- 图层命名：`background` 或 `bg_` 前缀

**示例**：
```
图层名称: background_floor
图层名称: bg_decoration
```

### 2. 碰撞层 (Collision Layer)

**作用**：定义游戏中的物理墙壁和障碍物。

**内容**：
- 墙壁
- 柜子
- 桌子
- 任何玩家不能穿过的物体

**技术要求**：
- **必须有物理碰撞**
- 在Tiled中，为这些图块添加自定义属性：`collides: true`
- 在Phaser中使用 `setCollisionByProperty({ collides: true })` 设置碰撞
- 渲染顺序：在背景层之上，玩家层之下
- 图层命名：`collision` 或 `collider_` 前缀

**Tiled设置步骤**：
1. 选择需要碰撞的图块
2. 在图块属性面板中添加自定义属性
3. 属性名：`collides`
4. 属性值：`true`

**示例**：
```
图层名称: collision_walls
图层名称: collider_furniture
```

### 3. 交互层 (Object Layer)

**作用**：定义触发剧情或交互的区域。

**内容**：
- **不要画图块**，只画透明的矩形区域
- 定义交互热区
- 设置触发器和交互点

**技术要求**：
- 使用Tiled的"对象层"（Object Layer）而非瓦片层
- 绘制矩形或多边形区域
- 为每个对象添加自定义属性定义交互类型
- 渲染顺序：在所有视觉层之上（通常不可见）
- 图层命名：`interaction` 或 `interact_` 前缀

**常见交互属性**：
```json
{
  "type": "note",           // 交互类型
  "content_id": "diary_01",  // 内容ID
  "trigger": "on_enter",    // 触发方式：on_enter, on_click
  "once": true              // 是否只触发一次
}
```

**示例交互类型**：
- **笔记交互**：`type: "note"`, `content_id: "diary_01"`
- **门交互**：`type: "door"`, `target_room: "living_room"`
- **道具交互**：`type: "item"`, `item_id: "key"`
- **对话交互**：`type: "dialogue"`, `dialogue_id: "greeting"`

## 图层顺序

正确的图层渲染顺序对于视觉效果至关重要：

1. `background` (背景层) - 最底层
2. `collision` (碰撞层) - 中间层
3. `interaction` (交互层) - 顶层（不可见，仅逻辑）
4. `player` (玩家层) - 游戏运行时动态添加

## Tiled项目设置建议

### 地图设置

- **地图类型**：正交（Orthogonal）
- **瓦片大小**：16x16 或 32x32（根据项目需求）
- **地图大小**：根据设计需求设置
- **渲染顺序**：严格按照上述图层顺序

### 图块集设置

- **嵌入模式**：建议使用嵌入式图块集，便于分享
- **图块命名**：使用有意义的名称，如 `wood_floor`, `brick_wall`
- **碰撞属性**：提前设置好具有碰撞的图块属性

### 对象层设置

- **对象类型**：主要使用矩形对象
- **自定义属性**：严格按照交互类型定义属性
- **对象命名**：使用有意义的名称，如 `diary_note`, `front_door`

## 导出设置

- **格式**：JSON格式
- **压缩**：不压缩，便于调试
- **嵌入图块集**：推荐嵌入，减少文件数量
- **文件路径**：保存在项目的 `assets/maps/` 目录下

## 代码集成示例

### Phaser中的碰撞设置

```typescript
// 加载地图
const map = this.make.tilemap({ key: 'cabin_map' });
const tileset = map.addTilesetImage('tileset_name', 'tileset_image');

// 加载图层
const backgroundLayer = map.createLayer('background', tileset, 0, 0);
const collisionLayer = map.createLayer('collision', tileset, 0, 0);

// 设置碰撞
collisionLayer.setCollisionByProperty({ collides: true });

// 玩家与地图碰撞
this.physics.add.collider(player, collisionLayer);
```

### 交互区域检测

```typescript
// 从Tiled对象层获取交互区域
const interactionLayer = map.getObjectLayer('interaction');

// 为每个交互区域创建物理传感器
interactionLayer.objects.forEach(obj => {
  const zone = this.add.zone(obj.x, obj.y, obj.width, obj.height);
  zone.setProperties({
    type: obj.type,
    content_id: obj.properties.find(p => p.name === 'content_id')?.value,
    trigger: obj.properties.find(p => p.name === 'trigger')?.value || 'on_enter'
  });
  
  // 设置为传感器，不会阻挡玩家
  this.physics.add.existing(zone, true);
  
  // 检测玩家进入区域
  this.physics.add.overlap(player, zone, (player, zone) => {
    this.handleInteraction(zone);
  });
});
```

## 最佳实践

1. **保持图层简洁**：每个图层只负责单一职责
2. **命名一致性**：使用统一的命名规范
3. **属性标准化**：自定义属性要有一致的结构
4. **文档更新**：添加新交互类型时，及时更新文档
5. **版本控制**：地图文件也应纳入版本控制

## 常见错误及解决方案

| 错误 | 原因 | 解决方案 |
|------|------|----------|
| 玩家可以穿墙 | 碰撞层未设置碰撞属性 | 确保图块有 `collides: true` 属性 |
| 交互区域无法触发 | 对象层未正确设置 | 检查对象层名称和对象属性 |
| 图层显示顺序错误 | 图层顺序不正确 | 按照推荐顺序重新排列图层 |
| 角色被装饰遮挡 | 装饰物放在背景层 | 将装饰物移到正确的图层 |

这套分层策略确保了游戏逻辑清晰、易于维护，并为后续功能扩展提供了良好的基础。