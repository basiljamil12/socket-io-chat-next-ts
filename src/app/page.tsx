"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const [userCount, setUserCount] = useState<number>(1);
  useEffect(() => {
    const initSocket = async () => {
      await fetch("/api/socket"); // wait for server init

      const socket = io(undefined, {
        path: "/api/socketio",
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("✅ Connected to Socket.IO");
      });

      socket.on("message", (msg: string) => {
        console.log("📥 Listening for messages:", msg);
        setMessages((prev) => [...prev, msg]);
      });
      socket.on("userCount", (count: number) => {
        console.log("👥 Online users:", count);
        setUserCount(count);
      });
      socket.onAny((event, ...args) => {
        console.log("📡 Received event:", event, args);
      });
      socket.on("disconnect", () => {
        console.log("❌ Disconnected from Socket.IO");
      });
    };

    initSocket();

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (socketRef.current && input.trim()) {
      socketRef.current.emit("message", input);
      setInput("");
    }
  };

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">Socket.IO Chat</h1>
      <h2 className="text-sm text-white font-bold mb-2">
        👥 Online Users: {userCount}
      </h2>
      <div className="border p-4 h-64 overflow-y-scroll mb-4 bg-gray-100">
        {messages.map((msg, idx) => (
          <div key={idx} className="text-sm mb-1 text-black">
            {msg}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type a message"
        className="border p-2 mr-2 "
      />
      <button
        onClick={sendMessage}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Send
      </button>
    </main>
  );
}
