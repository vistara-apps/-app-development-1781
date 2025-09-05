import React, { useState } from 'react'
import { useTradingContext } from '../../context/TradingContext'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

function TradingInterface() {
  const { selectedAsset, marketData, virtualBalance, executeTrade } = useTradingContext()
  const [tradeType, setTradeType] = useState('buy')
  const [quantity, setQuantity] = useState('')
  const [orderType, setOrderType] = useState('market')
  
  const currentPrice = marketData[selectedAsset]?.price || 0
  const tradeValue = quantity ? parseFloat(quantity) * currentPrice : 0
  const canAfford = tradeType === 'buy' ? tradeValue <= virtualBalance : true

  const handleTrade = () => {
    if (!quantity || parseFloat(quantity) <= 0) return
    if (tradeType === 'buy' && !canAfford) return
    
    executeTrade({
      symbol: selectedAsset,
      type: tradeType,
      quantity: parseFloat(quantity),
      price: currentPrice,
    })
    
    setQuantity('')
  }

  return (
    <div className="p-6 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
      <h3 className="text-lg font-semibold text-white mb-4">Trade {selectedAsset}</h3>
      
      <div className="space-y-4">
        {/* Trade Type Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setTradeType('buy')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
              tradeType === 'buy'
                ? 'bg-green-500 text-white'
                : 'bg-white/10 text-purple-200 hover:bg-white/20'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Buy
          </button>
          <button
            onClick={() => setTradeType('sell')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
              tradeType === 'sell'
                ? 'bg-red-500 text-white'
                : 'bg-white/10 text-purple-200 hover:bg-white/20'
            }`}
          >
            <TrendingDown className="w-4 h-4 inline mr-2" />
            Sell
          </button>
        </div>

        {/* Order Type */}
        <div>
          <label className="block text-purple-200 text-sm font-medium mb-2">Order Type</label>
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="market">Market Order</option>
            <option value="limit">Limit Order</option>
          </select>
        </div>

        {/* Quantity Input */}
        <div>
          <label className="block text-purple-200 text-sm font-medium mb-2">Quantity</label>
          <div className="relative">
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0.00"
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <span className="absolute right-3 top-3 text-purple-300 text-sm">
              {selectedAsset}
            </span>
          </div>
        </div>

        {/* Price Display */}
        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="flex justify-between items-center">
            <span className="text-purple-200 text-sm">Current Price:</span>
            <span className="text-white font-semibold">${currentPrice.toLocaleString()}</span>
          </div>
          
          {quantity && (
            <div className="flex justify-between items-center mt-2">
              <span className="text-purple-200 text-sm">Total Value:</span>
              <span className="text-white font-semibold">${tradeValue.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Available Balance */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-purple-200">Available Balance:</span>
          <span className="text-white font-medium">
            <DollarSign className="w-4 h-4 inline mr-1" />
            {virtualBalance.toLocaleString()}
          </span>
        </div>

        {/* Trade Button */}
        <button
          onClick={handleTrade}
          disabled={!quantity || parseFloat(quantity) <= 0 || (tradeType === 'buy' && !canAfford)}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
            !quantity || parseFloat(quantity) <= 0 || (tradeType === 'buy' && !canAfford)
              ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
              : tradeType === 'buy'
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedAsset}
        </button>

        {tradeType === 'buy' && !canAfford && quantity && (
          <p className="text-red-400 text-sm text-center">Insufficient balance</p>
        )}
      </div>
    </div>
  )
}

export default TradingInterface