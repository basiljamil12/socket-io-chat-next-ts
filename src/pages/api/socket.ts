import { NextApiRequest } from "next";
import { Server } from "ws";

let wss: Server | null = null;

export default function handler(req: NextApiRequest, res: any) {
  if (!res.socket.server.wss) {
    console.log("Initializing WebSocket server...");

    wss = new Server({ server: res.socket.server });

    wss.on("connection", function connection(ws: any) {
      console.log("Client connected");

      ws.on("message", function incoming(message: any) {
        console.log("Received:", message.toString());

        // Echo the message to all connected clients
        wss?.clients.forEach((client: any) => {
          if (client.readyState === 1) {
            client.send(message.toString());
          }
        });
      });

      ws.on("close", () => {
        console.log("Client disconnected");
      });
    });

    res.socket.server.wss = wss;
  } else {
    console.log("WebSocket server already running");
  }

  res.end();
}
