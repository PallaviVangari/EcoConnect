import React, { useState } from "react";
import axios from "axios";

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { sender: "user" | "bot"; text: string }[]
  >([]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/chat", {
        message: input,
      });
      const botMessage = { sender: "bot", text: response.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error contacting chatbot." },
      ]);
    }
  };

  return (
    <div>
      {/* Floating Button */}
      <button
        className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-700 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "Close Chat" : "Chat with me"}
      </button>

      {/* Popup Chatbox */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 bg-white rounded-lg shadow-lg border flex flex-col">
          <div className="p-2 border-b font-semibold text-center bg-green-600 text-white">
            Eco Chat
          </div>
          <div className="p-2 overflow-y-auto h-60 space-y-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded text-sm w-fit max-w-[80%] ${
                  msg.sender === "user"
                    ? "ml-auto bg-green-100"
                    : "mr-auto bg-gray-200"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex p-2 border-t">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 p-1 border rounded mr-2 text-sm"
              placeholder="Ask something..."
            />
            <button
              onClick={handleSend}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
