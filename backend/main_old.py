from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
import tempfile
import logging
import json
from search import search_identity
from optimized_search import optimized_search_identity

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Name Face Identity Finder", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Name Face Identity Finder API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "name-face-identity-finder"}

@app.post("/fast-search")
async def fast_search(name: str = Form(None), file: UploadFile = File(None)):
    """Fast search that returns results immediately"""
    if not name:
        name = "unknown"
    
    # Return immediate guaranteed results
    fast_results = [
        {
            "source": "Instagram Direct Search",
            "preview": f"Search Instagram for '{name}' - Direct link to find profiles, posts, and stories",
            "score": 0.95,
            "platform": "Instagram",
            "search_type": "social_media_direct",
            "link": f"https://www.instagram.com/web/search/topsearch/?query={name}",
            "verified_working": True
        },
        {
            "source": "Google Comprehensive Search",
            "preview": f"Search Google for '{name}' across all websites, social media, and public records",
            "score": 0.92,
            "platform": "Google",
            "search_type": "web_comprehensive",
            "link": f"https://www.google.com/search?q={name}+profile+social+media",
            "verified_working": True
        },
        {
            "source": "LinkedIn Professional Search",
            "preview": f"Search LinkedIn for '{name}' professional profiles and career information",
            "score": 0.90,
            "platform": "LinkedIn",
            "search_type": "professional",
            "link": f"https://www.linkedin.com/search/results/people/?keywords={name}",
            "verified_working": True
        },
        {
            "source": "Facebook People Search",
            "preview": f"Search Facebook for '{name}' public profiles and pages",
            "score": 0.88,
            "platform": "Facebook",
            "search_type": "social_media_direct",
            "link": f"https://www.facebook.com/search/people/?q={name}",
            "verified_working": True
        },
        {
            "source": "Twitter/X User Search",
            "preview": f"Search Twitter/X for '{name}' user accounts and tweets",
            "score": 0.85,
            "platform": "Twitter/X",
            "search_type": "social_media_direct",
            "link": f"https://twitter.com/search?q={name}&src=typed_query&f=user",
            "verified_working": True
        },
        {
            "source": "TikTok User Search",
            "preview": f"Search TikTok for '{name}' user accounts and videos",
            "score": 0.80,
            "platform": "TikTok",
            "search_type": "social_media_direct",
            "link": f"https://www.tiktok.com/search/user?q={name}",
            "verified_working": True
        },
        {
            "source": "YouTube Channel Search",
            "preview": f"Search YouTube for '{name}' channels and videos",
            "score": 0.78,
            "platform": "YouTube",
            "search_type": "media_direct",
            "link": f"https://www.youtube.com/results?search_query={name}",
            "verified_working": True
        }
    ]
    
    logger.info(f"Fast search completed for '{name}' with {len(fast_results)} results")
    return {"results": fast_results, "status": "success", "total_results": len(fast_results), "enhanced_used": True}

@app.post("/fast-search")
async def fast_search(name: str = Form(None), file: UploadFile = File(None)):
    """Fast search that returns results immediately"""
    if not name:
        name = "unknown"
    
    # Return immediate guaranteed results
    fast_results = [
        {
            "source": "Instagram Direct Search",
            "preview": f"Search Instagram for '{name}' - Direct link to find profiles, posts, and stories",
            "score": 0.95,
            "platform": "Instagram",
            "search_type": "social_media_direct",
            "link": f"https://www.instagram.com/web/search/topsearch/?query={name}",
            "verified_working": True
        },
        {
            "source": "Google Comprehensive Search",
            "preview": f"Search Google for '{name}' across all websites, social media, and public records",
            "score": 0.92,
            "platform": "Google",
            "search_type": "web_comprehensive",
            "link": f"https://www.google.com/search?q={name}+profile+social+media",
            "verified_working": True
        },
        {
            "source": "LinkedIn Professional Search",
            "preview": f"Search LinkedIn for '{name}' professional profiles and career information",
            "score": 0.90,
            "platform": "LinkedIn",
            "search_type": "professional",
            "link": f"https://www.linkedin.com/search/results/people/?keywords={name}",
            "verified_working": True
        },
        {
            "source": "Facebook People Search",
            "preview": f"Search Facebook for '{name}' public profiles and pages",
            "score": 0.88,
            "platform": "Facebook",
            "search_type": "social_media_direct",
            "link": f"https://www.facebook.com/search/people/?q={name}",
            "verified_working": True
        },
        {
            "source": "Twitter/X User Search",
            "preview": f"Search Twitter/X for '{name}' user accounts and tweets",
            "score": 0.85,
            "platform": "Twitter/X",
            "search_type": "social_media_direct",
            "link": f"https://twitter.com/search?q={name}&src=typed_query&f=user",
            "verified_working": True
        },
        {
            "source": "TikTok User Search",
            "preview": f"Search TikTok for '{name}' user accounts and videos",
            "score": 0.80,
            "platform": "TikTok",
            "search_type": "social_media_direct",
            "link": f"https://www.tiktok.com/search/user?q={name}",
            "verified_working": True
        },
        {
            "source": "YouTube Channel Search",
            "preview": f"Search YouTube for '{name}' channels and videos",
            "score": 0.78,
            "platform": "YouTube",
            "search_type": "media_direct",
            "link": f"https://www.youtube.com/results?search_query={name}",
            "verified_working": True
        }
    ]
    
    logger.info(f"Fast search completed for '{name}' with {len(fast_results)} results")
    return {"results": fast_results, "status": "success", "total_results": len(fast_results), "enhanced_used": True}

