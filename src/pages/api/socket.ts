import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as IOServer } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

let io: IOServer | null = null;

export default function handler(req: NextApiRequest, res: any) {
  if (!res.socket.server.io) {
    console.log("🔌 Initializing Socket.IO server...");

    const httpServer: NetServer = res.socket.server as any;
    io = new IOServer(httpServer, {
      path: "/api/socketio",
      addTrailingSlash: false,
    });

    io.on("connection", (socket) => {
      console.log("✅ Client connected:", socket.id);
      io?.emit("userCount", io.engine.clientsCount);

      socket.on("message", (msg) => {
        console.log("💬 Message received:", msg);
        // Broadcast to all clients
        io?.emit("message", String(msg));
      });

      socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
        io?.emit("userCount", io.engine.clientsCount);
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("⚡️ Socket.IO already running");
  }

  res.end();
}
