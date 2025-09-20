'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'match';
  timestamp: string;
}

export default function ChatPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [match, setMatch] = useState<any>(null);

  useEffect(() => {
    loadChatData();
  }, [params.id]);

  const loadChatData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5002/api/chat/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        setMatch(data.match);
      } else {
        // Use mock data if API fails
        setMatch(getMockMatch());
        setMessages(getMockMessages());
      }
    } catch (error) {
      console.error('Error loading chat:', error);
      // Use mock data
      setMatch(getMockMatch());
      setMessages(getMockMessages());
    } finally {
      setLoading(false);
    }
  };

  const getMockMatch = () => ({
    id: params.id,
    name: 'Alex',
    type: 'person',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b5c0804?w=400&h=400&fit=crop',
    description: 'Love exploring the city and trying new restaurants!'
  });

  const getMockMessages = (): Message[] => [
    {
      id: '1',
      content: 'Hey! Great to match with you!',
      sender: 'match',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      content: 'Hi! Nice to meet you too!',
      sender: 'user',
      timestamp: '2 hours ago'
    },
    {
      id: '3',
      content: 'Want to grab coffee sometime?',
      sender: 'match',
      timestamp: '1 hour ago'
    }
  ];

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5002/api/chat/${params.id}/message`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage
        }),
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={match?.image || 'https://images.unsplash.com/photo-1494790108755-2616b5c0804?w=400&h=400&fit=crop'}
                  alt={match?.name || 'Match'}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{match?.name || 'Match'}</h1>
                <p className="text-sm text-gray-600">
                  {match?.type === 'apartment' ? '🏠 Apartment' : 
                   match?.type === 'person' ? '👥 Person' : '📍 Local Spot'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'user' ? 'text-gray-300' : 'text-gray-500'
              }`}>
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}