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
      
      if (!storedResults) {
        storedResults = localStorage.getItem('lastSearchResults')
        storedTotalCount = localStorage.getItem('lastTotalResults')
      }
      
      if (!storedResults) {
        const q = router.query.results
        const parsed = q ? JSON.parse(q) : []
        setResults(parsed)
        setLoading(false)
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
      
      // Don't clear storage - keep it for potential navigation back
      // sessionStorage.removeItem('searchResults')
      // sessionStorage.removeItem('totalResults')
      // localStorage.removeItem('lastSearchResults')
      // localStorage.removeItem('lastTotalResults')
      
      if (totalCount > 0) {
        console.log(`Total results found: ${totalCount}`)
      }
      
      // Debug: Force some test results if we have zero results but should have some
      if (parsed.length === 0 && totalCount > 0) {
        console.log('🚨 ISSUE: Backend said we have results but frontend received none!')
        console.log('� StoredResults raw string:', storedResults)
        console.log('🚨 TotalCount:', totalCount)
        console.log('�🔧 Adding fallback test results...')
        const fallbackResults = [
          {
            source: "Search Results Available",
            preview: `The backend found ${totalCount} results but there was an issue transferring them to the frontend. Please try searching again.`,
            score: 0.8,
            platform: "System",
            search_type: "fallback",
            link: "#",
            verified_working: false
          }
        ]
        setResults(fallbackResults)
      }
      
      // Additional check - if we truly have no results at all
      if (parsed.length === 0 && totalCount === 0) {
        console.log('ℹ️ No results found - this is expected for some searches')
      }
    } catch (e) {
      console.error('Error parsing results:', e)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [router.isReady, router.query])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-gray-50">
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
              <h1 className="text-xl font-semibold text-slate-800">Search Results</h1>
              {results.length > 0 && (
                <div className="space-y-1">
                  <p className="text-sm text-slate-600">
                    Found <span className="font-bold text-slate-700">{results.length}</span> results across <span className="font-bold text-slate-700">{[...new Set(results.map(r => r.platform))].filter(Boolean).length}</span> platforms
                  </p>
                  <div className="flex flex-wrap gap-1 text-xs">
                    {[...new Set(results.map(r => r.platform))].filter(Boolean).slice(0, 8).map(platform => (
                      <span key={platform} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-medium border border-slate-200">
                        {platform} ({results.filter(r => r.platform === platform).length})
                      </span>
                    ))}
                    {[...new Set(results.map(r => r.platform))].filter(Boolean).length > 8 && (
                      <span className="bg-slate-50 text-slate-600 px-2 py-0.5 rounded-full font-medium border border-slate-200">
                        +{[...new Set(results.map(r => r.platform))].filter(Boolean).length - 8} more
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 text-xs mt-1">
                    <span className="text-slate-600 font-medium">
                      ✓ {results.filter(r => r.verified_content || r.verified_working).length} Verified
                    </span>
                    <span className="text-slate-600 font-medium">
                      📱 {results.filter(r => r.search_type?.includes('social')).length} Social Media
                    </span>
                    <span className="text-slate-600 font-medium">
                      💼 {results.filter(r => r.search_type?.includes('professional')).length} Professional
                    </span>
                    <span className="text-slate-600 font-medium">
                      🎓 {results.filter(r => r.search_type?.includes('academic')).length} Academic
                    </span>
                  </div>
                </div>
              )}
            </div>
            <Link href="/" className="text-sm text-slate-600 hover:text-slate-800 hover:underline font-medium transition-colors duration-200">
              ← New search
            </Link>
          </div>

        {loading ? (
          <div className="p-8 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-slate-200/40 flex items-center gap-3">
            <div className="h-8 w-8 animate-pulse rounded bg-slate-200" />
            <div className="w-full h-4 bg-slate-200 rounded"></div>
          </div>
        ) : results.length === 0 ? (
          <div className="p-8 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-slate-200/40 text-slate-600 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="font-semibold text-lg mb-2 text-slate-800">No results found</h3>
            <p className="text-sm text-slate-500">Try a different name or check your spelling</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Enhanced Results Summary */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200/60">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Search Results Summary</h3>
                  <p className="text-sm text-slate-600">Comprehensive digital footprint analysis</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div className="text-center p-3 bg-white rounded-lg border border-slate-200/50 shadow-sm">
                  <div className="text-2xl font-bold text-slate-700">{results.length}</div>
                  <div className="text-xs text-slate-600">Total Results</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border border-slate-200/50 shadow-sm">
                  <div className="text-2xl font-bold text-slate-700">{[...new Set(results.map(r => r.platform))].filter(Boolean).length}</div>
                  <div className="text-xs text-slate-600">Platforms</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border border-slate-200/50 shadow-sm">
                  <div className="text-2xl font-bold text-slate-700">{results.filter(r => r.verified_content || r.verified_working).length}</div>
                  <div className="text-xs text-slate-600">Verified</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border border-slate-200/50 shadow-sm">
                  <div className="text-2xl font-bold text-slate-700">{results.filter(r => (r.score || 0) >= 0.7).length}</div>
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
                  className="px-3 py-1 text-sm border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors duration-200"
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
                        className={`px-3 py-1 text-sm border border-slate-300 rounded-lg transition-colors duration-200 ${
                          currentPage === pageNum 
                            ? 'bg-slate-700 text-white border-slate-700' 
                            : 'hover:bg-slate-50'
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
                  className="px-3 py-1 text-sm border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors duration-200"
                >
                  Next
                </button>
              </div>
            )}

            {/* Results List */}
            <div className="space-y-4 results-container custom-scrollbar overflow-y-auto pb-8">
              {currentResults.map((r, i) => (
              <div key={i} className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-slate-200/40 p-4 transform transition duration-300 hover:scale-[1.01] hover:shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="text-sm font-medium text-slate-800">{r.source || 'Unknown source'}</div>
                        {r.platform && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            {r.platform}
                          </span>
                        )}
                        {r.search_type === 'real_mention_verified' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-200 text-slate-800 border border-slate-300">
                            REAL MENTION FOUND
                          </span>
                        )}
                        {r.search_type === 'public_content_verified' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-150 text-slate-700 border border-slate-250">
                            PUBLIC CONTENT
                          </span>
                        )}
                        {r.verified_content && (
                          <span className="inline-flex items-center px-1 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            CONTENT VERIFIED
                          </span>
                        )}
                        {r.context && (
                          <span className="inline-flex items-center px-1 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            WITH CONTEXT
                          </span>
                        )}
                        {r.search_type === 'professional_verified' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            Professional
                          </span>
                        )}
                        {r.search_type === 'media_verified' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-150 text-slate-700 border border-slate-250">
                            Media Platform
                          </span>
                        )}
                        {r.search_type === 'web_search_verified' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            Web Search
                          </span>
                        )}
                        {r.search_type === 'academic_verified' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-150 text-slate-700 border border-slate-250">
                            Academic
                          </span>
                        )}
                        {r.verified_working && (
                          <span className="inline-flex items-center px-1 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            VERIFIED LINK
                          </span>
                        )}
                        {r.search_type === 'social_media_verified' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            Verified Profile
                          </span>
                        )}
                        {r.search_type === 'social_media_search' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            Search Results
                          </span>
                        )}
                        {r.search_type === 'social_media_no_results' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
                            No Results
                          </span>
                        )}
                        {r.search_type === 'social_media_manual' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-150 text-slate-700 border border-slate-250">
                            Manual Check
                          </span>
                        )}
                        {r.search_type === 'social_media_accurate' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            Accurate Search
                          </span>
                        )}
                        {r.search_type === 'social_media' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            Social Media
                          </span>
                        )}
                        {r.search_type === 'web_search' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            Web
                          </span>
                        )}
                        {r.search_type === 'news_media' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-150 text-slate-700 border border-slate-250">
                            News & Media
                          </span>
                        )}
                        {r.search_type === 'academic_professional' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            Academic
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <span>Score:</span>
                        <span className={`font-medium ${
                          (r.score || 0) >= 0.7 ? 'text-slate-700' : 
                          (r.score || 0) >= 0.5 ? 'text-slate-600' : 'text-slate-500'
                        }`}>
                          {(r.score || 0).toFixed(2)}
                        </span>
                        {(r.score || 0) >= 0.8 && <span className="text-slate-700 text-xs font-bold">HIGH</span>}
                      </div>
                    </div>

                    {r.preview && <p className="mt-2 text-sm text-slate-600">{r.preview.slice(0, 350)}{r.preview.length > 350 ? '…' : ''}</p>}
                    
                    {r.context && (
                      <div className="mt-2 p-2 bg-slate-50 rounded-md border-l-2 border-slate-300">
                        <p className="text-xs text-slate-700 font-medium">Content Context:</p>
                        <p className="text-sm text-slate-600 italic">&ldquo;{r.context.slice(0, 200)}...&rdquo;</p>
                      </div>
                    )}

                    {r.title && r.snippet && (
                      <div className="mt-2 p-2 bg-slate-100 rounded-md border-l-2 border-slate-400">
                        <p className="text-xs text-slate-700 font-medium">Found In:</p>
                        <p className="text-sm text-slate-800 font-semibold">{r.title.slice(0, 100)}...</p>
                        <p className="text-sm text-slate-700">{r.snippet.slice(0, 150)}...</p>
                      </div>
                    )}

                    <div className="mt-3 flex gap-2">
                      {r.link && (
                        <a href={r.link} target="_blank" rel="noreferrer" className="inline-block text-sm text-slate-600 hover:text-slate-800 hover:underline font-medium transition-colors duration-200">
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
                  className="px-3 py-1 text-sm border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors duration-200"
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
                        className={`px-3 py-1 text-sm border border-slate-300 rounded-lg transition-colors duration-200 ${
                          currentPage === pageNum 
                            ? 'bg-slate-700 text-white border-slate-700' 
                            : 'hover:bg-slate-50'
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
                  className="px-3 py-1 text-sm border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors duration-200"
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