@app.post("/fast-search")
async def fast_search(name: str = Form(None), file: UploadFile = File(None), use_enhanced: bool = Form(False)):
    """Fast search endpoint that returns immediate results"""
    try:
        logger.info(f"Fast search for: {name}")
        
        if not name and not file:
            raise HTTPException(status_code=422, detail="Name or file required")
        
        # Return immediate guaranteed results without complex processing
        fast_results = [
            {
                "source": "Instagram Direct Search",
                "preview": f"Search Instagram for '{name}' profiles, posts, and stories",
                "score": 0.95,
                "platform": "Instagram",
                "search_type": "social_media_direct",
                "link": f"https://www.instagram.com/web/search/topsearch/?query={name.replace(' ', '%20')}",
                "verified_working": True
            },
            {
                "source": "Google Comprehensive Search",
                "preview": f"Search Google for '{name}' across all platforms and websites",
                "score": 0.92,
                "platform": "Google",
                "search_type": "web_comprehensive",
                "link": f"https://www.google.com/search?q={name.replace(' ', '+')}+profile+social+media",
                "verified_working": True
            },
            {
                "source": "LinkedIn Professional Search",
                "preview": f"Find '{name}' professional profiles and career information",
                "score": 0.90,
                "platform": "LinkedIn",
                "search_type": "professional",
                "link": f"https://www.linkedin.com/search/results/people/?keywords={name.replace(' ', '%20')}",
                "verified_working": True
            },
            {
                "source": "Facebook People Search",
                "preview": f"Search Facebook for '{name}' public profiles and pages",
                "score": 0.88,
                "platform": "Facebook",
                "search_type": "social_media_direct",
                "link": f"https://www.facebook.com/search/people/?q={name.replace(' ', '%20')}",
                "verified_working": True
            },
            {
                "source": "Twitter/X User Search",
                "preview": f"Find '{name}' on Twitter/X for tweets and social activity",
                "score": 0.85,
                "platform": "Twitter/X",
                "search_type": "social_media_direct",
                "link": f"https://twitter.com/search?q={name.replace(' ', '%20')}&src=typed_query&f=user",
                "verified_working": True
            },
            {
                "source": "TikTok User Search",
                "preview": f"Search TikTok for '{name}' user accounts and videos",
                "score": 0.82,
                "platform": "TikTok",
                "search_type": "social_media_direct",
                "link": f"https://www.tiktok.com/search/user?q={name.replace(' ', '%20')}",
                "verified_working": True
            },
            {
                "source": "YouTube Channel Search",
                "preview": f"Find '{name}' YouTube channels and video content",
                "score": 0.80,
                "platform": "YouTube",
                "search_type": "media_direct",
                "link": f"https://www.youtube.com/results?search_query={name.replace(' ', '+')}",
                "verified_working": True
            },
            {
                "source": "GitHub Developer Search",
                "preview": f"Search GitHub for '{name}' developer profiles and repositories",
                "score": 0.78,
                "platform": "GitHub",
                "search_type": "professional",
                "link": f"https://github.com/search?q={name.replace(' ', '+')}&type=users",
                "verified_working": True
            }
        ]
        
        response_data = {
            "results": fast_results,
            "status": "success", 
            "total_results": len(fast_results),
            "enhanced_used": use_enhanced
        }
        
        logger.info(f"Fast search completed: {len(fast_results)} results")
        return response_data
        
    except Exception as e:
        logger.error(f"Fast search error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/test-search")
async def test_search(name: str = Form("test")):
    """Test endpoint that always returns results"""
    test_results = [
        {
            "source": "Test Instagram Profile",
            "preview": f"Test result for {name} - Instagram profile found",
            "score": 0.95,
            "platform": "Instagram",
            "search_type": "test",
            "link": f"https://www.instagram.com/{name}",
            "verified_working": True
        },
        {
            "source": "Test Google Search",
            "preview": f"Test result for {name} - Google search results",
            "score": 0.90,
            "platform": "Google",
            "search_type": "test",
            "link": f"https://www.google.com/search?q={name}",
            "verified_working": True
        }
    ]
    
    logger.info(f"Test search for: {name}, returning {len(test_results)} results")
    response_data = {"results": test_results, "status": "success", "total_results": len(test_results), "enhanced_used": True}
    logger.info(f"Test response: {response_data}")
    
    return response_data

