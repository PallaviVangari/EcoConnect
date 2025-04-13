import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { APIURL } from "../Utilities/Apiurl";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface ChatProps {
  sellerId: string;
  productName: string;
  productId: string;
  senderId: string;
  onBack: () => void;
}

interface Message {
  senderId: string;
  receiverId: string;
  message: string;
  productId: string;
  sellerId: string;
  timestamp: string;
}

const Chat: React.FC<ChatProps> = ({ sellerId, productName, senderId, productId, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buyerId, setBuyerId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [useWebSocket, setUseWebSocket] = useState(true);

  // Reference to the StompJS client
  const stompClient = useRef<Client | null>(null);
  const reconnectAttempts = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 3;

  // Initialize WebSocket connection
  useEffect(() => {
    // Don't attempt to connect if we've already decided to use HTTP
    if (!useWebSocket) return;

    // Create and configure the STOMP client
    const client = new Client({
      webSocketFactory: () => new SockJS(`${APIURL}/server`),
      debug: (str) => {
        console.log("STOMP: ", str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    // Define connection handlers
    client.onConnect = () => {
      console.log("Connected to WebSocket");
      setConnected(true);
      reconnectAttempts.current = 0;

      // Subscribe to the topic for this specific product
      client.subscribe(`/topic/messages/${productId}`, (message) => {
        if (message.body) {
          const receivedMsg = JSON.parse(message.body);
          setMessages((prevMessages) => {
            // Check if message already exists in our array to prevent duplicates
            if (!prevMessages.some(msg =>
                msg.timestamp === receivedMsg.timestamp &&
                msg.senderId === receivedMsg.senderId &&
                msg.message === receivedMsg.message)) {
              return [...prevMessages, receivedMsg];
            }
            return prevMessages;
          });
        }
      });
    };

    client.onStompError = (frame) => {
      console.error('STOMP error', frame);
      setError("Connection error. Using HTTP fallback.");
      handleConnectionFailure();
    };

    client.onWebSocketClose = () => {
      console.log("WebSocket connection closed");
      setConnected(false);
      reconnectAttempts.current++;

      if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
        console.log("Max reconnection attempts reached, falling back to HTTP");
        handleConnectionFailure();
        // Prevent further automatic reconnection attempts
        client.deactivate();
      }
    };

    const handleConnectionFailure = () => {
      setConnected(false);
      setUseWebSocket(false);
      if (stompClient.current) {
        stompClient.current.deactivate();
        stompClient.current = null;
      }
      setError("WebSocket connection failed. Using HTTP fallback mode.");
    };

    // Catch any activation errors
    try {
      client.activate();
      stompClient.current = client;
    } catch(e) {
      console.error("Error activating STOMP client:", e);
      handleConnectionFailure();
    }

    // Clean up on unmount
    return () => {
      if (client && client.active) {
        try {
          client.deactivate();
        } catch (e) {
          console.error("Error deactivating client:", e);
        }
      }
    };
  }, [productId, APIURL, useWebSocket]);

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // First fetch the messages to determine the buyer
        const response = await axios.get(`${APIURL}/api/marketplace/messages/seller/${sellerId}/product/${productId}`);

        if (response.data && response.data.length > 0) {
          // Assuming the buyer is the one sending the message (not the seller)
          const buyerMessage = response.data.find((msg: Message) => msg.senderId !== sellerId);
          if (buyerMessage) {
            setBuyerId(buyerMessage.senderId);
          } else if (senderId !== sellerId) {
            // If no messages from buyer yet but current user is not the seller, they are the buyer
            setBuyerId(senderId);
          }
        } else if (senderId !== sellerId) {
          // If no messages yet and current user is not the seller, they are the buyer
          setBuyerId(senderId);
        }

        setMessages(response.data || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setError("Failed to load messages. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [sellerId, productId, senderId]);

  // Poll for new messages when using HTTP fallback mode
  useEffect(() => {
    if (useWebSocket || loading) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await axios.get(`${APIURL}/api/marketplace/messages/seller/${sellerId}/product/${productId}`);
        setMessages(response.data || []);
      } catch (error) {
        console.error("Error polling messages:", error);
      }
    }, 1000); // Poll every 1 seconds

    return () => clearInterval(pollInterval);
  }, [useWebSocket, loading, sellerId, productId, APIURL]);

  // Send a message
  const sendMessage = useCallback(() => {
    if (!input.trim()) return;

    const receiverId = senderId === sellerId ? buyerId : sellerId;

    if (!receiverId) {
      setError("Cannot determine message recipient. Please try again later.");
      return;
    }

    const newMessage = {
      senderId,
      receiverId,
      productId,
      sellerId,
      message: input.trim(),
      timestamp: new Date().toISOString(),
    };

    // Clear input first for better UX
    setInput("");

    if (useWebSocket && connected && stompClient.current && stompClient.current.active) {
      // Try to send via WebSocket
      try {
        stompClient.current.publish({
          destination: '/app/chat.sendMessage',
          body: JSON.stringify(newMessage)
        });

        // Optimistically add message to UI
        setMessages(prev => [...prev, newMessage]);
      } catch (error) {
        console.error("Error sending message via WebSocket:", error);
        // Fallback to HTTP
        sendMessageHttp(newMessage);
      }
    } else {
      // Use HTTP method
      sendMessageHttp(newMessage);
    }
  }, [input, senderId, sellerId, buyerId, productId, connected, useWebSocket]);

  // HTTP method to send messages
  const sendMessageHttp = async (newMessage: Message) => {
    try {
      const response = await axios.post(`${APIURL}/api/marketplace/messages`, newMessage);
      // Update messages if the response data is different than what we added optimistically
      if (JSON.stringify(response.data) !== JSON.stringify(newMessage)) {
        setMessages((prev) => [...prev, response.data]);
      }
    } catch (error) {
      console.error("Error sending message via HTTP:", error);
      setError("Failed to send message. Please try again.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const messagesEnd = document.getElementById("messagesEnd");
    if (messagesEnd) {
      messagesEnd.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div style={{ padding: "1rem" }}>
      <button onClick={onBack} style={{ marginBottom: "1rem" }}>← Back</button>
      <h2>Chat about <strong>{productName}</strong></h2>

      {useWebSocket ? (
        connected ? (
          <div style={{ color: 'green', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
            ● Live Chat Connected
          </div>
        ) : (
          <div style={{ color: 'orange', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
            ○ Connecting to Live Chat...
          </div>
        )
      ) : (
        <div style={{ color: 'blue', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
          ● Using HTTP mode (messages refresh every 5 seconds)
        </div>
      )}

      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      <div style={{
        maxHeight: "300px",
        overflowY: "auto",
        marginBottom: "1rem",
        padding: "0.5rem",
        border: "1px solid #e1e1e1",
        borderRadius: "5px"
      }}>
        {loading ? (
          <p>Loading messages...</p>
        ) : messages.length === 0 ? (
          <p>No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              style={{
                textAlign: msg.senderId === senderId ? "right" : "left",
                marginBottom: "0.8rem",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  backgroundColor: msg.senderId === senderId ? "#DCF8C6" : "#F1F0F0",
                  padding: "0.5rem 1rem",
                  borderRadius: "10px",
                  maxWidth: "70%",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                }}
              >
                <p style={{ margin: 0 }}>{msg.message}</p>
                <small style={{
                  fontSize: "0.7rem",
                  color: "#666",
                  marginTop: "0.2rem",
                  display: "block",
                  textAlign: "right"
                }}>
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "No timestamp"}
                </small>
              </div>
            </div>
          ))
        )}
        <div id="messagesEnd"></div>
      </div>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ccc"
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#4285f4",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
          disabled={!input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;