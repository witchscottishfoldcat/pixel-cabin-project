# 像素小屋 - 美术资源命名规范

## 概述

本文档定义了美术资源的命名规范，确保代码能够智能地处理动画和资源加载。遵循这些规范可以让代码更简洁、更易维护。

## 基本原则

1. **使用Sprite Sheet而非散图**：不要使用 player_run_1.png, player_run_2.png 这种散图
2. **统一的命名逻辑**：所有资源使用一致的命名结构
3. **可编程性**：命名要便于代码通过字符串拼接生成正确的资源名
4. **可读性**：名称要清晰地表达资源的内容和用途

## 角色动画命名规范

### 基本结构

```
{角色名}_{状态}_{方向}.{扩展名}
```

### 状态枚举

- `idle` - 静止/站立
- `walk` - 行走
- `run` - 奔跑
- `sit` - 坐下
- `interact` - 交互
- `jump` - 跳跃
- `fall` - 下落

### 方向枚举

- `down` - 下
- `left` - 左
- `right` - 右
- `up` - 上

### 完整示例

```
player_idle_down.png     - 玩家静止_下
player_walk_down.png     - 玩家行走_下
player_walk_up.png       - 玩家行走_上
player_walk_left.png     - 玩家行走_左
player_walk_right.png    - 玩家行走_右
player_interact_down.png - 玩家交互_下
player_sit_left.png      - 玩家坐下_左
```

## 代码使用示例

```typescript
// 智能动画播放
function playPlayerAnimation(state: string, direction: string) {
  const animationKey = `player_${state}_${direction}`;
  player.play(animationKey);
}

// 使用
playPlayerAnimation('walk', 'down');  // 播放 player_walk_down
playPlayerAnimation('idle', 'up');    // 播放 player_idle_up
```

## Sprite Sheet规范

### 文件命名

Sprite Sheet文件使用以下命名：

```
{角色名}_spritesheet.{扩展名}
```

示例：
```
player_spritesheet.png
player_spritesheet.json  // Atlas文件（如果使用TexturePacker）
```

### 帧排列规则

在Sprite Sheet中，动画帧应该按以下顺序排列：

1. 按状态分组（idle、walk、run等）
2. 在每个状态内，按方向排序（down、left、right、up）
3. 在每个方向内，按动画帧顺序排列

### Atlas配置示例（JSON）

```json
{
  "frames": {
    "player_idle_down_0": {...},
    "player_idle_down_1": {...},
    "player_idle_down_2": {...},
    "player_idle_left_0": {...},
    "player_idle_left_1": {...},
    "player_idle_left_2": {...},
    "player_walk_down_0": {...},
    "player_walk_down_1": {...},
    "player_walk_down_2": {...},
    "player_walk_down_3": {...}
  },
  "animations": {
    "player_idle_down": ["player_idle_down_0", "player_idle_down_1", "player_idle_down_2"],
    "player_idle_left": ["player_idle_left_0", "player_idle_left_1", "player_idle_left_2"],
    "player_walk_down": ["player_walk_down_0", "player_walk_down_1", "player_walk_down_2", "player_walk_down_3"]
  }
}
```

## 环境资源命名规范

### 地图瓦片

```
{材质}_{类型}_{变体}.{扩展名}
```

示例：
```
floor_wood_01.png    - 木地板01
floor_tile_blue.png  - 蓝色瓷砖
wall_brick_red.png   - 红砖墙
carpet_persian.png   - 波斯地毯
```

### 家具道具

```
{物品名}_{状态}_{视角}.{扩展名}
```

示例：
```
table_wooden_top.png      - 木桌（俯视图）
chair_wooden_side.png     - 木椅（侧视图）
lamp_desk_on.png          - 台灯（开启状态）
lamp_desk_off.png         - 台灯（关闭状态）
```

### 交互物品

```
{物品名}_interactive.{扩展名}
```

示例：
```
door_wooden_interactive.png    - 可交互的木门
note_paper_interactive.png     - 可交互的纸条
switch_light_interactive.png   - 可交互的电灯开关
```

## UI元素命名规范

```
{界面}_{元素}_{状态}.{扩展名}
```

示例：
```
main_menu_button_normal.png    - 主菜单按钮（正常状态）
main_menu_button_hover.png     - 主菜单按钮（悬停状态）
main_menu_button_pressed.png   - 主菜单按钮（按下状态）
dialogue_background.png        - 对话框背景
inventory_slot_empty.png       - 物品栏空槽位
```

## 音效命名规范

