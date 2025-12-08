import Phaser from "phaser";

console.log("GameScene.ts loaded");

export class GameScene extends Phaser.Scene {
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private playerSpeed = 160;
    private player?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private collisionGroup?: Phaser.Physics.Arcade.StaticGroup;
    private playerDirection = "down"; // 记录玩家当前方向
    private isMoving = false; // 记录玩家是否正在移动
    
    constructor() {
        console.log("GameScene constructor");
        super({ 
            key: "GameScene"
        });
    }
    
    preload(): void {
        console.log("GameScene preload");
        // 创建临时素材
        this.createTemporaryAssets();
    }
    
    create(): void {
        console.log("GameScene create function");
        
        // 创建简单的地图
        this.createSimpleMap();
        
        // 创建玩家精灵和动画
        this.createPlayerAnimations();
        
        // 设置玩家与碰撞的碰撞
        this.physics.add.collider(this.player, this.collisionGroup!);
        
        // Set up keyboard controls
        this.cursors = this.input.keyboard?.createCursorKeys();

        this.add.text(10, 30, "Use arrow keys to move", {
            fontSize: "14px",
            color: "#ffffff"
        });
        
        console.log("GameScene create function completed");
    }
    
    update(): void {
        if (!this.cursors || !this.player) return;
        
        let dx = 0, dy = 0;
        this.isMoving = false;
        
        if (this.cursors.left.isDown) {
            dx = -this.playerSpeed;
            this.playerDirection = "left";
            this.isMoving = true;
        } else if (this.cursors.right.isDown) {
            dx = this.playerSpeed;
            this.playerDirection = "right";
            this.isMoving = true;
        }
        
        if (this.cursors.up.isDown) {
            dy = -this.playerSpeed;
            this.playerDirection = "up";
            this.isMoving = true;
        } else if (this.cursors.down.isDown) {
            dy = this.playerSpeed;
            this.playerDirection = "down";
            this.isMoving = true;
        }
        
        // 设置速度
        this.player.setVelocity(dx, dy);
        
        // 播放相应的动画
        this.updatePlayerAnimation();
    }
    
    private createTemporaryAssets(): void {
        console.log("Creating temporary assets");
        
        // 创建地板纹理
        this.add.graphics()
            .fillStyle(0x8B4513)  // 棕色
            .fillRect(0, 0, 32, 32)
            .lineStyle(1, 0x000000)
            .strokeRect(0, 0, 32, 32)
            .generateTexture("floor", 32, 32);
        
        // 创建墙壁纹理
        this.add.graphics()
            .fillStyle(0x696969)  // 灰色
            .fillRect(0, 0, 32, 32)
            .lineStyle(1, 0x000000)
            .strokeRect(0, 0, 32, 32)
            .generateTexture("wall", 32, 32);
        
        // 创建桌子纹理
        this.add.graphics()
            .fillStyle(0x8FBC8F)  // 绿色
            .fillRect(0, 0, 32, 32)
            .lineStyle(1, 0x000000)
            .strokeRect(0, 0, 32, 32)
            .generateTexture("table", 32, 32);
        
        // 创建像素小人纹理 - 四个方向
        this.createPlayerSprites();
            
        console.log("Temporary assets created");
    }
    
    private createPlayerSprites(): void {
        // 创建四个方向的像素小人
        const spriteSize = 32;
        
        // 上方向
        const playerUp = this.add.graphics();
        // 头部
        playerUp.fillStyle(0xFDBCB4) // 肤色
            .fillRect(spriteSize * 0.3, spriteSize * 0.1, spriteSize * 0.4, spriteSize * 0.3)
        // 身体
        playerUp.fillStyle(0x4169E1) // 蓝色
            .fillRect(spriteSize * 0.3, spriteSize * 0.4, spriteSize * 0.4, spriteSize * 0.5)
        // 眼睛
        playerUp.fillStyle(0x000000)
            .fillRect(spriteSize * 0.35, spriteSize * 0.2, spriteSize * 0.1, spriteSize * 0.05)
            .fillRect(spriteSize * 0.55, spriteSize * 0.2, spriteSize * 0.1, spriteSize * 0.05);
        playerUp.generateTexture("player_up", spriteSize, spriteSize);
        
        // 下方向
        const playerDown = this.add.graphics();
        // 头部
        playerDown.fillStyle(0xFDBCB4)
            .fillRect(spriteSize * 0.3, spriteSize * 0.1, spriteSize * 0.4, spriteSize * 0.3)
        // 身体
        playerDown.fillStyle(0x4169E1)
            .fillRect(spriteSize * 0.3, spriteSize * 0.4, spriteSize * 0.4, spriteSize * 0.5)
        // 眼睛
        playerDown.fillStyle(0x000000)
            .fillRect(spriteSize * 0.35, spriteSize * 0.2, spriteSize * 0.1, spriteSize * 0.05)
            .fillRect(spriteSize * 0.55, spriteSize * 0.2, spriteSize * 0.1, spriteSize * 0.05);
        playerDown.generateTexture("player_down", spriteSize, spriteSize);
        
        // 左方向
        const playerLeft = this.add.graphics();
        // 头部
        playerLeft.fillStyle(0xFDBCB4)
            .fillRect(spriteSize * 0.3, spriteSize * 0.1, spriteSize * 0.3, spriteSize * 0.3)
        // 身体
        playerLeft.fillStyle(0x4169E1)
            .fillRect(spriteSize * 0.2, spriteSize * 0.4, spriteSize * 0.5, spriteSize * 0.5)
        // 眼睛
        playerLeft.fillStyle(0x000000)
            .fillRect(spriteSize * 0.35, spriteSize * 0.2, spriteSize * 0.05, spriteSize * 0.1);
        playerLeft.generateTexture("player_left", spriteSize, spriteSize);
        
        // 右方向
        const playerRight = this.add.graphics();
        // 头部
        playerRight.fillStyle(0xFDBCB4)
            .fillRect(spriteSize * 0.4, spriteSize * 0.1, spriteSize * 0.3, spriteSize * 0.3)
        // 身体
        playerRight.fillStyle(0x4169E1)
            .fillRect(spriteSize * 0.3, spriteSize * 0.4, spriteSize * 0.5, spriteSize * 0.5)
        // 眼睛
        playerRight.fillStyle(0x000000)
            .fillRect(spriteSize * 0.6, spriteSize * 0.2, spriteSize * 0.05, spriteSize * 0.1);
        playerRight.generateTexture("player_right", spriteSize, spriteSize);
    }
    
