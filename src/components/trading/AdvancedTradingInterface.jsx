import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, AlertTriangle, Target, Shield, Clock } from 'lucide-react'
import { useTradingContext } from '../../context/TradingContext'
import TradingService from '../../services/trading.js'

function AdvancedTradingInterface() {
  const { selectedAsset, marketData, virtualBalance } = useTradingContext()
  const [orderType, setOrderType] = useState('market')
  const [side, setSide] = useState('buy')
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')
  const [stopLoss, setStopLoss] = useState('')
  const [takeProfit, setTakeProfit] = useState('')
  const [strategy, setStrategy] = useState('day_trading')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const currentPrice = marketData[selectedAsset]?.price || 0
  const estimatedValue = quantity && price ? parseFloat(quantity) * parseFloat(price) : 0
  const estimatedFees = estimatedValue * 0.001 // 0.1% fee

  useEffect(() => {
    // Auto-fill price for limit orders with current market price
    if (orderType === 'limit' && !price) {
      setPrice(currentPrice.toString())
    }
  }, [orderType, currentPrice, price])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      const tradeParams = {
        symbol: selectedAsset,
        side,
        quantity: parseFloat(quantity),
        orderType,
        price: orderType === 'market' ? currentPrice : parseFloat(price),
        stopLoss: stopLoss ? parseFloat(stopLoss) : null,
        takeProfit: takeProfit ? parseFloat(takeProfit) : null,
        strategy
      }

      const result = await TradingService.executeAdvancedTrade(tradeParams)

      if (result.success) {
        setSuccess(
          orderType === 'market' 
            ? `${side.toUpperCase()} order executed successfully!`
            : `${orderType.toUpperCase()} order placed successfully!`
        )
        
        // Reset form
        setQuantity('')
        setPrice('')
        setStopLoss('')
        setTakeProfit('')
      } else {
        setError(result.error || 'Trade execution failed')
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const calculateStopLossPercentage = () => {
    if (!stopLoss || !price) return 0
    const basePrice = orderType === 'market' ? currentPrice : parseFloat(price)
    return Math.abs(((parseFloat(stopLoss) - basePrice) / basePrice) * 100)
  }

  const calculateTakeProfitPercentage = () => {
    if (!takeProfit || !price) return 0
    const basePrice = orderType === 'market' ? currentPrice : parseFloat(price)
    return Math.abs(((parseFloat(takeProfit) - basePrice) / basePrice) * 100)
  }

  const isFormValid = () => {
    if (!quantity || parseFloat(quantity) <= 0) return false
    if (orderType !== 'market' && (!price || parseFloat(price) <= 0)) return false
    if (side === 'buy' && estimatedValue + estimatedFees > virtualBalance) return false
    return true
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Advanced Trading</h3>
        <div className="flex items-center gap-2 text-sm text-purple-200">
          <Clock className="w-4 h-4" />
          <span>Real-time execution</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Order Type Selection */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            Order Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'market', label: 'Market', icon: TrendingUp },
              { value: 'limit', label: 'Limit', icon: Target }
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setOrderType(value)}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                  orderType === value
                    ? 'bg-purple-500 border-purple-400 text-white'
                    : 'bg-white/5 border-white/20 text-purple-200 hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Side Selection */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            Side
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSide('buy')}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                side === 'buy'
                  ? 'bg-green-500 border-green-400 text-white'
                  : 'bg-white/5 border-white/20 text-purple-200 hover:bg-white/10'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Buy
            </button>
            <button
              type="button"
              onClick={() => setSide('sell')}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                side === 'sell'
                  ? 'bg-red-500 border-red-400 text-white'
                  : 'bg-white/5 border-white/20 text-purple-200 hover:bg-white/10'
              }`}
            >
              <TrendingDown className="w-4 h-4" />
              Sell
            </button>
          </div>
        </div>

        {/* Quantity Input */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            Quantity
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="0.00"
            step="0.001"
            min="0"
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        {/* Price Input (for limit orders) */}
        {orderType === 'limit' && (
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">
              Limit Price
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder={currentPrice.toString()}
              step="0.01"
              min="0"
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <p className="text-xs text-purple-300 mt-1">
              Current market price: ${currentPrice.toLocaleString()}
            </p>
          </div>
        )}

        {/* Risk Management */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-purple-200 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Risk Management
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Stop Loss */}
            <div>
              <label className="block text-xs text-purple-300 mb-1">
                Stop Loss
              </label>
              <input
                type="number"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                placeholder="Optional"
                step="0.01"
                min="0"
                className="w-full p-2 bg-white/10 border border-white/20 rounded text-white placeholder-purple-400 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              {stopLoss && (
                <p className="text-xs text-red-300 mt-1">
                  -{calculateStopLossPercentage().toFixed(2)}% risk
                </p>
              )}
            </div>

            {/* Take Profit */}
            <div>
              <label className="block text-xs text-purple-300 mb-1">
                Take Profit
              </label>
              <input
                type="number"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                placeholder="Optional"
                step="0.01"
                min="0"
                className="w-full p-2 bg-white/10 border border-white/20 rounded text-white placeholder-purple-400 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              {takeProfit && (
                <p className="text-xs text-green-300 mt-1">
                  +{calculateTakeProfitPercentage().toFixed(2)}% target
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Strategy Selection */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            Trading Strategy
          </label>
          <select
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="scalping">Scalping</option>
            <option value="day_trading">Day Trading</option>
            <option value="swing_trading">Swing Trading</option>
            <option value="hodl">HODL</option>
            <option value="dca">Dollar Cost Average</option>
          </select>
        </div>

        {/* Order Summary */}
        {quantity && (
          <div className="bg-white/5 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-medium text-purple-200">Order Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-purple-300">
                <span>Estimated Value:</span>
                <span>${estimatedValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-purple-300">
                <span>Estimated Fees:</span>
                <span>${estimatedFees.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white font-medium border-t border-white/20 pt-2">
                <span>Total Cost:</span>
                <span>${(estimatedValue + estimatedFees).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Error/Success Messages */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-200">
            <Target className="w-4 h-4" />
            {success}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid() || isLoading}
          className={`w-full p-4 rounded-lg font-semibold transition-all ${
            side === 'buy'
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-red-500 hover:bg-red-600 text-white'
          } ${
            !isFormValid() || isLoading
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:scale-105'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            `${side.toUpperCase()} ${selectedAsset} ${
              orderType === 'market' ? '(Market)' : '(Limit)'
            }`
          )}
        </button>
      </form>
    </div>
  )
}

export default AdvancedTradingInterface
