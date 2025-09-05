import React, { useState } from 'react'
import { useTradingContext } from '../context/TradingContext'
import MarketOverview from './trading/MarketOverview'
import TradingInterface from './trading/TradingInterface'
import AdvancedTradingInterface from './trading/AdvancedTradingInterface'
import PriceChart from './trading/PriceChart'
import PortfolioSummary from './trading/PortfolioSummary'
import { Settings, Zap } from 'lucide-react'

function TradingView({ isConnected }) {
  const { virtualBalance } = useTradingContext()
  const [useAdvancedInterface, setUseAdvancedInterface] = useState(false)

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center p-8 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
          <p className="text-purple-200">Connect your wallet to start trading simulation</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PortfolioSummary />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PriceChart />
          
          {/* Trading Interface Toggle */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Trading Interface</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setUseAdvancedInterface(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  !useAdvancedInterface
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-purple-200 hover:bg-white/20'
                }`}
              >
                <Settings className="w-4 h-4" />
                Simple
              </button>
              <button
                onClick={() => setUseAdvancedInterface(true)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  useAdvancedInterface
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-purple-200 hover:bg-white/20'
                }`}
              >
                <Zap className="w-4 h-4" />
                Advanced
              </button>
            </div>
          </div>
          
          {/* Render appropriate trading interface */}
          {useAdvancedInterface ? <AdvancedTradingInterface /> : <TradingInterface />}
        </div>
        
        <div className="space-y-6">
          <MarketOverview />
        </div>
      </div>
    </div>
  )
}

export default TradingView
