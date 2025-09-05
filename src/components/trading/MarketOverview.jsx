import React from 'react'
import { useTradingContext } from '../../context/TradingContext'
import { TrendingUp, TrendingDown } from 'lucide-react'

function MarketOverview() {
  const { marketData, selectedAsset, setSelectedAsset } = useTradingContext()

  return (
    <div className="p-6 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
      <h3 className="text-lg font-semibold text-white mb-4">Market Overview</h3>
      
      <div className="space-y-3">
        {Object.entries(marketData).map(([symbol, data]) => {
          const isSelected = symbol === selectedAsset
          const isPositive = data.change >= 0
          
          return (
            <button
              key={symbol}
              onClick={() => setSelectedAsset(symbol)}
              className={`w-full p-3 rounded-lg transition-all duration-200 text-left ${
                isSelected 
                  ? 'bg-white/20 border border-white/30' 
                  : 'bg-white/5 hover:bg-white/10 border border-transparent'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{symbol}</span>
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <p className="text-xs text-purple-200">Vol: {data.volume}</p>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-white">${data.price.toLocaleString()}</p>
                  <p className={`text-xs ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? '+' : ''}{data.change.toFixed(2)}%
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default MarketOverview