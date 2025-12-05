import Phaser from "phaser";

console.log("GameScene.ts loaded");

export class GameScene extends Phaser.Scene {
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private playerSpeed = 160;
    private player?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private collisionGroup?: Phaser.Physics.Arcade.StaticGroup;
    
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
        
        // 创建玩家
        this.player = this.physics.add.sprite(400, 300, "player");
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        
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
        
        if (this.cursors.left.isDown) {
            dx = -this.playerSpeed;
        } else if (this.cursors.right.isDown) {
            dx = this.playerSpeed;
        }
        
        if (this.cursors.up.isDown) {
            dy = -this.playerSpeed;
        } else if (this.cursors.down.isDown) {
            dy = this.playerSpeed;
        }
        
        // 设置速度
        this.player.setVelocity(dx, dy);
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
        
        // 创建玩家纹理
        this.add.graphics()
            .fillStyle(0x3498db)  // 蓝色
            .fillRect(0, 0, 32, 32)
            .lineStyle(2, 0x2980b9)
            .strokeRect(0, 0, 32, 32)
            .generateTexture("player", 32, 32);
            
        console.log("Temporary assets created");
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