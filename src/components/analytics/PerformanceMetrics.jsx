import React from 'react'
import { useTradingContext } from '../../context/TradingContext'
import { TrendingUp, TrendingDown, Activity, DollarSign, Target, Percent } from 'lucide-react'

function PerformanceMetrics() {
  const { trades, virtualBalance } = useTradingContext()
  
  const totalTrades = trades.length
  const buyTrades = trades.filter(trade => trade.type === 'buy')
  const sellTrades = trades.filter(trade => trade.type === 'sell')
  
  const totalVolume = trades.reduce((sum, trade) => sum + trade.value, 0)
  const winningTrades = trades.filter(trade => trade.pnl > 0).length
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades * 100) : 0
  
  const initialBalance = 10000
  const totalReturn = ((virtualBalance - initialBalance) / initialBalance * 100)
  
  const avgTradeSize = totalTrades > 0 ? totalVolume / totalTrades : 0

  const metrics = [
    {
      title: 'Total Trades',
      value: totalTrades,
      icon: Activity,
      color: 'text-blue-400',
      change: null,
    },
    {
      title: 'Win Rate',
      value: `${winRate.toFixed(1)}%`,
      icon: Target,
      color: winRate >= 50 ? 'text-green-400' : 'text-red-400',
      change: winRate >= 50 ? 'positive' : 'negative',
    },
    {
      title: 'Total Return',
      value: `${totalReturn >= 0 ? '+' : ''}${totalReturn.toFixed(2)}%`,
      icon: TrendingUp,
      color: totalReturn >= 0 ? 'text-green-400' : 'text-red-400',
      change: totalReturn >= 0 ? 'positive' : 'negative',
    },
    {
      title: 'Total Volume',
      value: `$${totalVolume.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-purple-400',
      change: null,
    },
    {
      title: 'Avg Trade Size',
      value: `$${avgTradeSize.toLocaleString()}`,
      icon: Percent,
      color: 'text-indigo-400',
      change: null,
    },
    {
      title: 'Buy/Sell Ratio',
      value: `${buyTrades.length}/${sellTrades.length}`,
      icon: Activity,
      color: 'text-yellow-400',
      change: null,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        return (
          <div
            key={index}
            className="p-6 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">{metric.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className={`text-xl font-bold ${metric.color}`}>{metric.value}</p>
                  {metric.change === 'positive' && (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  )}
                  {metric.change === 'negative' && (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                </div>
              </div>
              <Icon className={`w-8 h-8 ${metric.color}`} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PerformanceMetrics