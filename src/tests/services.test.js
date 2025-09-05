// Comprehensive test suite for FlashTrade Sim services
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { FarcasterService, MarketDataService, StorageService } from '../services/api.js'
import AuthService from '../services/auth.js'
import TradingService from '../services/trading.js'

// Mock localStorage for testing
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

describe('StorageService', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
    localStorageMock.removeItem.mockClear()
  })

  it('should save and retrieve user data', () => {
    const userData = {
      fid: 12345,
      username: 'testuser',
      virtualBalance: 10000
    }

    // Test saving
    const saveResult = StorageService.saveUserData(userData)
    expect(saveResult).toBe(true)
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'flashtrade_user_data',
      JSON.stringify(userData)
    )

    // Test retrieving
    localStorageMock.getItem.mockReturnValue(JSON.stringify(userData))
    const retrievedData = StorageService.getUserData()
    expect(retrievedData).toEqual(userData)
  })

  it('should save and retrieve trades', () => {
    const trades = [
      {
        id: 'trade_1',
        symbol: 'BTC',
        side: 'buy',
        quantity: 0.1,
        price: 42000
      }
    ]

    StorageService.saveTrades(trades)
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'flashtrade_trades',
      JSON.stringify(trades)
    )

    localStorageMock.getItem.mockReturnValue(JSON.stringify(trades))
    const retrievedTrades = StorageService.getTrades()
    expect(retrievedTrades).toEqual(trades)
  })

  it('should handle storage errors gracefully', () => {
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('Storage quota exceeded')
    })

    const result = StorageService.saveUserData({ test: 'data' })
    expect(result).toBe(false)
  })
})

describe('AuthService', () => {
  beforeEach(() => {
    AuthService.currentUser = null
    AuthService.listeners.clear()
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
  })

  it('should authenticate user successfully', async () => {
    const result = await AuthService.authenticateWithFarcaster()
    
    expect(result.success).toBe(true)
    expect(result.user).toBeDefined()
    expect(result.user.fid).toBeDefined()
    expect(result.user.username).toBeDefined()
    expect(result.user.virtualBalance).toBe(10000)
  })

  it('should update user statistics', () => {
    // Set up a mock user
    AuthService.currentUser = {
      fid: 12345,
      totalTrades: 5,
      totalPnL: 100,
      wins: 3
    }

    const tradeResult = { pnl: 50, isWin: true }
    const updateResult = AuthService.updateTradingStats(tradeResult)

    expect(updateResult).toBe(true)
    expect(AuthService.currentUser.totalTrades).toBe(6)
    expect(AuthService.currentUser.totalPnL).toBe(150)
    expect(AuthService.currentUser.wins).toBe(4)
    expect(AuthService.currentUser.winRate).toBe(66.66666666666667)
  })

  it('should generate achievements based on user stats', () => {
    AuthService.currentUser = {
      totalTrades: 15,
      totalPnL: 500,
      winRate: 70,
      connectedAt: new Date().toISOString()
    }

    const achievements = AuthService.getUserAchievements()
    
    expect(achievements).toContainEqual(
      expect.objectContaining({
        id: 'first_trade',
        title: 'First Trade'
      })
    )
    
    expect(achievements).toContainEqual(
      expect.objectContaining({
        id: 'active_trader',
        title: 'Active Trader'
      })
    )
    
    expect(achievements).toContainEqual(
      expect.objectContaining({
        id: 'profitable',
        title: 'Profitable Trader'
      })
    )
  })

  it('should export and import user data', () => {
    const mockUser = { fid: 12345, username: 'testuser' }
    const mockTrades = [{ id: 'trade_1', symbol: 'BTC' }]
    const mockProgress = { module1: true }

    AuthService.currentUser = mockUser
    localStorageMock.getItem
      .mockReturnValueOnce(JSON.stringify(mockTrades))
      .mockReturnValueOnce(JSON.stringify(mockProgress))

    const exportedData = AuthService.exportUserData()
    
    expect(exportedData).toEqual({
      user: mockUser,
      trades: mockTrades,
      learningProgress: mockProgress,
      exportedAt: expect.any(String)
    })

    const importResult = AuthService.importUserData(exportedData)
    expect(importResult).toBe(true)
  })
})

