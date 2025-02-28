import React from 'react';
import { Search, Send, Image, Paperclip } from 'lucide-react';
import type { Message, User } from '../types';

export function Messages() {
  const [selectedChat, setSelectedChat] = React.useState<string | null>('1');
  const [messageInput, setMessageInput] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      senderId: '1',
      receiverId: 'current-user',
      content: "Hi! I noticed you're interested in sustainable gardening.",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      type: 'text',
      status: 'read'
    },
    {
      id: '2',
      senderId: '1',
      receiverId: 'current-user',
      content: 'Are you interested in joining our community garden project?',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      type: 'text',
      status: 'delivered'
    }
  ]);

  const [chats] = React.useState([
    {
      id: '1',
      user: {
        id: '1',
        name: 'Emma Wilson',
        email: 'emma@example.com',
        avatar: 'https://i.pravatar.cc/150?u=emma',
        followers: 1542,
        following: 891
      },
      lastMessage: {
        id: '1',
        senderId: '1',
        receiverId: 'current-user',
        content: 'Are you interested in joining our community garden project?',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        type: 'text',
        status: 'delivered'
      },
      unread: 2
    },
    {
      id: '2',
      user: {
        id: '2',
        name: 'David Chen',
        email: 'david@example.com',
        avatar: 'https://i.pravatar.cc/150?u=david',
        followers: 2103,
        following: 764
      },
      lastMessage: {
        id: '2',
        senderId: 'current-user',
        receiverId: '2',
        content: 'Thanks for the eco-friendly product recommendations!',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        type: 'text',
        status: 'read'
      },
      unread: 0
    }
  ]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    // Create new message
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'current-user',
      receiverId: selectedChat || '1',
      content: messageInput,
      timestamp: new Date().toISOString(),
      type: 'text',
      status: 'sent'
    };
    
    // Add message to messages list
    setMessages([...messages, newMessage]);
    
    // Clear input
    setMessageInput('');
    
    // Simulate response after 1 second
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        senderId: selectedChat || '1',
        receiverId: 'current-user',
        content: getAutoResponse(messageInput),
        timestamp: new Date().toISOString(),
        type: 'text',
        status: 'delivered'
      };
      
      setMessages(prev => [...prev, responseMessage]);
    }, 1000);
  };

  // Generate automatic response based on user message
  const getAutoResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! How can I help you with sustainable living today?";
    }
    
    if (lowerMessage.includes('garden') || lowerMessage.includes('gardening')) {
      return "Yes, our community garden project is starting next week! Would you like to join us?";
    }
    
    if (lowerMessage.includes('recycling') || lowerMessage.includes('recycle')) {
      return "I have some great tips for effective recycling. Would you like me to share them with you?";
    }
    
    if (lowerMessage.includes('event') || lowerMessage.includes('workshop')) {
      return "We have several eco-workshops coming up this month. I can send you the details if you're interested!";
    }
    
    return "Thanks for your message! I'll get back to you soon with more information about our eco-initiatives.";
  };

  const filteredChats = chats.filter(chat =>
    chat.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-lg shadow h-[calc(100vh-12rem)] flex">
        {/* Chat List */}
        <div className="w-1/3 border-r">
          <div className="p-4 border-b">
            <div className="relative">
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="overflow-y-auto h-[calc(100%-5rem)]">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`w-full p-4 flex items-start space-x-3 hover:bg-gray-50 ${
                  selectedChat === chat.id ? 'bg-gray-50' : ''
                }`}
              >
                <img
                  src={chat.user.avatar}
                  alt={`${chat.user.name}'s avatar`}
                  className="h-12 w-12 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {chat.user.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {new Date(chat.lastMessage.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {chat.lastMessage.content}
                  </p>
                </div>
                {chat.unread > 0 && (
                  <span className="bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {chat.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        {selectedChat ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center space-x-3">
              <img
                src={chats.find(c => c.id === selectedChat)?.user.avatar}
                alt="User avatar"
                className="h-10 w-10 rounded-full"
              />
              <div>
                <h3 className="font-semibold text-gray-900">
                  {chats.find(c => c.id === selectedChat)?.user.name}
                </h3>
                <p className="text-sm text-gray-500">Online</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === 'current-user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.senderId === 'current-user'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p>{message.content}</p>
                    <span className="text-xs opacity-75 mt-1 block">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-center space-x-4">
                <button className="text-gray-400 hover:text-gray-600 active:scale-95 transition-transform">
                  <Image className="h-6 w-6" />
                </button>
                <button className="text-gray-400 hover:text-gray-600 active:scale-95 transition-transform">
                  <Paperclip className="h-6 w-6" />
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 py-2 px-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 active:scale-95 transition-transform"
                >
                  <Send className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Select a conversation
              </h3>
              <p className="text-gray-500">
                Choose a chat from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}