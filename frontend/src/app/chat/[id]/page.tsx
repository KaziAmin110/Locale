'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  timestamp: string;
}

interface ChatData {
  conversation_id: string;
  other_user: {
    id: string;
    name: string;
    image?: string;
  };
  messages: Message[];
}

const ChatPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChat();
  }, [params.id]);

  const loadChat = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5002/api/chat/conversation/${params.id}`);
      const data = await response.json();
      
      if (data.success) {
        setChatData(data.conversation);
      }
    } catch (error) {
      console.error('Error loading chat:', error);
      // Fallback to mock data
      setChatData({
        conversation_id: params.id,
        other_user: {
          id: params.id,
          name: 'Sarah Johnson',
          image: '/api/placeholder/100/100'
        },
        messages: [
          {
            id: '1',
            sender_id: params.id,
            content: 'Hey! I saw we matched on CityMate. Are you still looking for a roommate?',
            timestamp: '2024-01-15T10:30:00Z'
          },
          {
            id: '2',
            sender_id: 'current_user',
            content: 'Yes! I\'m really interested in the apartment you mentioned.',
            timestamp: '2024-01-15T10:35:00Z'
          },
          {
            id: '3',
            sender_id: params.id,
            content: 'Great! Would you like to schedule a viewing this weekend?',
            timestamp: '2024-01-15T10:40:00Z'
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !chatData) return;

    const message = {
      conversation_id: chatData.conversation_id,
      content: newMessage.trim()
    };

    try {
      const response = await fetch('http://localhost:5002/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (response.ok) {
        // Add message to local state
        const newMsg: Message = {
          id: Date.now().toString(),
          sender_id: 'current_user',
          content: newMessage.trim(),
          timestamp: new Date().toISOString()
        };
        
        setChatData(prev => prev ? {
          ...prev,
          messages: [...prev.messages, newMsg]
        } : null);
        
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!chatData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Chat not found</h2>
          <p className="text-gray-600 mb-4">This conversation doesn't exist or you don't have access to it.</p>
          <a href="/matches" className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg">
            Back to Matches
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              ←
            </button>
            <div className="flex items-center">
              {chatData.other_user.image ? (
                <img 
                  src={chatData.other_user.image} 
                  alt={chatData.other_user.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 flex items-center justify-center">
                  <span className="text-gray-600 font-medium">
                    {chatData.other_user.name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{chatData.other_user.name}</h1>
                <p className="text-sm text-gray-500">Online</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-4">
            {chatData.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_id === 'current_user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender_id === 'current_user'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender_id === 'current_user' ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