describe('TradingService', () => {
  beforeEach(() => {
    TradingService.pendingOrders.clear()
    AuthService.currentUser = {
      fid: 12345,
      virtualBalance: 10000
    }
  })

  it('should validate trade parameters correctly', () => {
    const validTrade = {
      symbol: 'BTC',
      side: 'buy',
      quantity: 0.1,
      orderType: 'market'
    }

    const validation = TradingService.validateTrade(validTrade)
    expect(validation.isValid).toBe(true)

    const invalidTrade = {
      symbol: 'BTC',
      side: 'invalid',
      quantity: -1
    }

    const invalidValidation = TradingService.validateTrade(invalidTrade)
    expect(invalidValidation.isValid).toBe(false)
    expect(invalidValidation.error).toBeDefined()
  })

  it('should execute market orders successfully', async () => {
    const tradeParams = {
      symbol: 'BTC',
      side: 'buy',
      quantity: 0.1,
      orderType: 'market'
    }

    const result = await TradingService.executeAdvancedTrade(tradeParams)
    
    expect(result.success).toBe(true)
    expect(result.trade).toBeDefined()
    expect(result.trade.status).toBe('filled')
    expect(result.trade.symbol).toBe('BTC')
    expect(result.trade.side).toBe('buy')
    expect(result.trade.quantity).toBe(0.1)
  })

  it('should place limit orders correctly', async () => {
    const tradeParams = {
      symbol: 'BTC',
      side: 'buy',
      quantity: 0.1,
      orderType: 'limit',
      price: 40000
    }

    const result = await TradingService.executeAdvancedTrade(tradeParams)
    
    expect(result.success).toBe(true)
    expect(result.order).toBeDefined()
    expect(result.order.status).toBe('pending')
    expect(TradingService.pendingOrders.has(result.order.id)).toBe(true)
  })

  it('should calculate trading analytics correctly', () => {
    const trades = [
      { pnl: 100 },
      { pnl: -50 },
      { pnl: 200 },
      { pnl: -25 },
      { pnl: 75 }
    ]

    const analytics = TradingService.getAnalytics(trades)
    
    expect(analytics.totalTrades).toBe(5)
    expect(analytics.totalPnL).toBe(300)
    expect(analytics.winRate).toBe(60) // 3 wins out of 5 trades
    expect(analytics.avgWin).toBe(125) // (100 + 200 + 75) / 3
    expect(analytics.avgLoss).toBe(37.5) // (50 + 25) / 2
  })

  it('should handle insufficient balance errors', async () => {
    AuthService.currentUser.virtualBalance = 100 // Low balance

    const tradeParams = {
      symbol: 'BTC',
      side: 'buy',
      quantity: 1, // Large quantity
      orderType: 'market'
    }

    const result = await TradingService.executeAdvancedTrade(tradeParams)
    
    expect(result.success).toBe(false)
    expect(result.error).toBe('Insufficient balance')
  })

  it('should monitor and execute pending orders', () => {
    // Create a pending limit order
    const order = {
      id: 'test_order',
      symbol: 'BTC',
      side: 'buy',
      quantity: 0.1,
      orderType: 'limit',
      price: 41000,
      status: 'pending'
    }

    TradingService.pendingOrders.set(order.id, order)

    // Mock current prices that would trigger the order
    const currentPrices = { BTC: 40500 } // Below limit price for buy order

    TradingService.monitorPendingOrders(currentPrices)

    // Order should be executed and removed from pending
    expect(TradingService.pendingOrders.has(order.id)).toBe(false)
  })

  it('should cancel pending orders', () => {
    const order = {
      id: 'test_order',
      symbol: 'BTC',
      side: 'buy',
      quantity: 0.1,
      orderType: 'limit',
      price: 41000,
      status: 'pending'
    }

    TradingService.pendingOrders.set(order.id, order)
    
    const cancelResult = TradingService.cancelOrder(order.id)
    
    expect(cancelResult).toBe(true)
    expect(TradingService.pendingOrders.has(order.id)).toBe(false)
  })
})

