import React from 'react'
import { useTradingContext } from '../../context/TradingContext'
import { TrendingUp, TrendingDown, Clock } from 'lucide-react'

function TradeHistory() {
  const { trades } = useTradingContext()

  if (trades.length === 0) {
    return (
      <div className="p-6 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Trade History</h3>
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-purple-300 mx-auto mb-3" />
          <p className="text-purple-200">No trades yet</p>
          <p className="text-purple-300 text-sm mt-1">Start trading to see your history here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
      <h3 className="text-lg font-semibold text-white mb-4">Trade History</h3>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {trades.slice(0, 10).map((trade) => {
          const isBuy = trade.type === 'buy'
          const date = new Date(trade.timestamp).toLocaleDateString()
          const time = new Date(trade.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
          
          return (
            <div
              key={trade.id}
              className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    isBuy ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    {isBuy ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${
                        isBuy ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {isBuy ? 'BUY' : 'SELL'}
                      </span>
                      <span className="text-white font-medium">{trade.symbol}</span>
                    </div>
                    <p className="text-purple-200 text-xs">{date} at {time}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-white font-semibold">
                    {trade.quantity} @ ${trade.price.toLocaleString()}
                  </p>
                  <p className="text-purple-200 text-sm">
                    ${trade.value.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
        
        {trades.length > 10 && (
          <div className="text-center pt-3">
            <p className="text-purple-300 text-sm">
              Showing latest 10 trades ({trades.length} total)
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TradeHistory