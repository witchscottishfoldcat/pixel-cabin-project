import { Room, Client } from "colyseus";
import { CabinRoomState, Player } from "./schema/CabinRoomState";

export class CabinRoom extends Room<CabinRoomState> {
    maxClients = 10;

    onCreate(options: any) {
        console.log("Cabin Room created!", options);
        
        this.setState(new CabinRoomState());

        // Message handlers
        this.onMessage("move", (client, message) => {
            const player = this.state.players.get(client.sessionId);
            if (player) {
                player.x = message.x;
                player.y = message.y;
                player.direction = message.direction;
            }
        });

        this.onMessage("setName", (client, message) => {
            const player = this.state.players.get(client.sessionId);
            if (player) {
                player.name = message.name;
            }
        });
    }

    onJoin(client: Client, options: any) {
        console.log(client.sessionId, "joined!");
        
        // Create a new player for the connected client
        const player = new Player();
        player.x = Math.floor(Math.random() * 400);
        player.y = Math.floor(Math.random() * 300);
        player.name = options.name || "Player";
        
        // Add player to the state
        this.state.players.set(client.sessionId, player);
    }

    onLeave(client: Client, consented: boolean) {
        console.log(client.sessionId, "left!");
        
        // Remove player from state
        this.state.players.delete(client.sessionId);
    }

    onDispose() {
        console.log("Room", this.roomId, "disposing...");
    }
}