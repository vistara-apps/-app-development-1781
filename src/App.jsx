import React, { useState, useEffect } from 'react'
import { TradingProvider } from './context/TradingContext'
import Header from './components/Header'
import TabNavigation from './components/TabNavigation'
import TradingView from './components/TradingView'
import AnalyticsView from './components/AnalyticsView'
import LearningView from './components/LearningView'

function App() {
  const [activeTab, setActiveTab] = useState('trade')
  const [isConnected, setIsConnected] = useState(false)

  return (
    <TradingProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <Header isConnected={isConnected} setIsConnected={setIsConnected} />
          
          <div className="mt-6">
            <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <div className="mt-6">
              {activeTab === 'trade' && <TradingView isConnected={isConnected} />}
              {activeTab === 'analytics' && <AnalyticsView isConnected={isConnected} />}
              {activeTab === 'learn' && <LearningView />}
            </div>
          </div>
        </div>
      </div>
    </TradingProvider>
  )
}

export default App