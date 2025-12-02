import { Server } from "colyseus";
import { createServer } from "http";
import express from "express";
import cors from "cors";
import { CabinRoom } from "./rooms/CabinRoom";

// Create express app
const app = express();
app.use(cors());
app.use(express.json());

// Simple health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// Create HTTP server
const httpServer = createServer(app);

// Create Colyseus server
const gameServer = new Server({
    server: httpServer
});

// Define our room handler
gameServer.define('cabin_room', CabinRoom);

// Start the server
const port = Number(process.env.PORT) || 2567;
gameServer.listen(port).then(() => {
    console.log(`🚀 Pixel Cabin Server started on http://localhost:${port}`);
    console.log(`📊 Health check available at http://localhost:${port}/health`);
}).catch(err => {
    console.error("Failed to start server:", err);
});