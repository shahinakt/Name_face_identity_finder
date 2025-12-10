# Project Manifest - File Reference

## Active Source Files

### Backend (7 files)

1. **main.py** (107 lines)
   - Purpose: FastAPI application entry point
   - Endpoints: GET `/`, GET `/health`, POST `/search`, POST `/search-stream`
   - Key: Lightweight, clean API server

2. **optimized_search.py** (948 lines)
   - Purpose: Search orchestration and result processing
   - Key Functions:
     - `optimized_search_identity()` - Main search dispatcher
     - `search_social_media_via_google()` - Social media search
     - `search_professional_networks()` - LinkedIn, GitHub search
     - `search_academic_platforms()` - Scholar, ResearchGate
     - `search_web_content()` - General web search
     - `process_and_rank_results()` - Result ranking

3. **search.py** (3218 lines)
   - Purpose: Core scraping and identity search
   - Key Functions:
     - `extract_actual_web_content()` - Comprehensive web scraping
     - `scrape_instagram_directly()` - Instagram scraping
     - `scrape_twitter_directly()` - Twitter scraping
     - `search_identity_enhanced_comprehensive()` - Enhanced search
   - Note: Large file, contains all platform-specific scrapers

4. **enhanced_scraping.py** (920 lines)
   - Purpose: Advanced activity and engagement scraping
   - Key Classes:
     - `EnhancedDataScraper` - User activity scraper
   - Features: Activity detection, engagement metrics, interaction tracking

5. **advanced_google_scraper.py** (707 lines)
   - Purpose: Advanced Google search across categories
   - Key Classes:
     - `AdvancedGoogleScraper` - Multi-category Google search
   - Coverage: Social, professional, academic, news, forums, images

6. **utils.py** (47 lines)
   - Purpose: Utility functions
   - Functions:
     - `cosine_similarity()` - Vector similarity computation
     - `cleanup_file()` - File cleanup
     - `preprocess_image_for_face_detection()` - Image preprocessing

7. **requirements.txt**
   - Purpose: Python dependencies
   - Key: FastAPI, BeautifulSoup4, DeepFace, TensorFlow, OpenCV

### Frontend (10 files)

#### Pages (4 files)
1. **pages/_app.js**
   - Purpose: Next.js app wrapper
   - Role: Global state and layout

2. **pages/_document.js**
   - Purpose: Custom Next.js document
   - Role: HTML wrapper, head configuration

3. **pages/index.js** (280 lines)
   - Purpose: Home/search page
   - Features: Name input, image upload, search submission
   - State: Loading, errors, results

4. **pages/results.js** (470 lines)
   - Purpose: Results display page
   - Features: Result list, pagination, platform filters
   - State: Results, loading, pagination

#### Components (3 files)
1. **components/OptimizedSearchProgress.js**
   - Purpose: Search progress visualization
   - Features: Stage tracking, progress bar, time estimate

2. **components/MiniSearchStatus.js**
   - Purpose: Compact search status display
   - Features: Real-time status updates

3. **components/Icon.js**
   - Purpose: Icon component library
   - Role: SVG icon rendering

#### Styles (1 file)
1. **styles/globals.css**
   - Purpose: Global styles
   - Framework: Tailwind CSS

#### Configuration (6 files)
1. **package.json** - Dependencies and scripts
2. **package-lock.json** - Locked dependency versions
3. **next.config.mjs** - Next.js configuration
4. **postcss.config.js** - PostCSS configuration
5. **tailwind.config.js** - Tailwind CSS configuration
6. **jsconfig.json** - JavaScript project configuration
7. **.vscode/settings.json** - VS Code settings

### Project Root Files

1. **README.md** (60 lines)
   - Setup instructions
   - Feature overview
   - API documentation
   - Quick start guide

2. **CLEANUP_SUMMARY.md**
   - Cleanup metrics
   - Code quality improvements
   - What was removed

3. **FILES_CHANGED.md**
   - Detailed change log
   - Before/after comparisons
   - Line count reductions

4. **PROJECT_MANIFEST.md** (this file)
   - Complete file reference
   - Purpose documentation
   - File relationships

5. **LICENSE**
   - MIT license terms

## File Dependencies

```
main.py
  └── optimized_search.py
       ├── search.py
       ├── enhanced_scraping.py
       ├── advanced_google_scraper.py
       └── utils.py

frontend/pages/index.js
  ├── components/OptimizedSearchProgress.js
  ├── components/MiniSearchStatus.js
  └── next/router

frontend/pages/results.js
  ├── next/router
  └── next/link

All frontend
  └── styles/globals.css
```

## Active API Endpoints

1. **GET /?**
   - Purpose: Root health check
   - Response: Status JSON

2. **GET /health**
   - Purpose: Service health
   - Response: Health status

3. **POST /search**
   - Parameters: name (optional), file (optional)
   - Returns: Search results

4. **POST /search-stream**
   - Parameters: name (optional), file (optional)
   - Returns: Event stream with progress updates

## Feature Matrix

| Feature | Backend | Frontend | Status |
|---------|---------|----------|--------|
| Name Search | ✅ search.py | ✅ index.js | Working |
| Image Search | ✅ utils.py + search.py | ✅ index.js | Working |
| Progress Tracking | ✅ optimized_search.py | ✅ OptimizedSearchProgress.js | Working |
| Result Display | ✅ optimized_search.py | ✅ results.js | Working |
| Pagination | ❌ | ✅ results.js | Working |
| Result Filtering | ❌ | ✅ results.js (partial) | Working |
| Real-time Updates | ✅ /search-stream | ✅ MiniSearchStatus.js | Working |

## Data Flow

```
User Input (Frontend)
  ↓
index.js → /search or /search-stream
  ↓
main.py → optimized_search_identity()
  ↓
optimized_search.py → Multiple search functions
  ↓
search.py + enhanced_scraping.py + advanced_google_scraper.py
  ↓
Results Processing
  ↓
JSON Response
  ↓
results.js → Display & Pagination
```

## Performance Notes

- Backend total: ~6,000 LOC (core scraping)
- Frontend total: ~800 LOC (UI)
- Main.py: 107 lines (minimal overhead)
- Largest file: search.py (3218 lines, core logic)
- Typical search time: 30-90 seconds

## Testing Status

✅ Python syntax validation: PASS
✅ JavaScript syntax validation: PASS
✅ Import chain validation: PASS
✅ API endpoint routing: PASS
✅ Component rendering: READY
✅ Data flow: VALIDATED

## Maintenance Points

1. search.py - Core scraping logic (monitor for site changes)
2. advanced_google_scraper.py - Google search logic
3. utils.py - Utility functions (stable)
4. main.py - API routes (stable)
5. Frontend components - UI state management

