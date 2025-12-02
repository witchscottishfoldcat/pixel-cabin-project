import Phaser from "phaser";
import { GameScene } from "./scenes/Game";
import { UIScene } from "./scenes/UI";

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
            gravity: { y: 0 }, // Top-down game, no gravity
            debug: false
        }
    },
    scene: [GameScene, UIScene]
};

// Start the game
const game = new Phaser.Game(config);