import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Results() {
  const router = useRouter()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [resultsPerPage] = useState(25) // Show 25 results per page

  // Pagination logic
  const indexOfLastResult = currentPage * resultsPerPage
  const indexOfFirstResult = indexOfLastResult - resultsPerPage
  const currentResults = results.slice(indexOfFirstResult, indexOfLastResult)
  const totalPages = Math.ceil(results.length / resultsPerPage)

  // Scroll to top when page changes
  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    if (!router.isReady) return
    try {
      // Get results from sessionStorage instead of URL query
      let storedResults = sessionStorage.getItem('searchResults')
      let storedTotalCount = sessionStorage.getItem('totalResults')
      
      // Fallback to localStorage if sessionStorage is empty
      if (!storedResults) {
        console.log('📋 Results page: No sessionStorage, checking localStorage...')
        storedResults = localStorage.getItem('lastSearchResults')
        storedTotalCount = localStorage.getItem('lastTotalResults')
      }
      
      if (!storedResults) {
        console.warn('No results found in sessionStorage or localStorage, checking URL query as fallback')
        // Fallback to URL query if both storage methods are empty
        const q = router.query.results
        const totalCount = router.query.totalResults
        const parsed = q ? JSON.parse(q) : []
        setResults(parsed)
        if (totalCount) {
          console.log(`Fallback - Total results found: ${totalCount}`)
        }
        return
      }
      
      const parsed = storedResults ? JSON.parse(storedResults) : []
      const totalCount = storedTotalCount ? parseInt(storedTotalCount) : 0
      
      console.log('🔍 Results page: storedResults raw:', storedResults)
      console.log('🔍 Results page: parsed results:', parsed)
      console.log('🔍 Results page: Results received:', parsed.length, 'results')
      console.log('📊 Results page: Total results from backend:', totalCount)
      console.log('📋 Results page: Results data sample:', parsed.slice(0, 3))
      
      // Force set results even if empty array
      setResults(parsed)
      
      // Clear storage after use
      sessionStorage.removeItem('searchResults')
      sessionStorage.removeItem('totalResults')
      localStorage.removeItem('lastSearchResults')
      localStorage.removeItem('lastTotalResults')
      
      if (totalCount > 0) {
        console.log(`Total results found: ${totalCount}`)
      }
      
      // Debug: Force some test results if we have zero results but should have some
      if (parsed.length === 0 && totalCount > 0) {
        console.log('🚨 ISSUE: Backend said we have results but frontend received none!')
        console.log('🔧 Adding fallback test results...')
        const fallbackResults = [
          {
            source: "Search Results Available",
            preview: "The backend found results but there was an issue transferring them to the frontend. Please try searching again.",
            score: 0.8,
            platform: "System",
            search_type: "fallback",
            link: "#"
          }
        ]
        setResults(fallbackResults)
      }
    } catch (e) {
      console.error('Error parsing results:', e)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [router.isReady, router.query])

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx global>{`
        .custom-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar:hover {
          scrollbar-width: thin;
        }
        .custom-scrollbar:hover::-webkit-scrollbar {
          display: block;
          width: 4px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 2px;
        }
        .results-container {
          max-height: none !important;
        }
        @media (max-width: 768px) {
          .results-container {
            max-height: calc(100vh - 180px);
          }
        }
      `}</style>
      <div className="w-full">
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
            <div>
              <h1 className="text-xl font-semibold">Search Results</h1>
              {results.length > 0 && (
                <div className="space-y-1">
                  <p className="text-sm text-slate-600">
                    Found <span className="font-bold text-green-600">{results.length}</span> results across <span className="font-bold text-blue-600">{[...new Set(results.map(r => r.platform))].filter(Boolean).length}</span> platforms
                  </p>
                  <div className="flex flex-wrap gap-1 text-xs">
                    {[...new Set(results.map(r => r.platform))].filter(Boolean).slice(0, 8).map(platform => (
                      <span key={platform} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
                        {platform} ({results.filter(r => r.platform === platform).length})
                      </span>
                    ))}
                    {[...new Set(results.map(r => r.platform))].filter(Boolean).length > 8 && (
                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                        +{[...new Set(results.map(r => r.platform))].filter(Boolean).length - 8} more
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 text-xs mt-1">
                    <span className="text-green-600 font-medium">
                      ✓ {results.filter(r => r.verified_content || r.verified_working).length} Verified
                    </span>
                    <span className="text-blue-600 font-medium">
                      📱 {results.filter(r => r.search_type?.includes('social')).length} Social Media
                    </span>
                    <span className="text-purple-600 font-medium">
                      💼 {results.filter(r => r.search_type?.includes('professional')).length} Professional
                    </span>
                    <span className="text-orange-600 font-medium">
                      🎓 {results.filter(r => r.search_type?.includes('academic')).length} Academic
                    </span>
                  </div>
                </div>
              )}
            </div>
            <Link href="/" className="text-sm text-indigo-600 hover:underline font-medium">
              ← New search
            </Link>
          </div>

        {loading ? (
          <div className="p-8 bg-white rounded-xl shadow flex items-center gap-3">
            <div className="h-8 w-8 animate-pulse rounded bg-indigo-200" />
            <div className="w-full h-4 bg-gray-200 rounded"></div>
          </div>
        ) : results.length === 0 ? (
          <div className="p-8 bg-white rounded-xl shadow text-slate-600 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="font-semibold text-lg mb-2">No results found</h3>
            <p className="text-sm text-slate-500">Try a different name or check your spelling</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Enhanced Results Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                  📊
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Search Results Summary</h3>
                  <p className="text-sm text-slate-600">Comprehensive digital footprint analysis</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="text-2xl font-bold text-green-600">{results.length}</div>
                  <div className="text-xs text-slate-600">Total Results</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="text-2xl font-bold text-blue-600">{[...new Set(results.map(r => r.platform))].filter(Boolean).length}</div>
                  <div className="text-xs text-slate-600">Platforms</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="text-2xl font-bold text-purple-600">{results.filter(r => r.verified_content || r.verified_working).length}</div>
                  <div className="text-xs text-slate-600">Verified</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="text-2xl font-bold text-orange-600">{results.filter(r => (r.score || 0) >= 0.7).length}</div>
                  <div className="text-xs text-slate-600">High Quality</div>
                </div>
              </div>

              {results.length > resultsPerPage && (
                <div className="text-center text-sm text-slate-600">
                  Showing {indexOfFirstResult + 1}-{Math.min(indexOfLastResult, results.length)} of {results.length} results
                  (Page {currentPage} of {totalPages})
                </div>
              )}
            </div>

            {/* Pagination Controls - Top */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 flex-wrap">
                <button
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50"
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, index) => {
                  const pageNum = index + 1
                  if (
                    pageNum === 1 || 
                    pageNum === totalPages || 
                    (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 text-sm border rounded-lg ${
                          currentPage === pageNum 
                            ? 'bg-blue-600 text-white' 
                            : 'hover:bg-blue-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  } else if (pageNum === currentPage - 3 || pageNum === currentPage + 3) {
                    return <span key={pageNum} className="px-2 text-slate-400">...</span>
                  }
                  return null
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50"
                >
                  Next
                </button>
              </div>
            )}

            {/* Results List */}
            <div className="space-y-4 results-container custom-scrollbar overflow-y-auto pb-8">
              {currentResults.map((r, i) => (
              <div key={i} className="bg-white rounded-xl shadow p-4 transform transition duration-300 hover:scale-[1.01]">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="text-sm font-medium text-slate-800">{r.source || 'Unknown source'}</div>
                        {r.platform && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {r.platform}
                          </span>
                        )}
                        {r.search_type === 'real_mention_verified' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            REAL MENTION FOUND
                          </span>
                        )}
                        {r.search_type === 'public_content_verified' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            PUBLIC CONTENT
                          </span>
                        )}
                        {r.verified_content && (
                          <span className="inline-flex items-center px-1 py-0.5 rounded text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                            CONTENT VERIFIED
                          </span>
                        )}
                        {r.context && (
                          <span className="inline-flex items-center px-1 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                            WITH CONTEXT
                          </span>
                        )}
                        {r.search_type === 'professional_verified' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Professional
                          </span>
                        )}
                        {r.search_type === 'media_verified' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Media Platform
                          </span>
                        )}
                        {r.search_type === 'web_search_verified' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Web Search
                          </span>
                        )}
                        {r.search_type === 'academic_verified' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            Academic
                          </span>
                        )}
                        {r.verified_working && (
                          <span className="inline-flex items-center px-1 py-0.5 rounded text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                            VERIFIED LINK
                          </span>
                        )}
                        {r.search_type === 'social_media_verified' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Verified Profile
                          </span>
                        )}
                        {r.search_type === 'social_media_search' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Search Results
                          </span>
                        )}
                        {r.search_type === 'social_media_no_results' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            No Results
                          </span>
                        )}
                        {r.search_type === 'social_media_manual' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Manual Check
                          </span>
                        )}
                        {r.search_type === 'social_media_accurate' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Accurate Search
                          </span>
                        )}
                        {r.search_type === 'social_media' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Social Media
                          </span>
                        )}
                        {r.search_type === 'web_search' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Web
                          </span>
                        )}
                        {r.search_type === 'news_media' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            News & Media
                          </span>
                        )}
                        {r.search_type === 'academic_professional' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Academic
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <span>Score:</span>
                        <span className={`font-medium ${(r.score || 0) >= 0.7 ? 'text-green-600' : (r.score || 0) >= 0.5 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {(r.score || 0).toFixed(2)}
                        </span>
                        {(r.score || 0) >= 0.8 && <span className="text-green-500 text-xs font-bold">HIGH</span>}
                      </div>
                    </div>

                    {r.preview && <p className="mt-2 text-sm text-slate-600">{r.preview.slice(0, 350)}{r.preview.length > 350 ? '…' : ''}</p>}
                    
                    {r.context && (
                      <div className="mt-2 p-2 bg-blue-50 rounded-md border-l-2 border-blue-200">
                        <p className="text-xs text-blue-700 font-medium">Content Context:</p>
                        <p className="text-sm text-blue-800 italic">&ldquo;{r.context.slice(0, 200)}...&rdquo;</p>
                      </div>
                    )}

                    {r.title && r.snippet && (
                      <div className="mt-2 p-2 bg-green-50 rounded-md border-l-2 border-green-200">
                        <p className="text-xs text-green-700 font-medium">Found In:</p>
                        <p className="text-sm text-green-800 font-semibold">{r.title.slice(0, 100)}...</p>
                        <p className="text-sm text-green-700">{r.snippet.slice(0, 150)}...</p>
                      </div>
                    )}

                    <div className="mt-3 flex gap-2">
                      {r.link && (
                        <a href={r.link} target="_blank" rel="noreferrer" className="inline-block text-sm text-indigo-600 hover:underline font-medium">
                          {r.search_type === 'real_mention_verified' ? 'View Real Mention →' :
                           r.search_type === 'public_content_verified' ? 'View Public Content →' :
                           r.verified_content ? 'View Verified Content →' :
                           r.verified_working ? 'Open Direct Link →' :
                           r.search_type === 'social_media_verified' ? 'View Profile →' : 
                           r.search_type === 'professional_verified' ? 'Search Platform →' :
                           r.search_type === 'media_verified' ? 'Search Media →' :
                           r.search_type === 'web_search_verified' ? 'Web Search →' :
                           r.search_type === 'academic_verified' ? 'Academic Search →' :
                           'Search Platform →'}
                        </a>
                      )}
                      {r.platform && !r.link && (
                        <span className="text-xs text-slate-400">
                          Platform: {r.platform} • Direct search recommended
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            </div>

            {/* Pagination Controls - Bottom */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 flex-wrap mt-6">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50"
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, index) => {
                  const pageNum = index + 1
                  if (
                    pageNum === 1 || 
                    pageNum === totalPages || 
                    (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 text-sm border rounded-lg ${
                          currentPage === pageNum 
                            ? 'bg-blue-600 text-white' 
                            : 'hover:bg-blue-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  } else if (pageNum === currentPage - 3 || pageNum === currentPage + 3) {
                    return <span key={pageNum} className="px-2 text-slate-400">...</span>
                  }
                  return null
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
