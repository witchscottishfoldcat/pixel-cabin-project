import { Schema, type, MapSchema } from "@colyseus/schema";

// Player schema - defines player state
export class Player extends Schema {
    @type("number") x: number = 0;
    @type("number") y: number = 0;
    @type("string") name: string = "Player";
    @type("number") direction: number = 0; // 0: down, 1: left, 2: right, 3: up
}

// Main room state
export class CabinRoomState extends Schema {
    @type({ map: Player }) players = new MapSchema<Player>();
    @type("number") mapWidth: number = 800;
    @type("number") mapHeight: number = 600;
}