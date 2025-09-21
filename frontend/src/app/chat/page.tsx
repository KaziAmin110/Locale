"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Users, Home, MapPin } from "lucide-react";
import { ApiService } from "@/lib/api";
import LoadingSpinner from "../components/LoadingSpinner";
import ChatWindow from "./components/ChatWindow";
import Header from "../components/Header";
import type { Conversation, Match } from "@/lib/api";

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'conversations' | 'matches'>('conversations');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load conversations
      try {
        const convResponse = await fetch('/api/chat/conversations', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        if (convResponse.ok) {
          const convData = await convResponse.json();
          if (convData.success) {
            setConversations(convData.conversations || []);
          }
        }
      } catch (error) {
        console.error('Failed to load conversations:', error);
      }

      // Load matches for starting new conversations
      try {
        const matchesResponse = await ApiService.getMatches();
        if (matchesResponse.success) {
          setMatches(matchesResponse.matches || []);
        }
      } catch (error) {
        console.error('Failed to load matches:', error);
      }
    } catch (error) {
      console.error('Failed to load chat data:', error);
    } finally {
      setLoading(false);
    }
  };

  const startConversation = async (matchId: string, matchType: string) => {
    try {
      const response = await fetch('/api/chat/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          user_id: matchId,
          match_type: matchType
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSelectedConversation(data.conversation_id);
          setActiveTab('conversations');
          loadData(); // Reload to get new conversation
        }
      }
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  };

  const getMatchIcon = (type: string) => {
    switch (type) {
      case 'apartment': return <Home size={16} />;
      case 'person': return <Users size={16} />;
      case 'spot': return <MapPin size={16} />;
      default: return <MessageCircle size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <div className="container max-w-6xl px-4 pt-6 mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">
            {conversations.length > 0 
              ? `You have ${conversations.length} active conversation${conversations.length !== 1 ? 's' : ''}`
              : 'Start a conversation with your matches!'
            }
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('conversations')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'conversations'
                ? 'bg-primary text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm border border-gray-200'
            }`}
          >
            <MessageCircle size={20} className="inline mr-2" />
            Conversations ({conversations.length})
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'matches'
                ? 'bg-primary text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm border border-gray-200'
            }`}
          >
            <Users size={20} className="inline mr-2" />
            Start Chat ({matches.length})
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations/Matches List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {activeTab === 'conversations' ? (
                <>
                  {conversations.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <MessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
                      <p>No conversations yet</p>
                      <p className="text-sm">Swipe right on people to start chatting!</p>
                    </div>
                  ) : (
                    <div className="max-h-96 overflow-y-auto">
                      {conversations.map((conversation) => (
                        <button
                          key={conversation.conversation_id}
                          onClick={() => setSelectedConversation(conversation.conversation_id)}
                          className={`w-full p-4 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                            selectedConversation === conversation.conversation_id ? 'bg-primary/5 border-primary/20' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
                              {conversation.other_user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {conversation.other_user.name}
                              </h3>
                              <p className="text-sm text-gray-500 truncate">
                                {conversation.last_message || 'Start your conversation!'}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {matches.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <Users size={48} className="mx-auto mb-4 text-gray-300" />
                      <p>No matches yet</p>
                      <p className="text-sm">Start swiping to find matches!</p>
                    </div>
                  ) : (
                    <div className="max-h-96 overflow-y-auto">
                      {matches.map((match) => (
                        <button
                          key={match.id}
                          onClick={() => startConversation(match.id, match.type)}
                          className="w-full p-4 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white">
                              {getMatchIcon(match.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {match.name}
                              </h3>
                              <p className="text-sm text-gray-500 capitalize">
                                {match.type} • Click to start chatting
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-96">
              {selectedConversation ? (
                <ChatWindow
                  conversationId={selectedConversation}
                  onBack={() => setSelectedConversation(null)}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <MessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>Select a conversation to start chatting</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
