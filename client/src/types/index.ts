// Game-related types

export interface PlayerData {
    x: number;
    y: number;
    name: string;
    direction: number; // 0: down, 1: left, 2: right, 3: up
}

export interface NetworkMessage {
    type: string;
    data: any;
}