"use client";

import { useEffect, useState, useRef } from "react";

export default function HomePage() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    fetch("/api/socket"); // Trigger WebSocket server setup

    const socket = new WebSocket(`ws://${window.location.host}`);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = () => {
    if (socketRef.current?.readyState === WebSocket.OPEN && input.trim()) {
      socketRef.current.send(input);
      setInput("");
    }
  };

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">WebSocket Chat</h1>
      <div className="border p-4 h-64 overflow-y-scroll mb-4 bg-gray-100">
        {messages.map((msg, idx) => (
          <div key={idx} className="text-sm mb-1">
            {msg}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type a message"
        className="border p-2 mr-2"
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
