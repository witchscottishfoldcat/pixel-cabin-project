# 像素小屋 - Tiled模板使用指南

## 概述

本文档提供了使用Tiled创建符合项目规范的地图的详细指南。遵循这些步骤可以确保地图与游戏代码完美集成。

## 项目设置

### 1. 创建新地图

1. 打开Tiled
2. 选择 "文件" → "新建" → "新地图"
3. 设置参数：
   - **方向**：正交（Orthogonal）
   - **瓦块大小**：16x16 像素（根据项目需求调整）
   - **地图大小**：根据设计需求设置（建议：50x50瓦片）
   - **瓦块渲染顺序**：右下（Right-down）

### 2. 导入图块集

1. 选择 "地图" → "新图块集"
2. 设置参数：
   - **名称**：为图块集起一个有意义的名称（如 "interior_tiles"）
   - **来源**：选择你的图块图像文件
   - **嵌入地图**：勾选（推荐）
   - **瓦块宽度/高度**：与地图瓦块大小保持一致
   - **边距/间距**：根据图块图像设置（通常为0）

### 3. 图层设置

按照以下顺序创建图层：

1. **背景层**（background）
   - 图层类型：瓦片图层
   - 名称：`background`
   - 用途：地板、装饰等纯视觉元素

2. **碰撞层**（collision）
   - 图层类型：瓦片图层
   - 名称：`collision`
   - 用途：墙壁、家具等有碰撞的物体

3. **交互层**（interaction）
   - 图层类型：对象图层
   - 名称：`interaction`
   - 用途：触发器、交互区域

## 碰撞设置

### 1. 为瓦片添加碰撞属性

1. 在图块集面板中，选择需要碰撞的瓦片
2. 右键点击 → "瓦片属性"
3. 添加自定义属性：
   - **名称**：`collides`
   - **类型**：布尔值
   - **值**：`true`

### 2. 批量设置碰撞属性

1. 选择多个需要碰撞的瓦块
2. 右键点击 → "瓦片属性"
3. 按上述步骤添加 `collides: true` 属性

## 交互区域设置

### 1. 创建交互对象

1. 选择交互图层（interaction）
2. 使用矩形工具绘制交互区域
3. 在对象属性中设置：

### 2. 交互对象属性

对于不同类型的交互，设置以下属性：

#### 笔记交互
```
类型: 自定义属性
名称: type
值: note

名称: content_id
值: diary_01

名称: trigger
值: on_enter
```

#### 门交互
```
名称: type
值: door

名称: target_room
值: living_room

名称: spawn_point
值: entry_position
```

#### 道具交互
```
名称: type
值: item

名称: item_id
值: key_01

名称: collectable
值: true
```

#### 对话交互
```
名称: type
值: dialogue

名称: dialogue_id
值: greeting_npc1

名称: once
值: true
```

## 导出设置

### 1. 导出地图

1. 选择 "文件" → "导出为"
2. 设置参数：
   - **文件名**：选择有意义的名称（如 `cabin_interior.json`）
   - **保存类型**：JSON地图文件（*.json）
   - **格式**：
     - 勾选 "压缩"（可选，发布时使用）
     - 勾选 "嵌入图块集"（推荐）

### 2. 文件组织

将导出的地图文件保存在以下目录结构中：
```
assets/
└── maps/
    ├── cabin_interior.json
    ├── living_room.json
    └── bedroom.json
```

## 地图模板

### 小屋地图模板

#### 基本结构
```
地图大小：30x20瓦片
图块大小：16x16像素
图块集：interior_tiles.tsx
```

#### 预设图层
1. `background` - 背景层
2. `collision` - 碰撞层
3. `interaction` - 交互层

#### 常用交互点
- **门口**：连接不同房间
- **桌子**：放置笔记或道具
- **书架**：隐藏线索
- **灯具**：可开关的灯光

## 常见问题与解决

### 1. 碰撞不生效

**问题**：玩家可以穿墙
**解决**：
1. 检查碰撞瓦片是否添加了 `collides: true` 属性
2. 确认游戏代码中正确设置了 `setCollisionByProperty({ collides: true })`
3. 验证碰撞图层是否正确加载

### 2. 交互区域无法触发

**问题**：玩家进入交互区域没有反应
**解决**：
1. 检查交互对象是否在正确的对象图层中
2. 验证对象属性名称和值是否正确
3. 确认游戏代码中正确处理了对象属性

### 3. 图层显示顺序错误

**问题**：某些元素显示在错误的位置
**解决**：
1. 确认图层顺序正确（background → collision → interaction）
2. 检查Tiled中的图层顺序与游戏代码中的一致
3. 验证图块的渲染深度设置

### 4. 图块集丢失

**问题**：打开地图时提示找不到图块集
**解决**：
1. 使用嵌入式图块集而非外部图块集
2. 如果使用外部图块集，确保路径正确
3. 检查图块集文件是否与地图文件在同一目录下

## 最佳实践

### 1. 地图设计原则

- **功能导向**：每个区域都有明确的用途
- **视觉引导**：使用视觉元素引导玩家
- **合理布局**：确保玩家有足够的移动空间
- **交互密度**：合理分布交互点，避免过于密集或稀疏

### 2. 性能考虑

- **控制地图大小**：避免创建过大的地图
- **优化图块集**：合并相关的图块到同一图块集中
- **合理分层**：避免创建过多不必要的图层

### 3. 协作工作流

- **版本控制**：将地图文件纳入版本控制
- **文档记录**：为每个地图创建说明文档
- **命名规范**：使用一致的地图文件命名
- **测试流程**：每个地图都要经过测试验证

## 代码集成示例

### Phaser加载地图

```typescript
// 在预加载场景中
preload() {
  // 加载图块集图像
  this.load.image('interior_tiles', 'assets/tiles/interior_tiles.png');
  
  // 加载地图
  this.load.tilemapTiledJSON('cabin_map', 'assets/maps/cabin_interior.json');
}

// 在创建场景中
create() {
  // 创建地图
  const map = this.make.tilemap({ key: 'cabin_map' });
  
  // 添加图块集
  const tileset = map.addTilesetImage('interior_tiles', 'interior_tiles');
  
  // 创建图层
  const backgroundLayer = map.createLayer('background', tileset, 0, 0);
  const collisionLayer = map.createLayer('collision', tileset, 0, 0);
  
  // 设置碰撞
  collisionLayer.setCollisionByProperty({ collides: true });
  
  // 创建交互区域
  this.createInteractionZones(map);
}

createInteractionZones(map: Phaser.Tilemaps.Tilemap) {
  const interactionLayer = map.getObjectLayer('interaction');
  
  interactionLayer.objects.forEach(obj => {
    const zone = this.add.zone(obj.x, obj.y, obj.width, obj.height);
    
    // 从对象属性中提取交互信息
    const type = obj.properties.find(p => p.name === 'type')?.value;
    const contentId = obj.properties.find(p => p.name === 'content_id')?.value;
    
    // 设置交互
    this.setupInteraction(zone, type, contentId);
  });
}
```

## 总结

遵循这些指南，可以创建出与游戏代码完美集成的地图，确保玩家获得流畅的游戏体验。正确的地图设置可以大大减少后期调试时间，并让功能扩展更加容易。