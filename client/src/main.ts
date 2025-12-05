import Phaser from "phaser";
import { GameScene } from "./scenes/Game";
import { UIScene } from "./scenes/UI";

console.log("Main.ts loaded");

// Game configuration
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "app",
    backgroundColor: "#2c3e50",
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0, x: 0 }, // Top-down game, no gravity
            debug: true // 启用调试以查看碰撞边界
        }
    },
    scene: [GameScene, UIScene]
};

console.log("Creating Phaser game with config:", config);

// Start game
const game = new Phaser.Game(config);

console.log("Game created:", game);