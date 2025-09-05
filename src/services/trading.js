import { StorageService } from './api.js'
import AuthService from './auth.js'

// Advanced Trading Service with enhanced features
export class TradingService {
  static pendingOrders = new Map()
  static listeners = new Set()

  // Order types
  static ORDER_TYPES = {
    MARKET: 'market',
    LIMIT: 'limit',
    STOP_LOSS: 'stop_loss',
    TAKE_PROFIT: 'take_profit'
  }

  // Order status
  static ORDER_STATUS = {
    PENDING: 'pending',
    FILLED: 'filled',
    CANCELLED: 'cancelled',
    EXPIRED: 'expired'
  }

  // Trading strategies
  static STRATEGIES = {
    SCALPING: 'scalping',
    DAY_TRADING: 'day_trading',
    SWING_TRADING: 'swing_trading',
    HODL: 'hodl',
    DCA: 'dca'
  }

  // Execute advanced trade with order types
  static async executeAdvancedTrade(tradeParams) {
    const {
      symbol,
      side, // 'buy' or 'sell'
      quantity,
      orderType,
      price,
      stopLoss,
      takeProfit,
      strategy,
      timeInForce = 'GTC' // Good Till Cancelled
    } = tradeParams

    try {
      // Validate trade parameters
      const validation = this.validateTrade(tradeParams)
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error
        }
      }

      const trade = {
        id: this.generateTradeId(),
        symbol,
        side,
        quantity,
        orderType,
        price,
        stopLoss,
        takeProfit,
        strategy,
        timeInForce,
        status: this.ORDER_STATUS.PENDING,
        timestamp: new Date().toISOString(),
        userId: AuthService.getCurrentUser()?.fid,
        pnl: 0,
        fees: this.calculateFees(quantity, price),
        slippage: 0
      }

