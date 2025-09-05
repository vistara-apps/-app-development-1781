import React, { createContext, useContext, useReducer, useEffect } from 'react'

const TradingContext = createContext()

const initialState = {
  virtualBalance: 10000,
  trades: [],
  selectedAsset: 'BTC',
  marketData: {
    BTC: { price: 42150, change: 2.5, volume: '1.2B' },
    ETH: { price: 2580, change: -1.2, volume: '800M' },
    BASE: { price: 1.85, change: 5.8, volume: '120M' },
    SOL: { price: 98.50, change: 3.1, volume: '450M' },
  },
  priceHistory: {},
}

function tradingReducer(state, action) {
  switch (action.type) {
    case 'EXECUTE_TRADE':
      const { symbol, type, quantity, price } = action.payload
      const tradeValue = quantity * price
      
      if (type === 'buy' && tradeValue > state.virtualBalance) {
        return state // Insufficient funds
      }
      
      const newTrade = {
        id: Date.now(),
        symbol,
        type,
        quantity,
        price,
        timestamp: new Date().toISOString(),
        value: tradeValue,
        pnl: 0,
      }
      
      const balanceChange = type === 'buy' ? -tradeValue : tradeValue
      
      return {
        ...state,
        trades: [newTrade, ...state.trades],
        virtualBalance: state.virtualBalance + balanceChange,
      }
      
    case 'UPDATE_MARKET_DATA':
      return {
        ...state,
        marketData: action.payload,
      }
      
    case 'UPDATE_PRICE_HISTORY':
      return {
        ...state,
        priceHistory: {
          ...state.priceHistory,
          [action.payload.symbol]: action.payload.history,
        }
      }
      
    case 'SET_SELECTED_ASSET':
      return {
        ...state,
        selectedAsset: action.payload,
      }
      
    default:
      return state
  }
}

export function TradingProvider({ children }) {
  const [state, dispatch] = useReducer(tradingReducer, initialState)

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedMarketData = { ...state.marketData }
      
      Object.keys(updatedMarketData).forEach(symbol => {
        const currentPrice = updatedMarketData[symbol].price
        const volatility = 0.02 // 2% max change
        const randomChange = (Math.random() - 0.5) * volatility
        const newPrice = currentPrice * (1 + randomChange)
        const changePercent = ((newPrice - currentPrice) / currentPrice) * 100
        
        updatedMarketData[symbol] = {
          ...updatedMarketData[symbol],
          price: Math.round(newPrice * 100) / 100,
          change: Math.round(changePercent * 100) / 100,
        }
      })
      
      dispatch({ type: 'UPDATE_MARKET_DATA', payload: updatedMarketData })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Generate price history for charts
  useEffect(() => {
    Object.keys(state.marketData).forEach(symbol => {
      if (!state.priceHistory[symbol]) {
        const history = generatePriceHistory(state.marketData[symbol].price)
        dispatch({ 
          type: 'UPDATE_PRICE_HISTORY', 
          payload: { symbol, history } 
        })
      }
    })
  }, [])

  const executeTrade = (tradeData) => {
    dispatch({ type: 'EXECUTE_TRADE', payload: tradeData })
  }

  const setSelectedAsset = (asset) => {
    dispatch({ type: 'SET_SELECTED_ASSET', payload: asset })
  }

  return (
    <TradingContext.Provider value={{
      ...state,
      executeTrade,
      setSelectedAsset,
    }}>
      {children}
    </TradingContext.Provider>
  )
}

export function useTradingContext() {
  const context = useContext(TradingContext)
  if (!context) {
    throw new Error('useTradingContext must be used within TradingProvider')
  }
  return context
}

function generatePriceHistory(basePrice) {
  const history = []
  let currentPrice = basePrice
  
  for (let i = 0; i < 50; i++) {
    const volatility = 0.03
    const change = (Math.random() - 0.5) * volatility
    currentPrice = currentPrice * (1 + change)
    history.push({
      time: Date.now() - (50 - i) * 1000 * 60,
      price: Math.round(currentPrice * 100) / 100,
    })
  }
  
  return history
}