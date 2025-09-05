import React from 'react'
import { Activity, Wallet } from 'lucide-react'

function Header({ isConnected, setIsConnected }) {
  const handleConnect = () => {
    setIsConnected(!isConnected)
  }

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">FlashTrade Sim</h1>
          <p className="text-purple-200 text-sm">Learn, Practice, Master Trading</p>
        </div>
      </div>
      
      <button
        onClick={handleConnect}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          isConnected 
            ? 'bg-green-500 hover:bg-green-600 text-white' 
            : 'bg-white hover:bg-gray-100 text-gray-900'
        }`}
      >
        <Wallet className="w-4 h-4" />
        {isConnected ? 'Connected' : 'Connect Wallet'}
      </button>
    </header>
  )
}

export default Header