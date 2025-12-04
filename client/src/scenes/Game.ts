import Phaser from "phaser";
import { NetworkService } from "../services/Network";
import { PlayerData } from "../types/GameTypes";

export class GameScene extends Phaser.Scene {
    private network: NetworkService;
    private players: Map<string, Phaser.GameObjects.Sprite> = new Map();
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private playerSpeed = 160;
    private mySessionId: string = "";
    
    constructor() {
        super({ key: "GameScene" });
        this.network = new NetworkService();
    }
    
    preload(): void {
        // Create simple colored rectangles for now as placeholders
        this.createPlaceholderAssets();
    }
    
    create(): void {
        // Set up background
        this.add.rectangle(400, 300, 800, 600, 0x2c3e50);
        
        // Create grid pattern
        this.createGridPattern();
        
        // Set up keyboard controls
        this.cursors = this.input.keyboard?.createCursorKeys();
        
        // Connect to the server
        this.connectToServer();
        
        // Add UI text
        this.add.text(10, 10, "Pixel Cabin Game", {
            fontSize: "18px",
            color: "#ffffff"
        });
        
        this.add.text(10, 30, "Use arrow keys to move", {
            fontSize: "14px",
            color: "#ffffff"
        });
    }
    
    update(): void {
        if (!this.cursors || this.mySessionId === "") return;
        
        const myPlayer = this.players.get(this.mySessionId);
        if (!myPlayer) return;
        
        let dx = 0, dy = 0;
        let direction = 0; // default: down
        
        if (this.cursors.left.isDown) {
            dx = -this.playerSpeed;
            direction = 1; // left
        } else if (this.cursors.right.isDown) {
            dx = this.playerSpeed;
            direction = 2; // right
        }
        
        if (this.cursors.up.isDown) {
            dy = -this.playerSpeed;
            direction = 3; // up
        } else if (this.cursors.down.isDown) {
            dy = this.playerSpeed;
            direction = 0; // down
        }
        
        if (dx !== 0 || dy !== 0) {
            // Normalize diagonal movement
            if (dx !== 0 && dy !== 0) {
                dx *= 0.707;
                dy *= 0.707;
            }
            
            const newX = Math.max(20, Math.min(780, myPlayer.x + dx * (1/60)));
            const newY = Math.max(20, Math.min(580, myPlayer.y + dy * (1/60)));
            
            // Update position locally for smoother movement
            myPlayer.setPosition(newX, newY);
            
            // Send position to server
            this.network.sendMessage("move", {
                x: newX,
                y: newY,
                direction
            });
        }
    }
    
    private createPlaceholderAssets(): void {
        // Create a simple colored square as a player placeholder
        this.add.graphics()
            .fillStyle(0x3498db)
            .fillRect(0, 0, 32, 32)
            .generateTexture("player", 32, 32);
    }
    
    private createGridPattern(): void {
        // Create a simple grid pattern for the background
        const graphics = this.add.graphics();
        
        // Vertical lines
        for (let x = 0; x <= 800; x += 40) {
            graphics.lineStyle(1, 0x34495e, 0.5);
            graphics.moveTo(x, 0);
            graphics.lineTo(x, 600);
        }
        
        // Horizontal lines
        for (let y = 0; y <= 600; y += 40) {
            graphics.lineStyle(1, 0x34495e, 0.5);
            graphics.moveTo(0, y);
            graphics.lineTo(800, y);
        }
    }
    
    private async connectToServer(): Promise<void> {
        try {
            const room = await this.network.connect("cabin_room", { name: "Player" });
            this.mySessionId = room.sessionId;
            
            // Set up listeners for game state changes
            this.setupNetworkListeners();
            
            // Wait for state to be available before setting up player listeners
            this.network.waitForState(() => {
                console.log("Room state is now available, setting up player listeners");
                this.setupPlayerListeners();
                
                // Get initial state
                this.setupInitialPlayers();
            });
            
        } catch (error) {
            console.error("Failed to connect to server:", error);
            
            // Show connection error message
            this.add.text(400, 300, "Failed to connect to server", {
                fontSize: "24px",
                color: "#e74c3c",
                align: "center"
            }).setOrigin(0.5);
        }
    }
    
    private setupNetworkListeners(): void {
        // Listen for game messages
        this.network.onMessage((type, payload) => {
            switch (type) {
                case "player_joined":
                    console.log("Player joined:", payload.sessionId);
                    break;
                case "player_left":
                    console.log("Player left:", payload.sessionId);
                    break;
            }
        });
    }
    
    private setupPlayerListeners(): void {
        // Listen for new players joining
        this.network.onPlayerAdd((player: PlayerData, sessionId: string) => {
            const sprite = this.add.sprite(player.x, player.y, "player");
            this.players.set(sessionId, sprite);
            
            // Add name label
            const nameText = this.add.text(player.x, player.y - 20, sessionId.substring(0, 8), {
                fontSize: "12px",
                color: "#ffffff",
                align: "center"
            }).setOrigin(0.5);
            
            // Store reference to name text
            sprite.setData("nameText", nameText);
            
            // Listen for player movement updates
            this.setupPlayerMovementListener(player, sessionId);
        });
        
        // Listen for players leaving
        this.network.onPlayerRemove((_player: PlayerData, sessionId: string) => {
            const sprite = this.players.get(sessionId);
            if (sprite) {
                const nameText = sprite.getData("nameText");
                if (nameText) nameText.destroy();
                sprite.destroy();
                this.players.delete(sessionId);
            }
        });
    }
    
    private setupPlayerMovementListener(player: PlayerData, sessionId: string): void {
        // This is a simplified implementation - in a real game, 
        // you'd want to track changes more precisely
        const checkInterval = setInterval(() => {
            const sprite = this.players.get(sessionId);
            if (!sprite) {
                clearInterval(checkInterval);
                return;
            }
            
            if (sprite.x !== player.x || sprite.y !== player.y) {
                sprite.setPosition(player.x, player.y);
                
                const nameText = sprite.getData("nameText");
                if (nameText) {
                    nameText.setPosition(player.x, player.y - 20);
                }
            }
        }, 100);
    }
    
    private setupInitialPlayers(): void {
        // This will be handled by the onPlayerAdd events
        // when we get the initial state from the server
    }
}