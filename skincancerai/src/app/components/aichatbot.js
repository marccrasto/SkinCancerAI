"use client";
import { useState } from "react";
import Image from "next/image";

export default function AIChatbot() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm Ruby, your skin cancer AI assistant. What would you like to know?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });

    const data = await response.json();
    setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    setLoading(false);
  };

  return (
    <section id="chatbot" className="bg-white">
    <div style={{ maxWidth: "900px", margin: "40px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h2 style={{ marginBottom: "16px", fontSize: "28px", fontWeight: "bold", color: "#333", textAlign: "center" }}>Ask Our AI Chatbot Ruby!</h2>
      <div style={{ background: "#e8e8e8", borderRadius: "16px", padding: "20px", height: "400px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-end", gap: "10px", flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
            {msg.role === "assistant" ? (
              <img
                src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
                alt="Ruby"
                style={{ width: "40px", height: "40px", borderRadius: "50%", background: "white", padding: "4px" }}
              />
            ) : (
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#a0a0d0", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold", fontSize: "12px", flexShrink: 0 }}>
                You
              </div>
            )}
            <div style={{
              background: msg.role === "user" ? "#7b7fd4" : "white",
              color: msg.role === "user" ? "white" : "black",
              padding: "10px 14px",
              borderRadius: "16px",
              maxWidth: "75%",
              lineHeight: "1.5"
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: "10px" }}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
              alt="Ruby"
              style={{ width: "40px", height: "40px", borderRadius: "50%", background: "white", padding: "4px" }}
            />
            <div style={{ background: "white", padding: "10px 14px", borderRadius: "16px" }}>Thinking...</div>
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
        <input
          style={{ flex: 1, padding: "10px 14px", borderRadius: "24px", border: "1px solid #ccc", outline: "none", fontSize: "14px" }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about skin cancer..."
        />
        <button
          onClick={sendMessage}
          style={{ padding: "10px 20px", borderRadius: "24px", background: "#7b7fd4", color: "white", border: "none", cursor: "pointer", fontSize: "14px" }}
        >
          Send
        </button>
      </div>
    </div>
    </section>
  );
}