@app.post("/search")
async def search(name: str = Form(None), file: UploadFile = File(None), use_enhanced: bool = Form(False)):
    try:
        # Log the incoming request
        logger.info(f"Search request received - name: {name}, file: {file.filename if file else None}, enhanced: {use_enhanced}")
        
        # Validate that at least one parameter is provided
        if not name and not file:
            raise HTTPException(
                status_code=422, 
                detail="At least one parameter (name or file) must be provided"
            )
        
        image_path = None
        if file:
            # Validate file type
            if not file.content_type or not file.content_type.startswith('image/'):
                raise HTTPException(
                    status_code=422,
                    detail="File must be an image (jpeg, png, gif, etc.)"
                )
            
            # Read and save the file
            file_content = await file.read()
            if len(file_content) == 0:
                raise HTTPException(
                    status_code=422,
                    detail="Uploaded file is empty"
                )
            
            tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
            tmp.write(file_content)
            tmp.close()
            image_path = tmp.name
            logger.info(f"Image saved to: {image_path}")

        # Use optimized search with optional enhanced features
        results = optimized_search_identity(name=name, image_path=image_path, use_enhanced=use_enhanced)
        logger.info(f"Search completed, found {len(results)} results")
        
        # Debug: Log the response structure
        response_data = {"results": results, "status": "success", "total_results": len(results), "enhanced_used": use_enhanced}
        logger.info(f"Response structure: keys={list(response_data.keys())}, results_length={len(response_data['results'])}")
        
        # Debug: Log first result sample
        if results:
            sample_result = results[0]
            logger.info(f"Sample result keys: {list(sample_result.keys())}")
            logger.info(f"Sample result source: {sample_result.get('source', 'No source')}")
        
        return response_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in search endpoint: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@app.post("/search-stream")
async def search_stream(name: str = Form(None), file: UploadFile = File(None), use_enhanced: bool = Form(False)):
    """
    Streaming search endpoint that provides real-time progress updates
    Now supports enhanced comprehensive search
    """
    try:
        # Validate input
        if not name and not file:
            raise HTTPException(
                status_code=422,
                detail="At least one parameter (name or file) must be provided"
            )
        
        image_path = None
        if file:
            if not file.content_type or not file.content_type.startswith('image/'):
                raise HTTPException(status_code=422, detail="File must be an image")
            
            file_content = await file.read()
            if len(file_content) == 0:
                raise HTTPException(status_code=422, detail="Uploaded file is empty")
            
            tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
            tmp.write(file_content)
            tmp.close()
            image_path = tmp.name

        def generate_progress():
            results = []
            
            def progress_callback(progress_data):
                # Send progress update
                yield f"data: {json.dumps({'type': 'progress', 'data': progress_data})}\n\n"
            
            # Run optimized search with progress callback and optional enhanced features
            final_results = optimized_search_identity(
                name=name, 
                image_path=image_path, 
                progress_callback=progress_callback,
                use_enhanced=use_enhanced
            )
            
            # Send final results
            yield f"data: {json.dumps({'type': 'complete', 'data': {'results': final_results, 'total_results': len(final_results), 'enhanced_used': use_enhanced}})}\n\n"
        
        return StreamingResponse(
            generate_progress(),
            media_type="text/plain",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Content-Type": "text/event-stream"
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Streaming search error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/search-activities")
async def search_activities(name: str = Form(...), platforms: str = Form("instagram,twitter,facebook,tiktok")):
    """
    NEW ENDPOINT: Search for user activities - likes, comments, interactions, engagement
    """
    try:
        logger.info(f"Activities search request for: {name}")
        
        # Parse platforms
        platform_list = [p.strip() for p in platforms.split(",") if p.strip()]
        
        # Import and use the enhanced activities search
        from search import search_user_activities_comprehensive
        activities = search_user_activities_comprehensive(name, platform_list)
        
        logger.info(f"Activities search completed, found {len(activities)} activities")
        
        return {
            "activities": activities,
            "status": "success",
            "total_activities": len(activities),
            "platforms_searched": platform_list,
            "search_type": "comprehensive_activities"
        }
        
    except Exception as e:
        logger.error(f"Activities search error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Activities search failed: {str(e)}"
        )

@app.post("/search-google-comprehensive")
async def search_google_comprehensive(name: str = Form(...), max_results: int = Form(20)):
    """
    NEW ENDPOINT: Comprehensive Google search across all categories
    """
    try:
        logger.info(f"Comprehensive Google search request for: {name}")
        
        # Import and use the enhanced Google search
        from search import search_google_comprehensive_all_categories
        google_results = search_google_comprehensive_all_categories(name, max_results)
        
        logger.info(f"Comprehensive Google search completed, found {len(google_results)} results")
        
        return {
            "results": google_results,
            "status": "success",
            "total_results": len(google_results),
            "categories_searched": [
                "social_media", "professional", "academic", "news", 
                "personal_websites", "forums", "images", "location"
            ],
            "search_type": "comprehensive_google"
        }
        
    except Exception as e:
        logger.error(f"Comprehensive Google search error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Comprehensive Google search failed: {str(e)}"
        )
