import React, { useState } from 'react'
import { BookOpen, PlayCircle, FileText, Award, CheckCircle, Clock } from 'lucide-react'

function LearningView() {
  const [completedModules, setCompletedModules] = useState(new Set())

  const learningPaths = [
    {
      id: 'basics',
      title: 'Trading Basics',
      description: 'Learn the fundamentals of trading and market analysis',
      modules: [
        {
          id: 'intro',
          title: 'Introduction to Trading',
          type: 'video',
          duration: '15 min',
          content: 'Understanding markets, assets, and basic terminology',
        },
        {
          id: 'orders',
          title: 'Order Types',
          type: 'text',
          duration: '10 min',
          content: 'Market orders, limit orders, and stop-loss strategies',
        },
        {
          id: 'risk',
          title: 'Risk Management',
          type: 'video',
          duration: '20 min',
          content: 'Portfolio diversification and position sizing',
        },
      ],
    },
    {
      id: 'technical',
      title: 'Technical Analysis',
      description: 'Master chart patterns and technical indicators',
      modules: [
        {
          id: 'charts',
          title: 'Reading Charts',
          type: 'text',
          duration: '12 min',
          content: 'Candlesticks, trends, and support/resistance levels',
        },
        {
          id: 'indicators',
          title: 'Technical Indicators',
          type: 'video',
          duration: '25 min',
          content: 'Moving averages, RSI, MACD, and more',
        },
        {
          id: 'patterns',
          title: 'Chart Patterns',
          type: 'text',
          duration: '18 min',
          content: 'Head and shoulders, triangles, and breakout patterns',
        },
      ],
    },
    {
      id: 'strategies',
      title: 'Trading Strategies',
      description: 'Implement proven trading strategies',
      modules: [
        {
          id: 'scalping',
          title: 'Scalping Strategy',
          type: 'video',
          duration: '22 min',
          content: 'Quick profit strategies for active traders',
        },
        {
          id: 'swing',
          title: 'Swing Trading',
          type: 'text',
          duration: '16 min',
          content: 'Medium-term trading for busy professionals',
        },
        {
          id: 'momentum',
          title: 'Momentum Trading',
          type: 'video',
          duration: '19 min',
          content: 'Riding the wave of market momentum',
        },
      ],
    },
  ]

  const toggleModuleCompletion = (moduleId) => {
    const newCompleted = new Set(completedModules)
    if (newCompleted.has(moduleId)) {
      newCompleted.delete(moduleId)
    } else {
      newCompleted.add(moduleId)
    }
    setCompletedModules(newCompleted)
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return PlayCircle
      case 'text':
        return FileText
      default:
        return BookOpen
    }
  }

  const totalModules = learningPaths.reduce((sum, path) => sum + path.modules.length, 0)
  const completedCount = completedModules.size
  const progressPercent = (completedCount / totalModules) * 100

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="p-6 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Learning Progress</h2>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-semibold">
              {completedCount}/{totalModules} Completed
            </span>
          </div>
        </div>
        
        <div className="w-full bg-white/10 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        
        <p className="text-purple-200 text-sm mt-2">
          {progressPercent.toFixed(0)}% complete - Keep learning to master trading!
        </p>
      </div>

      {/* Learning Paths */}
      <div className="space-y-6">
        {learningPaths.map((path) => {
          const pathCompleted = path.modules.filter(module => 
            completedModules.has(module.id)
          ).length
          const pathProgress = (pathCompleted / path.modules.length) * 100

          return (
            <div
              key={path.id}
              className="p-6 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{path.title}</h3>
                  <p className="text-purple-200 text-sm">{path.description}</p>
                </div>
                
                <div className="text-right">
                  <div className="text-white font-semibold">
                    {pathCompleted}/{path.modules.length}
                  </div>
                  <div className="text-purple-200 text-sm">
                    {pathProgress.toFixed(0)}% complete
                  </div>
                </div>
              </div>

              <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                <div
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${pathProgress}%` }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {path.modules.map((module) => {
                  const TypeIcon = getTypeIcon(module.type)
                  const isCompleted = completedModules.has(module.id)

                  return (
                    <button
                      key={module.id}
                      onClick={() => toggleModuleCompletion(module.id)}
                      className={`p-4 rounded-lg text-left transition-all duration-200 ${
                        isCompleted
                          ? 'bg-green-500/20 border border-green-500/30'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <TypeIcon className={`w-5 h-5 ${
                          isCompleted ? 'text-green-400' : 'text-purple-400'
                        }`} />
                        {isCompleted && (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        )}
                      </div>

                      <h4 className="font-semibold text-white mb-2">{module.title}</h4>
                      <p className="text-purple-200 text-sm mb-3">{module.content}</p>

                      <div className="flex items-center gap-2 text-xs">
                        <Clock className="w-3 h-3 text-purple-300" />
                        <span className="text-purple-300">{module.duration}</span>
                        <span className="text-purple-400 capitalize ml-auto">
                          {module.type}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Achievement Section */}
      {completedCount > 0 && (
        <div className="p-6 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 backdrop-blur-lg rounded-lg border border-purple-500/30">
          <div className="flex items-center gap-3 mb-3">
            <Award className="w-6 h-6 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Achievements</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {completedCount >= 1 && (
              <div className="flex items-center gap-2 p-3 bg-white/10 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-white text-sm">First Steps</span>
              </div>
            )}
            {completedCount >= 5 && (
              <div className="flex items-center gap-2 p-3 bg-white/10 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-white text-sm">Learning Machine</span>
              </div>
            )}
            {completedCount >= totalModules && (
              <div className="flex items-center gap-2 p-3 bg-white/10 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-white text-sm">Trading Master</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default LearningView