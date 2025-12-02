import Phaser from "phaser";

export class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: "UIScene" });
    }
    
    create(): void {
        // Create game title
        this.add.text(400, 20, "Pixel Cabin", {
            fontSize: "28px",
            color: "#ffffff",
            align: "center"
        }).setOrigin(0.5);
        
        // Create instructions panel
        const instructions = [
            "Instructions:",
            "• Use arrow keys to move",
            "• Other players will appear as blue squares",
            "• Your movements are synchronized with other players"
        ];
        
        let y = 70;
        instructions.forEach(text => {
            this.add.text(20, y, text, {
                fontSize: "14px",
                color: "#ffffff"
            });
            y += 20;
        });
        
        // Add connection status indicator
        this.add.text(780, 20, "Connected", {
            fontSize: "14px",
            color: "#2ecc71",
            align: "right"
        }).setOrigin(1, 0);
        
        // Create a simple chat input placeholder (for future implementation)
        this.createChatInputPlaceholder();
    }
    
    private createChatInputPlaceholder(): void {
        // Create a simple input field placeholder
        const inputBg = this.add.rectangle(400, 580, 600, 30, 0x34495e);
        inputBg.setOrigin(0.5);
        
        this.add.text(100, 580, "Type to chat...", {
            fontSize: "14px",
            color: "#95a5a6"
        }).setOrigin(0, 0.5);
    }
}