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
        const errorText = await res.text()
        console.error('Server response error:', res.status, errorText)
        throw new Error(`Server error (${res.status}): ${errorText}`)
      }
      
      const body = await res.json()
      
      if (!body.results || !Array.isArray(body.results)) {
        throw new Error('Invalid results format')
      }
      
      setResultsData({ 
        totalResults: body.total_results || body.results?.length || 0,
        searchComplete: true
      })
      
      const results = body.results || []
      const totalResults = body.total_results || results.length || 0
      
      sessionStorage.setItem('searchResults', JSON.stringify(results))
      sessionStorage.setItem('totalResults', String(totalResults))
      localStorage.setItem('lastSearchResults', JSON.stringify(results))
      localStorage.setItem('lastTotalResults', String(totalResults))
      
      setTimeout(() => {
        setLoading(false)
        router.push('/results')
      }, 3000)
      
    } catch (err) {
      console.error('Search error details:', err)
      
      // Provide more specific error messages
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setError('Cannot connect to server. Please ensure the backend is running on port 8001.')
      } else if (err.message.includes('500')) {
        setError('Server error occurred. Please check the backend logs.')
      } else if (err.message.includes('422')) {
        setError('Invalid request. Please check your input.')
      } else {
        setError(`Search failed: ${err.message || 'Unknown error'}. Please check if the backend is running.`)
      }
    } finally {
      setLoading(false)
      // release preview URL
      if (preview) URL.revokeObjectURL(preview)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-gray-50 flex items-center justify-center px-4 py-8">
      {/* Enhanced Search Progress Overlay */}
      <OptimizedSearchProgress 
        isSearching={loading} 
        onCancel={handleCancelSearch} 
        resultsData={resultsData}
      />
      
      {/* Mini Status Updates */}
      <MiniSearchStatus isSearching={loading} />
      
      <div className="w-full max-w-4xl">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/40 p-6 transform transition-all duration-300 hover:shadow-3xl">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent mb-2">
              Digital Footprint Checker
            </h1>
            <p className="text-slate-600 text-xs font-medium">
              Privacy-first web demo • No sign-up • No data stored
            </p>
          </div>

          <form onSubmit={submit} className="space-y-6">
            {/* Search Information Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50 rounded-2xl p-4 border border-slate-200/50">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-50 to-slate-100 opacity-80"></div>
              <div className="relative">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 mb-2 text-base">Optimized Digital Footprint Search</h3>
                    <p className="text-slate-700 mb-3 leading-relaxed text-sm">
                      Enhanced search engine using Google-based queries for better performance. 
                      Scans across 6+ platform categories with improved speed.
                    </p>
                    
                    {/* Platform Categories */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {[
                        { name: 'Social Media', color: 'from-slate-500 to-slate-600', bg: 'bg-slate-100' },
                        { name: 'Professional', color: 'from-slate-600 to-slate-700', bg: 'bg-slate-200' },
                        { name: 'Academic', color: 'from-slate-500 to-slate-600', bg: 'bg-slate-100' },
                        { name: 'News & Media', color: 'from-slate-600 to-slate-700', bg: 'bg-slate-200' },
                        { name: 'Web Content', color: 'from-slate-500 to-slate-600', bg: 'bg-slate-100' }
                      ].map(tag => (
                        <span key={tag.name} className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${tag.bg} text-slate-700 border border-slate-300/50 shadow-sm backdrop-blur-sm`}>
                          {tag.name}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
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
                  className="w-full border-0 bg-slate-50/80 backdrop-blur-sm rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-slate-500/30 focus:bg-white/90 transition-all duration-200 shadow-sm text-slate-800 placeholder-slate-400"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700">Photo</label>
                <p className="text-xs text-slate-500 mb-2">Upload a clear photo for better results (optional)</p>
                <label className="file-drop-new w-full" htmlFor="fileInput">
                  <input id="fileInput" type="file" accept="image/*" onChange={handleFile} className="hidden" />
                  <div className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-xl p-3 hover:border-slate-400 hover:bg-slate-100/50 transition-all duration-200 cursor-pointer group">
                    <div className="w-6 h-6 rounded-lg bg-slate-200 group-hover:bg-slate-300 flex items-center justify-center transition-colors duration-200">
                      <svg className="h-3 w-3 text-slate-500 group-hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5"></path>
                      </svg>
                    </div>
                    <div className="text-xs text-slate-600 group-hover:text-slate-700 font-medium">Click to upload image</div>
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
                      <div className="text-xs text-slate-600 font-medium">✓ Ready for analysis</div>
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
                    : 'bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 text-white hover:from-slate-800 hover:via-slate-900 hover:to-slate-900 hover:scale-105 hover:shadow-2xl active:scale-95 shadow-xl'
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
                <svg className="w-3 h-3 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
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
            <a href="https://www.shahinasareen.tech" className="text-slate-600 hover:text-slate-700 font-medium transition-colors duration-200">
              Shahina Sareen
            </a>
          </div>
        </footer>
      </div>
    </div>
  )
}