import * as Colyseus from "colyseus.js";
import { PlayerData, MessageType } from "../types/GameTypes";

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
            console.log(`Attempting to join room: ${roomName} with options:`, options);
            this.room = await this.client.joinOrCreate(roomName, options);
            console.log("Successfully joined room:", this.room.name, "Session ID:", this.room.sessionId);
            return this.room;
        } catch (error) {
            console.error("Failed to join room:", error);
            if (error instanceof Error) {
                console.error("Error details:", error.message);
                if (error.stack) {
                    console.error("Stack trace:", error.stack);
                }
            }
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
            this.room.onMessage("*", (type: any, payload: any) => {
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
    
    // 等待状态可用后再设置玩家监听器
    waitForState(callback: () => void): void {
        if (this.room && this.room.state && this.room.state.players) {
            // 状态已可用，直接执行回调
            console.log("State is immediately available");
            this.debugStateStructure();
            callback();
        } else if (this.room) {
            // 等待状态变化
            console.log("Waiting for state to become available...");
            this.room.onStateChange.once((state: any) => {
                console.log("State change detected, state:", state);
                console.log("State keys:", Object.keys(state));
                this.debugStateStructure();
                // Small delay to ensure state is fully populated
                setTimeout(callback, 100);
            });
        } else {
            console.warn("Cannot wait for state: room is not available");
        }
    }
    
    // 调试状态结构
    private debugStateStructure(): void {
        if (!this.room || !this.room.state) {
            console.log("No room or state available for debugging");
            return;
        }
        
        console.log("=== STATE STRUCTURE DEBUG ===");
        console.log("State object type:", typeof this.room.state);
        console.log("State constructor:", this.room.state.constructor.name);
        
        if (this.room.state.players) {
            console.log("Players object type:", typeof this.room.state.players);
            console.log("Players constructor:", this.room.state.players.constructor.name);
            console.log("Players methods:", Object.getOwnPropertyNames(Object.getPrototypeOf(this.room.state.players)));
            
            // 尝试检查是否有玩家
            try {
                if (typeof this.room.state.players.size !== 'undefined') {
                    console.log("Players size:", this.room.state.players.size);
                }
                
                if (typeof this.room.state.players.forEach === 'function') {
                    console.log("Iterating through players:");
                    this.room.state.players.forEach((player: any, sessionId: string) => {
                        console.log(`Player ${sessionId}:`, player);
                    });
                }
            } catch (e) {
                console.error("Error while inspecting players:", e);
            }
        }
        console.log("=== END DEBUG ===");
    }
    
    onPlayerAdd(callback: (player: PlayerData, sessionId: string) => void): void {
        if (this.room && this.room.state && this.room.state.players) {
            // 添加调试信息
            console.log("Players object type:", typeof this.room.state.players);
            console.log("Players constructor:", this.room.state.players.constructor.name);
            console.log("Players methods:", Object.getOwnPropertyNames(Object.getPrototypeOf(this.room.state.players)));
            
            // 将onAdd作为属性赋值而不是方法调用
            this.room.state.players.onAdd = (player: PlayerData, sessionId: string) => {
                console.log(`Player added: ${sessionId}`);
                callback(player, sessionId);
            };
            
            // 处理已存在的玩家
            if (typeof this.room.state.players.forEach === 'function') {
                this.room.state.players.forEach((player: PlayerData, sessionId: string) => {
                    console.log(`Found existing player: ${sessionId}`);
                    callback(player, sessionId);
                });
            }
        } else {
            console.warn("Cannot set up player add listener: room.state.players is not available");
        }
    }
    
    onPlayerRemove(callback: (player: PlayerData, sessionId: string) => void): void {
        if (this.room && this.room.state && this.room.state.players) {
            // 将onRemove作为属性赋值而不是方法调用
            this.room.state.players.onRemove = (player: PlayerData, sessionId: string) => {
                console.log(`Player removed: ${sessionId}`);
                callback(player, sessionId);
            };
        } else {
            console.warn("Cannot set up player remove listener: room.state.players is not available");
        }
    }
    
    onPlayerMove(callback: (player: PlayerData, sessionId: string) => void): void {
        if (this.room && this.room.state && this.room.state.players) {
            // 保存原始的onAdd回调（如果有）
            const originalOnAdd = this.room.state.players.onAdd;
            
            // 设置新的onAdd监听器
            this.room.state.players.onAdd = (player: any, sessionId: string) => {
                // 调用原始的onAdd回调（如果有）
                if (originalOnAdd && typeof originalOnAdd === 'function') {
                    originalOnAdd(player, sessionId);
                }
                
                // 监听这个玩家的变化
                if (typeof player.onChange === 'function') {
                    player.onChange(() => {
                        callback(player, sessionId);
                    });
                }
            };
            
            // 监听已存在玩家的变化
            if (typeof this.room.state.players.forEach === 'function') {
                this.room.state.players.forEach((player: any, sessionId: string) => {
                    if (typeof player.onChange === 'function') {
                        player.onChange(() => {
                            callback(player, sessionId);
                        });
                    }
                });
            }
        } else {
            console.warn("Cannot set up player move listener: room.state.players is not available");
        }
    }
    
    // 发送移动消息
    sendMove(x: number, y: number, state?: string, direction?: number): void {
        this.sendMessage(MessageType.MOVE, { x, y, state, direction });
    }
    
    // 发送状态变化消息
    sendStateChange(state: string): void {
        this.sendMessage(MessageType.CHANGE_STATE, { state });
    }
    
    // 发送朝向变化消息
    sendDirectionChange(direction: number): void {
        this.sendMessage(MessageType.CHANGE_DIRECTION, { direction });
    }
    
    disconnect(): void {
        if (this.room) {
            this.room.leave();
            this.room = null;
        }
    }
}