      // Handle different order types
      switch (orderType) {
        case this.ORDER_TYPES.MARKET:
          return await this.executeMarketOrder(trade)
        
        case this.ORDER_TYPES.LIMIT:
          return await this.placeLimitOrder(trade)
        
        case this.ORDER_TYPES.STOP_LOSS:
          return await this.placeStopLossOrder(trade)
        
        case this.ORDER_TYPES.TAKE_PROFIT:
          return await this.placeTakeProfitOrder(trade)
        
        default:
          return {
            success: false,
            error: 'Invalid order type'
          }
      }
    } catch (error) {
      console.error('Trade execution failed:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Execute market order immediately
  static async executeMarketOrder(trade) {
    const currentPrice = this.getCurrentPrice(trade.symbol)
    const slippage = this.calculateSlippage(trade.quantity, trade.symbol)
    
    const executionPrice = trade.side === 'buy' 
      ? currentPrice * (1 + slippage)
      : currentPrice * (1 - slippage)

    const executedTrade = {
      ...trade,
      price: executionPrice,
      slippage,
      status: this.ORDER_STATUS.FILLED,
      executedAt: new Date().toISOString()
    }

    // Update user balance
    const tradeValue = trade.quantity * executionPrice
    const user = AuthService.getCurrentUser()
    
    if (trade.side === 'buy' && tradeValue > user.virtualBalance) {
      return {
        success: false,
        error: 'Insufficient balance'
      }
    }

    // Save trade
    this.saveTrade(executedTrade)
    
    // Update user stats
    AuthService.updateUser({
      virtualBalance: trade.side === 'buy' 
        ? user.virtualBalance - tradeValue - executedTrade.fees
        : user.virtualBalance + tradeValue - executedTrade.fees
    })

    // Set up stop loss and take profit if specified
    if (trade.stopLoss) {
      this.setStopLoss(executedTrade, trade.stopLoss)
    }
    
    if (trade.takeProfit) {
      this.setTakeProfit(executedTrade, trade.takeProfit)
    }

    this.notifyListeners('trade_executed', executedTrade)

    return {
      success: true,
      trade: executedTrade
    }
  }

  // Place limit order
  static async placeLimitOrder(trade) {
    this.pendingOrders.set(trade.id, trade)
    this.savePendingOrder(trade)
    
    this.notifyListeners('order_placed', trade)

    return {
      success: true,
      order: trade
    }
  }

  // Place stop loss order
  static async placeStopLossOrder(trade) {
    this.pendingOrders.set(trade.id, trade)
    this.savePendingOrder(trade)
    
    this.notifyListeners('stop_loss_set', trade)

    return {
      success: true,
      order: trade
    }
  }

  // Place take profit order
  static async placeTakeProfitOrder(trade) {
    this.pendingOrders.set(trade.id, trade)
    this.savePendingOrder(trade)
    
    this.notifyListeners('take_profit_set', trade)

    return {
      success: true,
      order: trade
    }
  }

  // Monitor pending orders and execute when conditions are met
  static monitorPendingOrders(currentPrices) {
    this.pendingOrders.forEach((order, orderId) => {
      const currentPrice = currentPrices[order.symbol]
      if (!currentPrice) return

      let shouldExecute = false

      switch (order.orderType) {
        case this.ORDER_TYPES.LIMIT:
          shouldExecute = (order.side === 'buy' && currentPrice <= order.price) ||
                         (order.side === 'sell' && currentPrice >= order.price)
          break

        case this.ORDER_TYPES.STOP_LOSS:
          shouldExecute = (order.side === 'sell' && currentPrice <= order.price) ||
                         (order.side === 'buy' && currentPrice >= order.price)
          break

        case this.ORDER_TYPES.TAKE_PROFIT:
          shouldExecute = (order.side === 'sell' && currentPrice >= order.price) ||
                         (order.side === 'buy' && currentPrice <= order.price)
          break
      }

      if (shouldExecute) {
        this.executePendingOrder(order, currentPrice)
      }
    })
  }

  // Execute pending order
  static executePendingOrder(order, executionPrice) {
    const executedTrade = {
      ...order,
      price: executionPrice,
      status: this.ORDER_STATUS.FILLED,
      executedAt: new Date().toISOString()
    }

    // Remove from pending orders
    this.pendingOrders.delete(order.id)
    this.removePendingOrder(order.id)

    // Save executed trade
    this.saveTrade(executedTrade)

    // Update user balance
    const tradeValue = order.quantity * executionPrice
    const user = AuthService.getCurrentUser()
    
    AuthService.updateUser({
      virtualBalance: order.side === 'buy' 
        ? user.virtualBalance - tradeValue - executedTrade.fees
        : user.virtualBalance + tradeValue - executedTrade.fees
    })

    this.notifyListeners('order_executed', executedTrade)
  }

  // Cancel pending order
  static cancelOrder(orderId) {
    const order = this.pendingOrders.get(orderId)
    if (!order) return false

    order.status = this.ORDER_STATUS.CANCELLED
    order.cancelledAt = new Date().toISOString()

    this.pendingOrders.delete(orderId)
    this.removePendingOrder(orderId)
    this.saveTrade(order)

    this.notifyListeners('order_cancelled', order)
    return true
  }

  // Get trading analytics
  static getAnalytics(trades) {
    if (!trades || trades.length === 0) {
      return {
        totalTrades: 0,
        winRate: 0,
        totalPnL: 0,
        avgWin: 0,
        avgLoss: 0,
        maxDrawdown: 0,
        sharpeRatio: 0,
        profitFactor: 0
      }
    }

    const wins = trades.filter(t => t.pnl > 0)
    const losses = trades.filter(t => t.pnl < 0)
    
    const totalPnL = trades.reduce((sum, t) => sum + t.pnl, 0)
    const winRate = (wins.length / trades.length) * 100
    
    const avgWin = wins.length > 0 ? wins.reduce((sum, t) => sum + t.pnl, 0) / wins.length : 0
    const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((sum, t) => sum + t.pnl, 0) / losses.length) : 0
    
    const profitFactor = avgLoss > 0 ? (avgWin * wins.length) / (avgLoss * losses.length) : 0
    
    // Calculate max drawdown
    let maxDrawdown = 0
    let peak = 0
    let runningPnL = 0
    
    trades.forEach(trade => {
      runningPnL += trade.pnl
      if (runningPnL > peak) {
        peak = runningPnL
      }
      const drawdown = peak - runningPnL
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown
      }
    })

    return {
      totalTrades: trades.length,
      winRate: Math.round(winRate * 100) / 100,
      totalPnL: Math.round(totalPnL * 100) / 100,
      avgWin: Math.round(avgWin * 100) / 100,
      avgLoss: Math.round(avgLoss * 100) / 100,
      maxDrawdown: Math.round(maxDrawdown * 100) / 100,
      profitFactor: Math.round(profitFactor * 100) / 100,
      sharpeRatio: this.calculateSharpeRatio(trades)
    }
  }

  // Calculate Sharpe ratio
  static calculateSharpeRatio(trades) {
    if (trades.length < 2) return 0

    const returns = trades.map(t => t.pnl)
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length
    
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
    const stdDev = Math.sqrt(variance)
    
    return stdDev > 0 ? (avgReturn / stdDev) : 0
  }

  // Validate trade parameters
  static validateTrade(params) {
    const { symbol, side, quantity, price, orderType } = params

    if (!symbol || !side || !quantity) {
      return { isValid: false, error: 'Missing required parameters' }
    }

    if (quantity <= 0) {
      return { isValid: false, error: 'Quantity must be positive' }
    }

    if (orderType !== this.ORDER_TYPES.MARKET && (!price || price <= 0)) {
      return { isValid: false, error: 'Price must be positive for non-market orders' }
    }

    if (!['buy', 'sell'].includes(side)) {
      return { isValid: false, error: 'Side must be buy or sell' }
    }

    return { isValid: true }
  }

  // Helper methods
  static generateTradeId() {
    return `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  static getCurrentPrice(symbol) {
    // This would connect to real market data in production
    const mockPrices = {
      'BTC': 42150 + (Math.random() - 0.5) * 1000,
      'ETH': 2580 + (Math.random() - 0.5) * 100,
      'BASE': 1.85 + (Math.random() - 0.5) * 0.1,
      'SOL': 98.50 + (Math.random() - 0.5) * 10
    }
    return mockPrices[symbol] || 100
  }

  static calculateSlippage(quantity, symbol) {
    // Simulate slippage based on order size
    const baseSlippage = 0.001 // 0.1%
    const sizeMultiplier = Math.min(quantity / 1000, 0.01) // Max 1% additional slippage
    return baseSlippage + sizeMultiplier
  }

  static calculateFees(quantity, price) {
    const feeRate = 0.001 // 0.1% fee
    return quantity * price * feeRate
  }

  static saveTrade(trade) {
    const trades = StorageService.getTrades()
    trades.unshift(trade)
    StorageService.saveTrades(trades)
  }

  static savePendingOrder(order) {
    const orders = this.getPendingOrders()
    orders.push(order)
    localStorage.setItem('flashtrade_pending_orders', JSON.stringify(orders))
  }

  static removePendingOrder(orderId) {
    const orders = this.getPendingOrders().filter(o => o.id !== orderId)
    localStorage.setItem('flashtrade_pending_orders', JSON.stringify(orders))
  }

  static getPendingOrders() {
    try {
      const data = localStorage.getItem('flashtrade_pending_orders')
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  static setStopLoss(trade, stopLossPrice) {
    const stopLossOrder = {
      id: this.generateTradeId(),
      parentTradeId: trade.id,
      symbol: trade.symbol,
      side: trade.side === 'buy' ? 'sell' : 'buy',
      quantity: trade.quantity,
      orderType: this.ORDER_TYPES.STOP_LOSS,
      price: stopLossPrice,
      status: this.ORDER_STATUS.PENDING,
      timestamp: new Date().toISOString()
    }

    this.pendingOrders.set(stopLossOrder.id, stopLossOrder)
    this.savePendingOrder(stopLossOrder)
  }

  static setTakeProfit(trade, takeProfitPrice) {
    const takeProfitOrder = {
      id: this.generateTradeId(),
      parentTradeId: trade.id,
      symbol: trade.symbol,
      side: trade.side === 'buy' ? 'sell' : 'buy',
      quantity: trade.quantity,
      orderType: this.ORDER_TYPES.TAKE_PROFIT,
      price: takeProfitPrice,
      status: this.ORDER_STATUS.PENDING,
      timestamp: new Date().toISOString()
    }

    this.pendingOrders.set(takeProfitOrder.id, takeProfitOrder)
    this.savePendingOrder(takeProfitOrder)
  }

  // Event listeners
  static subscribe(callback) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  static notifyListeners(event, data) {
    this.listeners.forEach(callback => callback(event, data))
  }
}

export default TradingService
