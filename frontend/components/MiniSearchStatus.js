import { useState, useEffect, useMemo } from 'react'
import Icon from './Icon'

const MiniSearchStatus = ({ isSearching }) => {
  const [currentStatus, setCurrentStatus] = useState('')
  const [statusIcon, setStatusIcon] = useState('search')

  const statusUpdates = useMemo(() => [
    { message: 'Initializing optimized search...', icon: 'search', duration: 3000 },
    { message: 'Analyzing social media via Google...', icon: 'users', duration: 6000 },
    { message: 'Checking Instagram mentions...', icon: 'users', duration: 4000 },
    { message: 'Searching Twitter/X profiles...', icon: 'users', duration: 4000 },
    { message: 'Analyzing Facebook content...', icon: 'users', duration: 4000 },
    { message: 'Searching professional networks...', icon: 'briefcase', duration: 5000 },
    { message: 'Checking LinkedIn profiles...', icon: 'briefcase', duration: 4000 },
    { message: 'Scanning GitHub repositories...', icon: 'briefcase', duration: 3000 },
    { message: 'Searching academic platforms...', icon: 'academic-cap', duration: 4000 },
    { message: 'Analyzing web content...', icon: 'globe', duration: 6000 },
    { message: 'Checking news publications...', icon: 'newspaper', duration: 3000 },
    { message: 'Processing and ranking results...', icon: 'chart-bar', duration: 3000 },
    { message: 'Finalizing optimized report...', icon: 'chart-bar', duration: 2000 }
  ], [])

  useEffect(() => {
    if (!isSearching) {
      setCurrentStatus('')
      setStatusIcon('search')
      return
    }

    let statusIndex = 0
    
    const updateStatus = () => {
      if (statusIndex < statusUpdates.length) {
        const update = statusUpdates[statusIndex]
        setCurrentStatus(update.message)
        setStatusIcon(update.icon)
        
        setTimeout(() => {
          statusIndex++
          updateStatus()
        }, update.duration)
      }
    }

    updateStatus()
  }, [isSearching, statusUpdates])

  if (!isSearching || !currentStatus) return null

  return (
    <div className="fixed bottom-8 right-8 z-40 max-w-sm">
      <div className="bg-white/95 rounded-2xl shadow-xl border border-gray-200 p-5 transform transition-all duration-300 animate-in slide-in-from-bottom backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Icon name={statusIcon} className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">{currentStatus}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <span className="text-xs text-gray-500 font-medium">Processing...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MiniSearchStatus