```
{类型}_{具体描述}.{扩展名}
```

示例：
```
footstep_wood_01.wav    - 木地板脚步声01
footstep_carpet_01.wav  - 地毯脚步声01
door_open_creaky.wav    - 门打开（吱吱声）
note_pickup.wav         - 拾取笔记音效
ui_click.wav            - UI点击音效
```

## 文件夹结构

```
assets/
├── sprites/
│   ├── player/
│   │   ├── player_spritesheet.png
│   │   └── player_spritesheet.json
│   └── npc/
│       ├── villager_spritesheet.png
│       └── villager_spritesheet.json
├── tiles/
│   ├── floor/
│   ├── wall/
│   └── decoration/
├── furniture/
│   ├── tables/
│   ├── chairs/
│   └── lighting/
├── ui/
│   ├── buttons/
│   ├── panels/
│   └── icons/
└── audio/
    ├── sfx/
    └── music/
```

## 加载代码示例

### Phaser加载示例

```typescript
// 加载角色Sprite Sheet
this.load.atlas(
  'player_spritesheet',
  'assets/sprites/player/player_spritesheet.png',
  'assets/sprites/player/player_spritesheet.json'
);

// 创建动画
function createAnimations() {
  const anims = this.anims;
  const frameNames = this.textures.get('player_spritesheet').getFrameNames();
  
  // 创建所有方向的idle动画
  ['down', 'left', 'right', 'up'].forEach(direction => {
    anims.create({
      key: `player_idle_${direction}`,
      frames: frameNames.filter(name => name.startsWith(`player_idle_${direction}`)),
      frameRate: 8,
      repeat: -1
    });
  });
  
  // 创建所有方向的walk动画
  ['down', 'left', 'right', 'up'].forEach(direction => {
    anims.create({
      key: `player_walk_${direction}`,
      frames: frameNames.filter(name => name.startsWith(`player_walk_${direction}`)),
      frameRate: 12,
      repeat: -1
    });
  });
}
```

## Aseprite导出设置

### 推荐设置

1. **输出格式**：Sprite Sheet (JSON Hash)
2. **文件名模式**：使用 `{title}_{tag}_{frame}` 模式
3. **图层处理**：每个动画状态使用独立图层
4. **标签设置**：为每个动画状态设置标签

### Aseprite标签示例

```
idle_down   - 静止向下动画
idle_left   - 静止向左动画
idle_right  - 静止向右动画
idle_up     - 静止向上动画
walk_down   - 行走向下动画
walk_left   - 行走向左动画
walk_right  - 行走向右动画
walk_up     - 行走向上动画
```

### 导出脚本（Lua示例）

```lua
-- Aseprite导出脚本
local imageName = app.activeSprite.filename
local path, filename = imageName:match("(.+[/\\])(.+)")

-- 导出Sprite Sheet
app.command.ExportSpriteSheet {
  ui=false,
  ask=false,
  type=SpriteSheetType.PACKED,
  columns=4,
  rows=4,
  width=0,
  height=0,
  layer="",
  frameTags=true,
  layerName="{title}_{layer}_{tag}",
  tagname="{tag}",
  filenameFormat="{title}_{tag}_{frame00}",
  borderPadding=0,
  shapePadding=0,
  innerPadding=0,
  trim=false,
  ignoreEmpty=false,
  mergeDups=false,
  openGenerated=false,
  script="{path}/{title}_spritesheet.json"
}
```

## 最佳实践

1. **一致性**：始终遵循相同的命名模式
2. **可预测性**：开发者应该能够预测资源名称
3. **可扩展性**：命名规则应该能够适应新添加的内容
4. **文档更新**：添加新类型的资源时，及时更新文档
5. **团队沟通**：确保所有美术人员了解并遵循命名规范

## 验证脚本

以下是一个简单的验证脚本，用于检查资源命名是否符合规范：

```typescript
function validateAssetNaming(filename: string): boolean {
  // 检查角色动画命名
  const playerAnimPattern = /^player_(idle|walk|run|sit|interact|jump|fall)_(down|left|right|up)\.(png|jpg|gif)$/;
  if (playerAnimPattern.test(filename)) return true;
  
  // 检查地图瓦片命名
  const tilePattern = /^(floor|wall|decoration)_[a-z]+_[0-9]+\.(png|jpg|gif)$/;
  if (tilePattern.test(filename)) return true;
  
  // 其他类型的检查...
  
  return false;
}
```

遵循这些命名规范，可以让代码更简洁、更易于维护，并减少因资源命名不一致导致的错误。