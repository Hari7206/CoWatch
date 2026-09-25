import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import app from "./src/app.js";
import { connectToDB } from "./src/db/database.js";
import { socketAuth } from "./src/utils/socketAuth.js";
import { registerSocketHandlers } from "./src/handlers/socketHandlers.js";

const PORT = process.env.PORT || 4000;

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
    },
});

io.use(socketAuth);

io.on("connection", (socket) => {
    console.log(`Socket connected: user=${socket.userId} socketId=${socket.id}`);
    registerSocketHandlers(io, socket);
});
await connectToDB();

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});