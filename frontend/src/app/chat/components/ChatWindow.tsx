'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Send } from 'lucide-react'
import MessageBubble from './MessageBubble'
import Button from '../../components/Button'
import Avatar from '../../components/Avatar'
import type { Conversation, Message } from '@/lib/api'

interface ChatWindowProps {
  conversationId: string
  onBack: () => void
}

const ChatWindow = ({ conversationId, onBack }: ChatWindowProps) => {
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadConversation()
  }, [conversationId])

  useEffect(() => {
    scrollToBottom()
  }, [conversation?.messages])

  const loadConversation = async () => {
    try {
      // Load conversation from API
      // const response = await ApiService.getConversation(conversationId)
      // setConversation(response.conversation)
    } catch (error) {
      console.error('Failed to load conversation:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return

    setSending(true)
    try {
      // Send message via API
      // await ApiService.sendMessage({
      //   conversation_id: conversationId,
      //   content: newMessage
      // })
      
      setNewMessage('')
      loadConversation() // Reload to get new message
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white">
        <button 
          onClick={onBack}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        
        <Avatar
          src={conversation.other_user.image}
          alt={conversation.other_user.name}
          size="md"
        />
        
        <div>
          <h3 className="font-semibold text-gray-900">
            {conversation.other_user.name}
          </h3>
          <p className="text-sm text-gray-500">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages.map((message) => (
          <MessageBubble 
            key={message.id} 
            message={message}
            isOwn={message.sender_id === 'current-user-id'} // Replace with actual user ID
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            className="px-4"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ChatWindow