import React from 'react'
import { useTradingContext } from '../context/TradingContext'
import MarketOverview from './trading/MarketOverview'
import TradingInterface from './trading/TradingInterface'
import PriceChart from './trading/PriceChart'
import PortfolioSummary from './trading/PortfolioSummary'

function TradingView({ isConnected }) {
  const { virtualBalance } = useTradingContext()

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
          <TradingInterface />
        </div>
        
        <div className="space-y-6">
          <MarketOverview />
        </div>
      </div>
    </div>
  )
}

export default TradingView