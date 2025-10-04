import { useState, useEffect, useMemo } from 'react'
import Icon from './Icon'

const SearchProgress = ({ isSearching, onCancel, resultsData }) => {
  const [currentStage, setCurrentStage] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(90) // Optimized search - 90 seconds
  const [progress, setProgress] = useState(0)
  const [currentPlatform, setCurrentPlatform] = useState('')
  const [resultsFound, setResultsFound] = useState(0)
  const [stageResults, setStageResults] = useState({})

  // Optimized search stages with better timing and messaging
  const searchStages = useMemo(() => [
    { name: 'Initializing Search', platform: 'System Setup & Image Analysis', duration: 3, icon: 'search', color: 'blue' },
    { name: 'Social Media Analysis', platform: 'Instagram, Twitter, Facebook', duration: 18, icon: 'users', color: 'purple' },
    { name: 'Professional Networks', platform: 'LinkedIn, GitHub', duration: 15, icon: 'briefcase', color: 'indigo' },
    { name: 'Academic Platforms', platform: 'Google Scholar, ResearchGate', duration: 12, icon: 'academic-cap', color: 'green' },
    { name: 'Web Content Analysis', platform: 'Google, Bing, DuckDuckGo', duration: 20, icon: 'globe', color: 'blue' },
    { name: 'News & Publications', platform: 'News Sites, Articles', duration: 10, icon: 'newspaper', color: 'orange' },
    { name: 'Processing Results', platform: 'Deep Analysis, Face Detection & Ranking - This takes time for accuracy', duration: 12, icon: 'chart-bar', color: 'emerald' }
  ], [])

  // Update results when received from backend
  useEffect(() => {
    if (resultsData) {
      setResultsFound(resultsData.totalResults || 0)
      if (resultsData.stageResults) {
        setStageResults(prev => ({ ...prev, ...resultsData.stageResults }))
      }
      
      // If search is complete, finish the progress immediately
      if (resultsData.searchComplete) {
        console.log('🔍 Search complete, finishing progress...')
        setProgress(100)
        setTimeRemaining(0)
        setCurrentStage(searchStages.length - 1)
        setCurrentPlatform('Search completed successfully')
      }
    }
  }, [resultsData, searchStages.length])

  // Progress simulation for optimized search with monotonic progression
  useEffect(() => {
    if (!isSearching) {
      setCurrentStage(0)
      setTimeRemaining(90)
      setProgress(0)
      setCurrentPlatform('')
      setResultsFound(0)
      setStageResults({})
      return
    }

    let totalDuration = searchStages.reduce((acc, stage) => acc + stage.duration, 0)
    let overallElapsedTime = 0
    let stageIndex = 0
    let stageElapsedTime = 0

    const interval = setInterval(() => {
      if (stageIndex < searchStages.length) {
        const currentStageObj = searchStages[stageIndex]
        
        // Update current stage info
        setCurrentStage(stageIndex)
        setCurrentPlatform(currentStageObj.platform)
        
        // Calculate overall progress (monotonic)
        overallElapsedTime += 1
        const overallProgress = Math.min((overallElapsedTime / totalDuration) * 100, 100)
        setProgress(overallProgress)
        
        // Calculate time remaining
        const remaining = Math.max(0, totalDuration - overallElapsedTime)
        setTimeRemaining(Math.ceil(remaining))
        
        // Simulate finding results as we progress
        const baseResults = Math.floor((overallProgress / 100) * 15) // Base results
        const stageBonus = stageIndex * 2 // Bonus per stage
        const randomResults = Math.floor(Math.random() * 5) // Some randomness
        setResultsFound(baseResults + stageBonus + randomResults)
        
        stageElapsedTime += 1
        
        // Move to next stage
        if (stageElapsedTime >= currentStageObj.duration && stageIndex < searchStages.length - 1) {
          stageIndex++
          stageElapsedTime = 0
        }
      } else {
        // Final stage - ensure 100% and stop
        setProgress(100)
        setTimeRemaining(0)
      }
    }, 1000) // Update every second

    return () => clearInterval(interval)
  }, [isSearching, searchStages])

  if (!isSearching) return null

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const currentStageObj = searchStages[currentStage]

  return (
    <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <style jsx global>{`
        .custom-scrollbar-hidden {
          scrollbar-width: thin;
          scrollbar-color: rgba(148, 163, 184, 0.5) transparent;
        }
        .custom-scrollbar-hidden::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar-hidden::-webkit-scrollbar-track {
          background: rgba(148, 163, 184, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar-hidden::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.4);
          border-radius: 3px;
          transition: background 0.2s ease;
        }
        .custom-scrollbar-hidden::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.6);
        }
        .custom-scrollbar-progress {
          scrollbar-width: thin;
          scrollbar-color: rgba(99, 102, 241, 0.4) rgba(248, 250, 252, 0.6);
        }
        .custom-scrollbar-progress::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar-progress::-webkit-scrollbar-track {
          background: rgba(248, 250, 252, 0.8);
          border-radius: 6px;
          margin: 4px;
        }
        .custom-scrollbar-progress::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(99, 102, 241, 0.6), rgba(79, 70, 229, 0.7));
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.4);
          transition: all 0.3s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .custom-scrollbar-progress::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(99, 102, 241, 0.8), rgba(79, 70, 229, 0.9));
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
          transform: scale(1.1);
        }
        .scroll-fade-bottom {
          position: relative;
        }
        .scroll-fade-bottom::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 20px;
          background: linear-gradient(transparent, rgba(255, 255, 255, 0.8));
          pointer-events: none;
          border-radius: 0 0 16px 16px;
        }
        .search-content-container {
          max-height: calc(95vh - 140px);
          overflow-y: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .search-content-container::-webkit-scrollbar {
          display: none;
        }
        @media (max-width: 768px) {
          .search-content-container {
            max-height: calc(95vh - 120px);
          }
          .custom-scrollbar-hidden {
            max-height: 250px !important;
          }
        }
      `}</style>
      <div className="bg-white/98 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/40 w-full max-w-6xl lg:max-w-7xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 p-6 lg:p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-white/15 rounded-xl backdrop-blur-sm border border-white/10">
                <Icon name={currentStageObj?.icon || 'search'} className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Digital Footprint Analysis</h2>
                <p className="text-slate-300 text-xs opacity-90">
                  Comprehensive search across multiple platforms
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{Math.round(progress)}%</div>
              <div className="text-xs text-slate-300 opacity-80">Complete</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden backdrop-blur-sm border border-white/5">
              <div 
                className="bg-gradient-to-r from-blue-400 via-indigo-400 to-slate-400 h-2.5 rounded-full transition-all duration-500 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-4 lg:p-6 search-content-container flex-1 min-h-0">
          <div className="grid lg:grid-cols-5 gap-4 lg:gap-6 h-full min-h-0">
            
            {/* Current Stage Section */}
            <div className="lg:col-span-2 flex flex-col">
              <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                Current Activity
              </h3>
              <div className="space-y-3 overflow-y-auto custom-scrollbar-hidden flex-1">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2.5 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl text-white shadow-lg`}>
                      <Icon name={currentStageObj?.icon} className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-800 text-sm truncate">{currentStageObj?.name}</h4>
                      <p className="text-xs text-slate-600 truncate mt-0.5">{currentPlatform}</p>
                      {currentStageObj?.name === 'Processing Results' && (
                        <div className="mt-2 text-xs text-slate-700 font-medium bg-gradient-to-r from-slate-50 to-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/60 shadow-sm">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
                            Deep analysis in progress - ensuring accuracy
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="animate-spin text-slate-500 flex-shrink-0">
                      <Icon name="loading" className="w-4 h-4" />
                    </div>
                  </div>
                  
                  {/* Stage Progress Bar */}
                  <div className="w-full bg-gradient-to-r from-slate-100 to-slate-50 rounded-full h-2 mb-2 overflow-hidden shadow-inner">
                    <div 
                      className={`bg-gradient-to-r from-slate-500 to-slate-600 h-2 rounded-full transition-all duration-500 ease-out shadow-sm`}
                      style={{ 
                        width: `${Math.min(100, ((progress - (currentStage * (100 / searchStages.length))) / (100 / searchStages.length)) * 100)}%`
                      }}
                    ></div>
                  </div>
                <p className="text-xs text-slate-500">
                  {currentStageObj?.name === 'Processing Results' 
                    ? 'Performing thorough analysis - please wait, this ensures quality results' 
                    : 'Processing...'}
                </p>
              </div>

              {/* Results Counter */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl text-white shadow-lg">
                      <Icon name="check" className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">Results Found</div>
                      <div className="text-xs text-slate-600 font-medium">All platforms</div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent">
                    {resultsFound}
                  </div>
                </div>
              </div>
              </div>
            </div>

            {/* Search Stages Grid */}
            <div className="lg:col-span-3 flex flex-col min-h-0">
              <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                Search Progress
              </h3>
              <div className="scroll-fade-bottom flex-1 relative min-h-0">
                <div 
                  className="space-y-2 overflow-y-auto pr-2 custom-scrollbar-progress pb-8"
                  style={{ 
                    height: '240px',
                    maxHeight: '240px',
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(99, 102, 241, 0.4) rgba(248, 250, 252, 0.6)'
                  }}
                >
                {searchStages.map((stage, index) => (
                  <div key={index} className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg border ${
                    index === currentStage ? 'bg-gradient-to-r from-slate-50 to-slate-100 border-slate-300/60 shadow-slate-200' :
                    index < currentStage ? 'bg-gradient-to-r from-slate-50/80 to-slate-100/80 border-slate-200/50 shadow-slate-100' : 
                    'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200/50'
                  }`}>
                    <div className={`p-2 rounded-xl shadow-lg transition-all duration-300 ${
                      index < currentStage ? 'bg-gradient-to-br from-slate-500 to-slate-600 text-white' :
                      index === currentStage ? 'bg-gradient-to-br from-slate-600 to-slate-700 text-white animate-pulse' : 
                      'bg-gradient-to-br from-gray-300 to-slate-300 text-slate-500'
                    }`}>
                      {index < currentStage ? (
                        <Icon name="check" className="w-4 h-4" />
                      ) : index === currentStage ? (
                        <Icon name="loading" className="w-4 h-4" />
                      ) : (
                        <Icon name={stage.icon} className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold text-sm truncate ${
                        index === currentStage ? 'text-slate-800' :
                        index < currentStage ? 'text-slate-700' : 'text-slate-600'
                      }`}>{stage.name}</div>
                      <div className={`text-xs truncate mt-0.5 ${
                        index === currentStage ? 'text-slate-600' :
                        index < currentStage ? 'text-slate-500' : 'text-slate-500'
                      }`}>{stage.platform}</div>
                    </div>
                    <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                      index < currentStage ? 'bg-slate-200 text-slate-700' :
                      index === currentStage ? 'bg-slate-300 text-slate-800' : 'bg-gray-200 text-slate-600'
                    }`}>
                      {index < currentStage ? 'Completed' :
                       index === currentStage ? 'Active' : 'Pending'}
                    </div>
                  </div>
                ))}
              </div>
              </div>
            </div>
          </div>

          {/* Search Statistics Section */}
          <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl border border-slate-200/60 p-5 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl text-white shadow-lg">
                <Icon name="chart-bar" className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-slate-800 text-base">Search Statistics</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="text-xs text-slate-600 font-medium mb-1">Platforms</div>
                <div className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent">{searchStages.length}</div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="text-xs text-slate-700 font-medium mb-1">Completed</div>
                <div className="text-2xl font-bold bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent">{currentStage}</div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="text-xs text-slate-700 font-medium mb-1">Time Left</div>
                <div className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent">{formatTime(timeRemaining)}</div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="text-xs text-slate-700 font-medium mb-1">Success Rate</div>
                <div className="text-2xl font-bold bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent">{Math.round((resultsFound / Math.max(currentStage, 1)) * 10)}%</div>
              </div>
            </div>
          </div>

          {/* Optimized Search Technology - Minimal Design */}
          <div className="mt-5 bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50 rounded-xl border border-slate-200/60 p-5 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl text-white shadow-lg shrink-0">
                <Icon name="cog" className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-800 mb-3 text-base">Advanced Search Engine</h4>
                <p className="text-sm text-slate-700 mb-4 leading-relaxed">
                  AI-powered multi-platform search with intelligent ranking algorithms for comprehensive results.
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: 'Social', color: 'from-slate-500 to-slate-600' },
                    { name: 'Professional', color: 'from-slate-600 to-slate-700' },
                    { name: 'Academic', color: 'from-slate-500 to-slate-600' },
                    { name: 'News', color: 'from-slate-600 to-slate-700' },
                    { name: 'Web', color: 'from-slate-700 to-slate-800' }
                  ].map(tag => (
                    <span 
                      key={tag.name} 
                      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r ${tag.color} shadow-sm hover:shadow-md transition-all duration-200 border border-white/10`}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center mt-6">
            <button
              onClick={onCancel}
              className="px-8 py-3 text-slate-600 hover:text-slate-800 transition-all duration-200 border-2 border-slate-300 rounded-xl hover:bg-slate-50 hover:shadow-lg font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] bg-white/80 backdrop-blur-sm hover:border-slate-400"
            >
              <div className="flex items-center gap-2">
                <Icon name="x" className="w-4 h-4" />
                Cancel Search
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchProgress