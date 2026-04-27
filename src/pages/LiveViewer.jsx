import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./LiveViewer.css";

const SOCKET_URL = "https://swafy-backend.onrender.com";

export default function LiveViewer() {
  const { roomCode } = useParams();
  const [params] = useSearchParams();
  const token = params.get("vt") || params.get("at");

  const socket = useRef(null);
  const chatEndRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  // ✅ Socket
  useEffect(() => {
    if (!roomCode || !token) return;

    socket.current = io(SOCKET_URL);

    socket.current.emit("join-room", {
      roomCode,
      userName: "Viewer",
    });

    socket.current.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.current?.off("receive-message");
      socket.current?.disconnect();
    };
  }, [roomCode, token]);

  // ✅ Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Send
  const sendMessage = () => {
    if (!chatInput.trim()) return;

    const localMsg = {
      user: "Viewer",
      text: chatInput,
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, localMsg]);

    socket.current.emit("send-message", {
      roomCode,
      message: chatInput,
    });

    setChatInput("");
  };

  return (
    <div className="lv-page">
      <header className="lv-header">
        Salut à tous, bienvenue dans une nouvelle réunion — <strong>enjoy !</strong>
      </header>

      <div className="lv-main">
        <div className="lv-video-zone">
          <div className="lv-main-video">🎥 Vidéo principale</div>
        </div>

        {/* ✅ CHAT */}
        <aside className="lv-chat">
          <div className="chat-header">Chat Room</div>

          {/* ✅ MESSAGES */}
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className="msg other">
                <strong>{m.user}</strong> {m.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* ✅ INPUT */}
          <div className="chat-input">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Écrire un message…"
            />
            <button onClick={sendMessage}>➤</button>
          </div>
        </aside>
      </div>
    </div>
  );
}