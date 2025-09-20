import React from 'react'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  icon: LucideIcon
  label: string
  count: number
  color: string
  isActive: boolean
  onClick: () => void
}

export default function StatsCard({ 
  icon: Icon, 
  label, 
  count, 
  color, 
  isActive, 
  onClick 
}: StatsCardProps) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-2xl transition-all duration-200 text-left transform hover:scale-105 ${
        isActive 
          ? 'bg-primary text-white shadow-lg' 
          : 'bg-white hover:bg-gray-50 shadow-sm border border-gray-100'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-xl ${
          isActive 
            ? 'bg-white/20' 
            : 'bg-gray-100'
        }`}>
          <Icon 
            className={`w-5 h-5 ${
              isActive ? 'text-white' : color
            }`} 
          />
        </div>
        {isActive && (
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        )}
      </div>
      
      <div className="space-y-1">
        <p className={`text-2xl font-bold ${
          isActive ? 'text-white' : 'text-gray-900'
        }`}>
          {count}
        </p>
        <p className={`text-sm font-medium ${
          isActive ? 'text-white/80' : 'text-gray-600'
        }`}>
          {label}
        </p>
      </div>
    </button>
  )
}