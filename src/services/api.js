// API Configuration and Services
const API_CONFIG = {
  NEYNAR_API_KEY: import.meta.env.VITE_NEYNAR_API_KEY || 'demo-key',
  NEYNAR_BASE_URL: 'https://api.neynar.com/v2',
  BASE_RPC_URL: import.meta.env.VITE_BASE_RPC_URL || 'https://mainnet.base.org',
  AIRSTACK_API_KEY: import.meta.env.VITE_AIRSTACK_API_KEY || 'demo-key',
  AIRSTACK_URL: 'https://api.airstack.xyz/gql'
}

// Farcaster/Neynar API Service
export class FarcasterService {
  static async getUserByFid(fid) {
    try {
      const response = await fetch(`${API_CONFIG.NEYNAR_BASE_URL}/farcaster/user?fid=${fid}`, {
        headers: {
          'api_key': API_CONFIG.NEYNAR_API_KEY,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching user data:', error)
      return null
    }
  }

  static async authenticateUser(signerUuid) {
    try {
      const response = await fetch(`${API_CONFIG.NEYNAR_BASE_URL}/farcaster/signer`, {
        method: 'POST',
        headers: {
          'api_key': API_CONFIG.NEYNAR_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ signer_uuid: signerUuid })
      })
      
      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Authentication error:', error)
      return null
    }
  }
}

// Market Data Service (Base RPC)
export class MarketDataService {
  static async getTokenPrice(tokenAddress) {
    try {
      const response = await fetch(API_CONFIG.BASE_RPC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_call',
          params: [
            {
              to: tokenAddress,
              data: '0x313ce567' // decimals() function selector
            },
            'latest'
          ],
          id: 1
        })
      })
      
      if (!response.ok) {
        throw new Error(`RPC error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching token price:', error)
      return null
    }
  }

  static async getHistoricalData(symbol, timeframe = '1h', limit = 100) {
    // Simulate historical data for demo purposes
    // In production, this would connect to a real price feed API
    const basePrice = this.getSimulatedPrice(symbol)
    const history = []
    const now = Date.now()
    
    for (let i = limit; i >= 0; i--) {
      const timestamp = now - (i * 60 * 60 * 1000) // 1 hour intervals
      const volatility = 0.02
      const change = (Math.random() - 0.5) * volatility
      const price = basePrice * (1 + change * (i / limit))
      
      history.push({
        timestamp,
        price: Math.round(price * 100) / 100,
        volume: Math.random() * 1000000
      })
    }
    
    return history
  }

  static getSimulatedPrice(symbol) {
    const prices = {
      'BTC': 42150,
      'ETH': 2580,
      'BASE': 1.85,
      'SOL': 98.50,
      'USDC': 1.00,
      'DEGEN': 0.012
    }
    return prices[symbol] || 100
  }
}

// Airstack Service for on-chain data
export class AirstackService {
  static async getTokenHolders(tokenAddress) {
    const query = `
      query GetTokenHolders($tokenAddress: Address!) {
        TokenBalances(
          input: {
            filter: {
              tokenAddress: {_eq: $tokenAddress}
              tokenType: {_eq: ERC20}
            }
            blockchain: base
            limit: 50
          }
        ) {
          TokenBalance {
            owner {
              addresses
            }
            amount
            formattedAmount
          }
        }
      }
    `
    
    try {
      const response = await fetch(API_CONFIG.AIRSTACK_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.AIRSTACK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query,
          variables: { tokenAddress }
        })
      })
      
      if (!response.ok) {
        throw new Error(`Airstack API error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching token holders:', error)
      return null
    }
  }
}

// Local Storage Service for data persistence
export class StorageService {
  static KEYS = {
    USER_DATA: 'flashtrade_user_data',
    TRADES: 'flashtrade_trades',
    SETTINGS: 'flashtrade_settings',
    LEARNING_PROGRESS: 'flashtrade_learning_progress'
  }

  static saveUserData(userData) {
    try {
      localStorage.setItem(this.KEYS.USER_DATA, JSON.stringify(userData))
      return true
    } catch (error) {
      console.error('Error saving user data:', error)
      return false
    }
  }

  static getUserData() {
    try {
      const data = localStorage.getItem(this.KEYS.USER_DATA)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Error loading user data:', error)
      return null
    }
  }

  static saveTrades(trades) {
    try {
      localStorage.setItem(this.KEYS.TRADES, JSON.stringify(trades))
      return true
    } catch (error) {
      console.error('Error saving trades:', error)
      return false
    }
  }

  static getTrades() {
    try {
      const data = localStorage.getItem(this.KEYS.TRADES)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error loading trades:', error)
      return []
    }
  }

  static saveLearningProgress(progress) {
    try {
      localStorage.setItem(this.KEYS.LEARNING_PROGRESS, JSON.stringify(progress))
      return true
    } catch (error) {
      console.error('Error saving learning progress:', error)
      return false
    }
  }

  static getLearningProgress() {
    try {
      const data = localStorage.getItem(this.KEYS.LEARNING_PROGRESS)
      return data ? JSON.parse(data) : {}
    } catch (error) {
      console.error('Error loading learning progress:', error)
      return {}
    }
  }

  static clearAllData() {
    try {
      Object.values(this.KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
      return true
    } catch (error) {
      console.error('Error clearing data:', error)
      return false
    }
  }
}

export default {
  FarcasterService,
  MarketDataService,
  AirstackService,
  StorageService
}
