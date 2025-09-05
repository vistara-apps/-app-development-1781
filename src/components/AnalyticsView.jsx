import React from 'react'
import { useTradingContext } from '../context/TradingContext'
import TradeHistory from './analytics/TradeHistory'
import PerformanceMetrics from './analytics/PerformanceMetrics'
import ProfitLossChart from './analytics/ProfitLossChart'

function AnalyticsView({ isConnected }) {
  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center p-8 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
          <p className="text-purple-200">Connect your wallet to view trading analytics</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PerformanceMetrics />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfitLossChart />
        <TradeHistory />
      </div>
    </div>
  )
}

export default AnalyticsView