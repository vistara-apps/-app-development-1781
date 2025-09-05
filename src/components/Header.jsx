import React, { useState, useEffect } from 'react'
import { Activity, Wallet, User, LogOut, Settings, Trophy, Download } from 'lucide-react'
import AuthService from '../services/auth.js'

function Header({ isConnected, setIsConnected }) {
  const [user, setUser] = useState(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Initialize auth service and check for existing user
    AuthService.initialize().then(savedUser => {
      if (savedUser) {
        setUser(savedUser)
        setIsConnected(true)
      }
    })

    // Subscribe to auth changes
    const unsubscribe = AuthService.subscribe((currentUser) => {
      setUser(currentUser)
      setIsConnected(!!currentUser)
    })

    return unsubscribe
  }, [setIsConnected])

  const handleConnect = async () => {
    if (isConnected && user) {
      // Show user menu
      setShowUserMenu(!showUserMenu)
      return
    }

    setIsLoading(true)
    try {
      const result = await AuthService.authenticateWithFarcaster()
      if (result.success) {
        setUser(result.user)
        setIsConnected(true)
      } else {
        console.error('Authentication failed:', result.error)
      }
    } catch (error) {
      console.error('Connection error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    AuthService.logout()
    setUser(null)
    setIsConnected(false)
    setShowUserMenu(false)
  }

  const handleExportData = () => {
    const data = AuthService.exportUserData()
    if (data) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `flashtrade-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
    setShowUserMenu(false)
  }

  const achievements = user ? AuthService.getUserAchievements() : []

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">FlashTrade Sim</h1>
          <p className="text-purple-200 text-sm">Learn, Practice, Master Trading</p>
        </div>
      </div>
      
      <div className="relative">
        <button
          onClick={handleConnect}
          disabled={isLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            isConnected && user
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-white hover:bg-gray-100 text-gray-900'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          ) : isConnected && user ? (
            <>
              {user.pfpUrl ? (
                <img 
                  src={user.pfpUrl} 
                  alt={user.displayName}
                  className="w-4 h-4 rounded-full"
                />
              ) : (
                <User className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">{user.displayName || user.username}</span>
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </>
          )}
        </button>

        {/* User Menu Dropdown */}
        {showUserMenu && user && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                {user.pfpUrl ? (
                  <img 
                    src={user.pfpUrl} 
                    alt={user.displayName}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">{user.displayName}</p>
                  <p className="text-sm text-gray-500">@{user.username}</p>
                </div>
              </div>
            </div>

            <div className="p-2">
              {/* User Stats */}
              <div className="px-3 py-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Balance:</span>
                  <span className="font-semibold">${user.virtualBalance?.toLocaleString() || '10,000'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Trades:</span>
                  <span className="font-semibold">{user.totalTrades || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Win Rate:</span>
                  <span className="font-semibold">{user.winRate?.toFixed(1) || '0.0'}%</span>
                </div>
              </div>

              {/* Achievements */}
              {achievements.length > 0 && (
                <div className="px-3 py-2 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Recent Achievements
                  </p>
                  <div className="space-y-1">
                    {achievements.slice(0, 3).map(achievement => (
                      <div key={achievement.id} className="flex items-center gap-2 text-sm">
                        <span>{achievement.icon}</span>
                        <span className="text-gray-700">{achievement.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Menu Items */}
              <div className="border-t border-gray-100 mt-2">
                <button
                  onClick={handleExportData}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  <Download className="w-4 h-4" />
                  Export Data
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Click outside to close menu */}
        {showUserMenu && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowUserMenu(false)}
          />
        )}
      </div>
    </header>
  )
}

export default Header
