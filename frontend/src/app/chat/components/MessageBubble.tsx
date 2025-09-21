import type { Message } from '@/lib/api'

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
}

const MessageBubble = ({ message, isOwn }: MessageBubbleProps) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
          isOwn
            ? 'bg-primary text-white rounded-br-md'
            : 'bg-gray-100 text-gray-900 rounded-bl-md'
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <p className={`text-xs mt-1 ${
          isOwn ? 'text-white/70' : 'text-gray-500'
        }`}>
          {new Date(message.created_at || message.timestamp || Date.now()).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
    </div>
  )
}

export default MessageBubble