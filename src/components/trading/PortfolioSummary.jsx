import React from 'react'
import { useTradingContext } from '../../context/TradingContext'
import { DollarSign, TrendingUp, Activity } from 'lucide-react'

function PortfolioSummary() {
  const { virtualBalance, trades } = useTradingContext()
  
  const totalTrades = trades.length
  const winningTrades = trades.filter(trade => trade.pnl > 0).length
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades * 100).toFixed(1) : 0
  
  const cards = [
    {
      title: 'Virtual Balance',
      value: `$${virtualBalance.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-400',
    },
    {
      title: 'Total Trades',
      value: totalTrades,
      icon: Activity,
      color: 'text-blue-400',
    },
    {
      title: 'Win Rate',
      value: `${winRate}%`,
      icon: TrendingUp,
      color: 'text-purple-400',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <div
            key={index}
            className="p-6 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">{card.title}</p>
                <p className={`text-2xl font-bold ${card.color} mt-1`}>{card.value}</p>
              </div>
              <Icon className={`w-8 h-8 ${card.color}`} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PortfolioSummary