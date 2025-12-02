import * as Colyseus from "colyseus.js";
import { PlayerData } from "../types";

export class NetworkService {
    private client: Colyseus.Client | null = null;
    private room: Colyseus.Room | null = null;
    
    constructor() {
        // Connect to local server by default
        this.client = new Colyseus.Client("ws://localhost:2567");
    }
    
    async connect(roomName: string = "cabin_room", options: any = {}): Promise<Colyseus.Room> {
        if (!this.client) {
            throw new Error("Network client not initialized");
        }
        
        try {
            this.room = await this.client.joinOrCreate(roomName, options);
            console.log("Successfully joined room:", this.room.name);
            return this.room;
        } catch (error) {
            console.error("Failed to join room:", error);
            throw error;
        }
    }
    
    sendMessage(type: string, data: any): void {
        if (this.room) {
            this.room.send(type, data);
        } else {
            console.warn("Not connected to a room");
        }
    }
    
    onMessage(callback: (type: string, payload: any) => void): void {
        if (this.room) {
            this.room.onMessage("*", (type, payload) => {
                callback(type, payload);
            });
        } else {
            console.warn("Not connected to a room");
        }
    }
    
    onStateChange(callback: (state: any) => void): void {
        if (this.room) {
            this.room.onStateChange.once(callback);
        } else {
            console.warn("Not connected to a room");
        }
    }
    
    onPlayerAdd(callback: (player: PlayerData, sessionId: string) => void): void {
        if (this.room && this.room.state) {
            this.room.state.players.onAdd((player: PlayerData, sessionId: string) => {
                callback(player, sessionId);
            });
        }
    }
    
    onPlayerRemove(callback: (player: PlayerData, sessionId: string) => void): void {
        if (this.room && this.room.state) {
            this.room.state.players.onRemove((player: PlayerData, sessionId: string) => {
                callback(player, sessionId);
            });
        }
    }
    
    onPlayerMove(callback: (player: PlayerData, sessionId: string) => void): void {
        if (this.room && this.room.state) {
            this.room.state.players.onAdd((player: PlayerData, sessionId: string) => {
                // Listen for changes to this specific player
                player.onChange(() => {
                    callback(player, sessionId);
                });
            });
        }
    }
    
    disconnect(): void {
        if (this.room) {
            this.room.leave();
            this.room = null;
        }
    }
}