describe('MarketDataService', () => {
  it('should generate historical data', async () => {
    const history = await MarketDataService.getHistoricalData('BTC', '1h', 50)
    
    expect(history).toHaveLength(51) // 50 + 1 for current
    expect(history[0]).toHaveProperty('timestamp')
    expect(history[0]).toHaveProperty('price')
    expect(history[0]).toHaveProperty('volume')
  })

  it('should return simulated prices for known symbols', () => {
    const btcPrice = MarketDataService.getSimulatedPrice('BTC')
    const ethPrice = MarketDataService.getSimulatedPrice('ETH')
    const unknownPrice = MarketDataService.getSimulatedPrice('UNKNOWN')
    
    expect(btcPrice).toBe(42150)
    expect(ethPrice).toBe(2580)
    expect(unknownPrice).toBe(100) // Default price
  })
})

describe('Integration Tests', () => {
  it('should complete full trading workflow', async () => {
    // 1. Authenticate user
    const authResult = await AuthService.authenticateWithFarcaster()
    expect(authResult.success).toBe(true)

    // 2. Execute a trade
    const tradeParams = {
      symbol: 'BTC',
      side: 'buy',
      quantity: 0.1,
      orderType: 'market'
    }

    const tradeResult = await TradingService.executeAdvancedTrade(tradeParams)
    expect(tradeResult.success).toBe(true)

    // 3. Update user stats
    const statsUpdate = AuthService.updateTradingStats({
      pnl: 100,
      isWin: true
    })
    expect(statsUpdate).toBe(true)

    // 4. Check achievements
    const achievements = AuthService.getUserAchievements()
    expect(achievements.length).toBeGreaterThan(0)

    // 5. Export data
    const exportedData = AuthService.exportUserData()
    expect(exportedData).toBeDefined()
    expect(exportedData.user).toBeDefined()
  })

  it('should handle error scenarios gracefully', async () => {
    // Test with invalid trade parameters
    const invalidTrade = {
      symbol: '',
      side: 'invalid',
      quantity: -1
    }

    const result = await TradingService.executeAdvancedTrade(invalidTrade)
    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })
})

// Performance tests
describe('Performance Tests', () => {
  it('should handle large number of trades efficiently', () => {
    const trades = Array.from({ length: 1000 }, (_, i) => ({
      id: `trade_${i}`,
      pnl: Math.random() * 200 - 100, // Random P&L between -100 and 100
      timestamp: new Date().toISOString()
    }))

    const startTime = performance.now()
    const analytics = TradingService.getAnalytics(trades)
    const endTime = performance.now()

    expect(endTime - startTime).toBeLessThan(100) // Should complete in under 100ms
    expect(analytics.totalTrades).toBe(1000)
  })

  it('should handle multiple pending orders efficiently', () => {
    // Add 100 pending orders
    for (let i = 0; i < 100; i++) {
      TradingService.pendingOrders.set(`order_${i}`, {
        id: `order_${i}`,
        symbol: 'BTC',
        side: 'buy',
        orderType: 'limit',
        price: 40000 + i,
        status: 'pending'
      })
    }

    const currentPrices = { BTC: 40050 }
    
    const startTime = performance.now()
    TradingService.monitorPendingOrders(currentPrices)
    const endTime = performance.now()

    expect(endTime - startTime).toBeLessThan(50) // Should complete in under 50ms
  })
})