    private createPlayerAnimations(): void {
        // 创建玩家
        this.player = this.physics.add.sprite(400, 300, "player_down");
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        
        // 创建简单的"行走"动画 - 使用大小变化来模拟
        // 每个方向两个帧：正常和稍微缩小
        const animFrameRate = 8;
        
        // 上方向动画
        if (!this.anims.exists('walk_up')) {
            this.anims.create({
                key: 'walk_up',
                frames: [
                    { key: 'player_up' },
                    { key: 'player_up', frame: null, duration: 50 }  // 同一张图片但稍短的持续时间模拟变化
                ],
                frameRate: animFrameRate,
                repeat: -1
            });
        }
        
        // 下方向动画
        if (!this.anims.exists('walk_down')) {
            this.anims.create({
                key: 'walk_down',
                frames: [
                    { key: 'player_down' },
                    { key: 'player_down', frame: null, duration: 50 }
                ],
                frameRate: animFrameRate,
                repeat: -1
            });
        }
        
        // 左方向动画
        if (!this.anims.exists('walk_left')) {
            this.anims.create({
                key: 'walk_left',
                frames: [
                    { key: 'player_left' },
                    { key: 'player_left', frame: null, duration: 50 }
                ],
                frameRate: animFrameRate,
                repeat: -1
            });
        }
        
        // 右方向动画
        if (!this.anims.exists('walk_right')) {
            this.anims.create({
                key: 'walk_right',
                frames: [
                    { key: 'player_right' },
                    { key: 'player_right', frame: null, duration: 50 }
                ],
                frameRate: animFrameRate,
                repeat: -1
            });
        }
        
        // 设置初始动画为站立状态
        this.player.anims.load('walk_down');
        this.player.anims.pause();
    }
    
    private updatePlayerAnimation(): void {
        if (!this.player) return;
        
        // 根据玩家状态播放动画
        if (this.isMoving) {
            // 移动时播放对应方向的行走动画
            this.player.anims.play(`walk_${this.playerDirection}`, true);
        } else {
            // 静止时暂停动画，保持当前方向
            this.player.anims.pause();
            
            // 设置正确的静态纹理
            this.player.setTexture(`player_${this.playerDirection}`);
        }
    }
    
    private createSimpleMap(): void {
        console.log("Creating simple map");
        
        // 创建碰撞组
        this.collisionGroup = this.physics.add.staticGroup();
        
        // 创建地板
        for (let x = 0; x < 25; x++) {
            for (let y = 0; y < 19; y++) {
                this.add.image(x * 32, y * 32, "floor").setOrigin(0, 0);
            }
        }
        
        // 创建墙壁 (碰撞区域)
        // 上墙
        for (let x = 0; x < 25; x++) {
            this.add.image(x * 32, 0, "wall").setOrigin(0, 0);
            const wall = this.physics.add.staticImage(x * 32, 0, "wall");
            wall.setVisible(false);
            this.collisionGroup.add(wall);
        }
        
        // 下墙
        for (let x = 0; x < 25; x++) {
            this.add.image(x * 32, 18 * 32, "wall").setOrigin(0, 0);
            const wall = this.physics.add.staticImage(x * 32, 18 * 32, "wall");
            wall.setVisible(false);
            this.collisionGroup.add(wall);
        }
        
        // 左墙
        for (let y = 0; y < 19; y++) {
            this.add.image(0, y * 32, "wall").setOrigin(0, 0);
            const wall = this.physics.add.staticImage(0, y * 32, "wall");
            wall.setVisible(false);
            this.collisionGroup.add(wall);
        }
        
        // 右墙
        for (let y = 0; y < 19; y++) {
            this.add.image(24 * 32, y * 32, "wall").setOrigin(0, 0);
            const wall = this.physics.add.staticImage(24 * 32, y * 32, "wall");
            wall.setVisible(false);
            this.collisionGroup.add(wall);
        }
        
        // 添加一张桌子
        this.add.image(10 * 32, 10 * 32, "table").setOrigin(0, 0);
        const table = this.physics.add.staticImage(10 * 32, 10 * 32, "table");
        table.setVisible(false);
        this.collisionGroup.add(table);
        
        console.log("Simple map created");
    }
}