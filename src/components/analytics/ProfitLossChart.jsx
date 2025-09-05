import React from 'react'
import { useTradingContext } from '../../context/TradingContext'
import { TrendingUp, TrendingDown } from 'lucide-react'

function ProfitLossChart() {
  const { trades, virtualBalance } = useTradingContext()
  
  // Calculate cumulative P&L over time
  const initialBalance = 10000
  let cumulativeBalance = initialBalance
  
  const balanceHistory = [{ time: 0, balance: initialBalance, change: 0 }]
  
  trades.slice().reverse().forEach((trade, index) => {
    const balanceChange = trade.type === 'buy' ? -trade.value : trade.value
    cumulativeBalance += balanceChange
    
    balanceHistory.push({
      time: index + 1,
      balance: cumulativeBalance,
      change: cumulativeBalance - initialBalance,
    })
  })
  
  const totalReturn = virtualBalance - initialBalance
  const totalReturnPercent = (totalReturn / initialBalance) * 100
  
  // Chart dimensions
  const chartWidth = 400
  const chartHeight = 200
  const padding = 20
  
  if (balanceHistory.length < 2) {
    return (
      <div className="p-6 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Portfolio Performance</h3>
        <div className="h-48 flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-purple-300 mx-auto mb-3" />
            <p className="text-purple-200">Start trading to see your performance</p>
          </div>
        </div>
      </div>
    )
  }
  
  const balances = balanceHistory.map(point => point.balance)
  const minBalance = Math.min(...balances)
  const maxBalance = Math.max(...balances)
  const balanceRange = maxBalance - minBalance || 1000
  
  // Generate SVG path
  const pathData = balanceHistory.map((point, index) => {
    const x = padding + (index / (balanceHistory.length - 1)) * (chartWidth - 2 * padding)
    const y = padding + ((maxBalance - point.balance) / balanceRange) * (chartHeight - 2 * padding)
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')
  
  const isPositive = totalReturn >= 0

  return (
    <div className="p-6 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Portfolio Performance</h3>
        <div className="text-right">
          <div className="flex items-center gap-2">
            {isPositive ? (
              <TrendingUp className="w-5 h-5 text-green-400" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-400" />
            )}
            <span className={`font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? '+' : ''}${totalReturn.toLocaleString()}
            </span>
          </div>
          <p className={`text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{totalReturnPercent.toFixed(2)}%
          </p>
        </div>
      </div>
      
      <div className="relative h-48 bg-white/5 rounded-lg overflow-hidden">
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="absolute inset-0"
        >
          <defs>
            <linearGradient id="balanceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop 
                offset="0%" 
                stopColor={isPositive ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)"} 
                stopOpacity="0.3" 
              />
              <stop 
                offset="100%" 
                stopColor={isPositive ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)"} 
                stopOpacity="0.05" 
              />
            </linearGradient>
          </defs>
          
          {/* Baseline at initial balance */}
          <line
            x1={padding}
            y1={padding + ((maxBalance - initialBalance) / balanceRange) * (chartHeight - 2 * padding)}
            x2={chartWidth - padding}
            y2={padding + ((maxBalance - initialBalance) / balanceRange) * (chartHeight - 2 * padding)}
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="1"
            strokeDasharray="4,4"
          />
          
          {/* Performance line */}
          <path
            d={pathData}
            fill="none"
            stroke={isPositive ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {balanceHistory.map((point, index) => {
            const x = padding + (index / (balanceHistory.length - 1)) * (chartWidth - 2 * padding)
            const y = padding + ((maxBalance - point.balance) / balanceRange) * (chartHeight - 2 * padding)
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill={point.balance >= initialBalance ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)"}
                className="opacity-80"
              />
            )
          })}
        </svg>
      </div>
      
      <div className="mt-4 flex justify-between text-sm">
        <span className="text-purple-200">Initial: ${initialBalance.toLocaleString()}</span>
        <span className="text-white">Current: ${virtualBalance.toLocaleString()}</span>
      </div>
    </div>
  )
}

export default ProfitLossChart