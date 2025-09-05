import React from 'react'
import { TrendingUp, BarChart3, BookOpen } from 'lucide-react'

const tabs = [
  { id: 'trade', label: 'Trade', icon: TrendingUp },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'learn', label: 'Learn', icon: BookOpen },
]

function TabNavigation({ activeTab, setActiveTab }) {
  return (
    <nav className="flex flex-wrap gap-1 p-1 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 flex-1 sm:flex-none ${
              isActive
                ? 'bg-white text-purple-700 shadow-lg'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

export default TabNavigation