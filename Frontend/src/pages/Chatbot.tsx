import React from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import type { ChatbotMessage } from '../types';

export function Chatbot() {
  const [messages, setMessages] = React.useState([
    {
      id: '1',
      content: "Hello! I'm EcoBot, your sustainable living assistant. How can I help you today?",
      timestamp: new Date().toISOString(),
      type: 'bot'
    }
  ] as ChatbotMessage[]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatbotMessage = {
      id: Date.now().toString(),
      content: input,
      timestamp: new Date().toISOString(),
      type: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: input })
      });

      const data = await response.json();

      const botMessage: ChatbotMessage = {
        id: (Date.now() + 1).toString(),
        content: data.reply,
        timestamp: new Date().toISOString(),
        type: 'bot'
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching chatbot response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('recycling') || input.includes('recycle')) {
      return 'Recycling is crucial for environmental sustainability. Here are some tips:\n\n1. Sort your waste properly\n2. Clean containers before recycling\n3. Check local recycling guidelines\n4. Reduce contamination\n5. Consider composting organic waste';
    }
    
    if (input.includes('energy') || input.includes('electricity')) {
      return 'To reduce energy consumption:\n\n1. Use LED bulbs\n2. Unplug unused devices\n3. Use natural light when possible\n4. Install a programmable thermostat\n5. Consider solar panels';
    }
    
    if (input.includes('water') || input.includes('save water')) {
      return 'Water conservation tips:\n\n1. Fix leaky faucets\n2. Take shorter showers\n3. Install water-efficient fixtures\n4. Collect rainwater for plants\n5. Run full loads of laundry';
    }
    
    return 'I can help you with information about recycling, energy conservation, water saving, and other eco-friendly practices. What would you like to know more about?';
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow h-[calc(100vh-12rem)] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center space-x-3">
          <Bot className="h-8 w-8 text-green-600" />
          <div>
            <h2 className="font-semibold text-gray-900">EcoBot</h2>
            <p className="text-sm text-gray-500">Your sustainable living assistant</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div className="flex items-start space-x-2 max-w-[80%]">
                {message.type === 'bot' && (
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-green-600" />
                  </div>
                )}
                <div
                  className={`rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="whitespace-pre-line">{message.content}</p>
                  <span className="text-xs opacity-75 mt-1 block">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                {message.type === 'user' && (
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-green-600" />
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-green-600" />
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Ask about sustainable living..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 py-2 px-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
            >
              <Send className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}