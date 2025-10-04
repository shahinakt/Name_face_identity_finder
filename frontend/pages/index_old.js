import { useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import OptimizedSearchProgress from '../components/OptimizedSearchProgress'
import MiniSearchStatus from '../components/MiniSearchStatus'

export default function Home() {
  const [name, setName] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [resultsData, setResultsData] = useState({ totalResults: 0 })
  const router = useRouter()

  const handleFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleCancelSearch = () => {
    setLoading(false)
    setError('Search cancelled by user')
  }

  const submit = async (ev) => {
    ev.preventDefault()
    setError(null)
    setResultsData({ totalResults: 0 })
    
    if (!name && !file) {
      setError('Enter a name or upload a photo.')
      return
    }

    setLoading(true)
    try {
      const form = new FormData()
      if (name) form.append('name', name)
      if (file) form.append('file', file)
      form.append('use_enhanced', 'true')  // Enable enhanced search by default

      // Use main search endpoint for immediate results
      const res = await fetch('http://127.0.0.1:8001/search', {
        method: 'POST',
        body: form
      })

      if (!res.ok) {
        throw new Error('Server error')
      }
      
      const body = await res.json()
      
      // Debug logging
      console.log('🔍 Frontend: Received response from backend:', body)
      console.log('🔍 Frontend: Results array:', body.results)
      console.log('🔍 Frontend: Results length:', body.results?.length || 0)
      console.log('🔍 Frontend: Total results:', body.total_results)
      
      // Update results data for progress tracking
      setResultsData({ 
        totalResults: body.total_results || body.results?.length || 0 
      })
      
      // Store results in sessionStorage to avoid URL length limits
      const results = body.results || []
      const totalResults = body.total_results || results.length || 0
      
      console.log('🔍 Frontend: About to store results:', results)
      console.log('🔍 Frontend: Total count:', totalResults)
      
      sessionStorage.setItem('searchResults', JSON.stringify(results))
      sessionStorage.setItem('totalResults', String(totalResults))
      
      // Also store in localStorage as backup
      localStorage.setItem('lastSearchResults', JSON.stringify(results))
      localStorage.setItem('lastTotalResults', String(totalResults))
      
      // Navigate immediately to results page
      router.push('/results')
      
    } catch (err) {
      console.error(err)
      setError('Could not complete search. Is backend running?')
    } finally {
      setLoading(false)
      // release preview URL
      if (preview) URL.revokeObjectURL(preview)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-auto">
      <style jsx global>{`
        body {
          overflow: hidden;
        }
        .search-page-container {
          overflow-y: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .search-page-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="flex items-center justify-center px-4 py-8 min-h-screen search-page-container">
      {/* Enhanced Search Progress Overlay */}
      <OptimizedSearchProgress 
        isSearching={loading} 
        onCancel={handleCancelSearch} 
        resultsData={resultsData}
      />
      
      {/* Mini Status Updates */}
      <MiniSearchStatus isSearching={loading} />
      
      <div className="w-full max-w-4xl">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 transform transition-all duration-300 hover:shadow-3xl">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
              Digital Footprint Checker
            </h1>
            <p className="text-slate-500 text-xs font-medium">
              Privacy-first web demo • No sign-up • No data stored
            </p>
          </div>

          <form onSubmit={submit} className="space-y-6">
            {/* Search Information Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-purple-600/5 rounded-2xl p-4 border border-blue-200/30">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-50"></div>
              <div className="relative">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-lg">
                    ⚡
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 mb-2 text-base">Optimized Digital Footprint Search</h3>
                    <p className="text-slate-600 mb-3 leading-relaxed text-sm">
                      Enhanced search engine using Google-based queries for better performance. 
                      Scans across 6+ platform categories with improved speed.
                    </p>
                    
                    {/* Platform Categories */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {[
                        { name: 'Social Media', color: 'from-purple-500 to-pink-500', bg: 'bg-purple-50' },
                        { name: 'Professional', color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50' },
                        { name: 'Academic', color: 'from-green-500 to-emerald-500', bg: 'bg-green-50' },
                        { name: 'News & Media', color: 'from-orange-500 to-red-500', bg: 'bg-orange-50' },
                        { name: 'Web Content', color: 'from-indigo-500 to-purple-500', bg: 'bg-indigo-50' }
                      ].map(tag => (
                        <span key={tag.name} className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${tag.bg} text-slate-700 border border-white/50 shadow-sm backdrop-blur-sm`}>
                          {tag.name}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-blue-700 font-medium">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Estimated time: 1.5-2 minutes (Optimized)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700">Name</label>
                <p className="text-xs text-slate-500 mb-2">Enter the person&apos;s full name (optional)</p>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full border-0 bg-slate-50/80 backdrop-blur-sm rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white/90 transition-all duration-200 shadow-sm text-slate-800 placeholder-slate-400"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700">Photo</label>
                <p className="text-xs text-slate-500 mb-2">Upload a clear photo for better results (optional)</p>
                <label className="file-drop-new w-full" htmlFor="fileInput">
                  <input id="fileInput" type="file" accept="image/*" onChange={handleFile} className="hidden" />
                  <div className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-xl p-3 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer group">
                    <div className="w-6 h-6 rounded-lg bg-slate-200 group-hover:bg-blue-200 flex items-center justify-center transition-colors duration-200">
                      <svg className="h-3 w-3 text-slate-500 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5"></path>
                      </svg>
                    </div>
                    <div className="text-xs text-slate-600 group-hover:text-blue-700 font-medium">Click to upload image</div>
                  </div>
                </label>

                {preview && (
                  <div className="flex items-center gap-3 mt-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-sm">
                    <Image
                      src={preview}
                      alt="preview"
                      width={32}
                      height={32}
                      className="rounded-xl object-cover shadow-md border border-slate-200"
                    />
                    <div>
                      <div className="text-xs font-semibold text-slate-800">{file?.name}</div>
                      <div className="text-xs text-green-600 font-medium">✓ Ready for analysis</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                    <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-red-700 font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* Action Section */}
            <div className="text-center space-y-3 pt-3">
              <button
                type="submit"
                disabled={loading}
                className={`relative overflow-hidden w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 transform ${
                  loading 
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed scale-95' 
                    : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 hover:scale-105 hover:shadow-2xl active:scale-95 shadow-xl'
                }`}
              >
                {!loading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                )}
                <div className="relative flex items-center gap-3">
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                      Initializing Analysis...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Start Optimized Search
                      <span className="text-xs opacity-90 bg-white/20 px-2 py-1 rounded-full font-medium">1.5-2 min</span>
                    </>
                  )}
                </div>
              </button>
              
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">No data stored • Complete privacy guaranteed</span>
              </div>
            </div>
          </form>
        </div>

        <footer className="mt-6 text-center text-xs text-slate-400">
          <div className="inline-flex items-center gap-1">
            © 2025 All Rights Reserved • Created By 
            <a href="https://www.shahinasareen.tech" className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
              Shahina Sareen
            </a>
          </div>
        </footer>
      </div>
      </div>
    </div>
  )
}