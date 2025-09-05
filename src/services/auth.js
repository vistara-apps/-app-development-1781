import { FarcasterService, StorageService } from './api.js'

// Authentication Service for Farcaster Integration
export class AuthService {
  static currentUser = null
  static listeners = new Set()

  // Initialize authentication state
  static async initialize() {
    const savedUser = StorageService.getUserData()
    if (savedUser) {
      this.currentUser = savedUser
      this.notifyListeners()
    }
    return this.currentUser
  }

  // Simulate Farcaster authentication flow
  static async authenticateWithFarcaster() {
    try {
      // In a real implementation, this would use Farcaster's authentication flow
      // For demo purposes, we'll simulate a successful authentication
      const mockUser = {
        fid: Math.floor(Math.random() * 100000),
        username: `trader_${Math.floor(Math.random() * 1000)}`,
        displayName: 'Demo Trader',
        pfpUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
        followerCount: Math.floor(Math.random() * 1000),
        followingCount: Math.floor(Math.random() * 500),
        bio: 'Learning to trade with FlashTrade Sim',
        connectedAt: new Date().toISOString(),
        virtualBalance: 10000,
        totalTrades: 0,
        winRate: 0,
        totalPnL: 0
      }

      // Save user data
      StorageService.saveUserData(mockUser)
      this.currentUser = mockUser
      this.notifyListeners()

      return {
        success: true,
        user: mockUser
      }
    } catch (error) {
      console.error('Authentication failed:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Real Farcaster authentication (for production)
  static async authenticateWithFarcasterReal(signerUuid) {
    try {
      const authResult = await FarcasterService.authenticateUser(signerUuid)
      
      if (!authResult) {
        throw new Error('Authentication failed')
      }

      const userData = await FarcasterService.getUserByFid(authResult.fid)
      
      if (!userData) {
        throw new Error('Failed to fetch user data')
      }

      const user = {
        fid: userData.fid,
        username: userData.username,
        displayName: userData.display_name,
        pfpUrl: userData.pfp_url,
        followerCount: userData.follower_count,
        followingCount: userData.following_count,
        bio: userData.profile?.bio?.text || '',
        connectedAt: new Date().toISOString(),
        virtualBalance: 10000, // Starting balance
        totalTrades: 0,
        winRate: 0,
        totalPnL: 0
      }

      StorageService.saveUserData(user)
      this.currentUser = user
      this.notifyListeners()

      return {
        success: true,
        user
      }
    } catch (error) {
      console.error('Real Farcaster authentication failed:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Logout user
  static logout() {
    this.currentUser = null
    StorageService.clearAllData()
    this.notifyListeners()
  }

  // Get current user
  static getCurrentUser() {
    return this.currentUser
  }

  // Check if user is authenticated
  static isAuthenticated() {
    return this.currentUser !== null
  }

  // Update user data
  static updateUser(updates) {
    if (!this.currentUser) return false

    this.currentUser = {
      ...this.currentUser,
      ...updates,
      updatedAt: new Date().toISOString()
    }

    StorageService.saveUserData(this.currentUser)
    this.notifyListeners()
    return true
  }

  // Subscribe to authentication state changes
  static subscribe(callback) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  // Notify all listeners of state changes
  static notifyListeners() {
    this.listeners.forEach(callback => callback(this.currentUser))
  }

  // Update trading statistics
  static updateTradingStats(tradeResult) {
    if (!this.currentUser) return false

    const { pnl, isWin } = tradeResult
    const currentStats = {
      totalTrades: this.currentUser.totalTrades || 0,
      totalPnL: this.currentUser.totalPnL || 0,
      wins: this.currentUser.wins || 0
    }

    const newStats = {
      totalTrades: currentStats.totalTrades + 1,
      totalPnL: currentStats.totalPnL + pnl,
      wins: currentStats.wins + (isWin ? 1 : 0)
    }

    newStats.winRate = (newStats.wins / newStats.totalTrades) * 100

    this.updateUser(newStats)
    return true
  }

  // Get user achievements
  static getUserAchievements() {
    if (!this.currentUser) return []

    const achievements = []
    const stats = this.currentUser

    // First Trade Achievement
    if (stats.totalTrades >= 1) {
      achievements.push({
        id: 'first_trade',
        title: 'First Trade',
        description: 'Completed your first trade',
        icon: '🎯',
        unlockedAt: stats.connectedAt
      })
    }

    // Active Trader Achievement
    if (stats.totalTrades >= 10) {
      achievements.push({
        id: 'active_trader',
        title: 'Active Trader',
        description: 'Completed 10 trades',
        icon: '📈',
        unlockedAt: stats.updatedAt
      })
    }

    // Profitable Trader Achievement
    if (stats.totalPnL > 0) {
      achievements.push({
        id: 'profitable',
        title: 'Profitable Trader',
        description: 'Achieved positive P&L',
        icon: '💰',
        unlockedAt: stats.updatedAt
      })
    }

    // High Win Rate Achievement
    if (stats.winRate >= 60 && stats.totalTrades >= 5) {
      achievements.push({
        id: 'high_win_rate',
        title: 'Consistent Winner',
        description: 'Maintained 60%+ win rate',
        icon: '🏆',
        unlockedAt: stats.updatedAt
      })
    }

    return achievements
  }

  // Export user data
  static exportUserData() {
    if (!this.currentUser) return null

    const trades = StorageService.getTrades()
    const learningProgress = StorageService.getLearningProgress()

    return {
      user: this.currentUser,
      trades,
      learningProgress,
      exportedAt: new Date().toISOString()
    }
  }

  // Import user data
  static importUserData(data) {
    try {
      if (data.user) {
        StorageService.saveUserData(data.user)
        this.currentUser = data.user
      }

      if (data.trades) {
        StorageService.saveTrades(data.trades)
      }

      if (data.learningProgress) {
        StorageService.saveLearningProgress(data.learningProgress)
      }

      this.notifyListeners()
      return true
    } catch (error) {
      console.error('Failed to import user data:', error)
      return false
    }
  }
}

// Hook for React components to use authentication
export function useAuth() {
  const [user, setUser] = React.useState(AuthService.getCurrentUser())

  React.useEffect(() => {
    const unsubscribe = AuthService.subscribe(setUser)
    return unsubscribe
  }, [])

  return {
    user,
    isAuthenticated: AuthService.isAuthenticated(),
    login: AuthService.authenticateWithFarcaster,
    logout: AuthService.logout,
    updateUser: AuthService.updateUser,
    achievements: AuthService.getUserAchievements(),
    exportData: AuthService.exportUserData,
    importData: AuthService.importUserData
  }
}

export default AuthService
