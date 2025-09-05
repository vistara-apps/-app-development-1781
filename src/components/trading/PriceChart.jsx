import React from 'react'
import { useTradingContext } from '../../context/TradingContext'

function PriceChart() {
  const { selectedAsset, marketData, priceHistory } = useTradingContext()
  const currentPrice = marketData[selectedAsset]?.price || 0
  const history = priceHistory[selectedAsset] || []
  
  // Calculate chart dimensions and scaling
  const chartWidth = 600
  const chartHeight = 200
  const padding = 20
  
  if (history.length === 0) {
    return (
      <div className="p-6 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">{selectedAsset} Price Chart</h3>
        <div className="h-48 flex items-center justify-center">
          <p className="text-purple-200">Loading chart data...</p>
        </div>
      </div>
    )
  }
  
  const prices = history.map(point => point.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const priceRange = maxPrice - minPrice || 1
  
  // Generate SVG path
  const pathData = history.map((point, index) => {
    const x = padding + (index / (history.length - 1)) * (chartWidth - 2 * padding)
    const y = padding + ((maxPrice - point.price) / priceRange) * (chartHeight - 2 * padding)
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')
  
  // Generate area path for gradient fill
  const areaData = `${pathData} L ${chartWidth - padding} ${chartHeight - padding} L ${padding} ${chartHeight - padding} Z`

  return (
    <div className="p-6 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{selectedAsset} Price Chart</h3>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">${currentPrice.toLocaleString()}</p>
          <p className={`text-sm ${marketData[selectedAsset]?.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {marketData[selectedAsset]?.change >= 0 ? '+' : ''}
            {marketData[selectedAsset]?.change.toFixed(2)}%
          </p>
        </div>
      </div>
      
      <div className="relative h-48 trading-chart rounded-lg overflow-hidden">
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="absolute inset-0"
        >
          <defs>
            <linearGradient id={`gradient-${selectedAsset}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(124, 58, 237)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(124, 58, 237)" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          
          {/* Area fill */}
          <path
            d={areaData}
            fill={`url(#gradient-${selectedAsset})`}
          />
          
          {/* Price line */}
          <path
            d={pathData}
            fill="none"
            stroke="rgb(124, 58, 237)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {history.map((point, index) => {
            const x = padding + (index / (history.length - 1)) * (chartWidth - 2 * padding)
            const y = padding + ((maxPrice - point.price) / priceRange) * (chartHeight - 2 * padding)
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill="rgb(124, 58, 237)"
                className="opacity-60"
              />
            )
          })}
        </svg>
      </div>
    </div>
  )
}

export default PriceChart