from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import tempfile
import logging
import json
from optimized_search import optimized_search_identity

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
    return {"status": "running", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.post("/search")
async def search(name: str = Form(None), file: UploadFile = File(None)):
    try:
        if not name and not file:
            raise HTTPException(status_code=422, detail="Provide name or image")
        
        image_path = None
        if file:
            if not file.content_type or not file.content_type.startswith('image/'):
                raise HTTPException(status_code=422, detail="File must be an image")
            
            file_content = await file.read()
            if len(file_content) == 0:
                raise HTTPException(status_code=422, detail="File is empty")
            
            tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
            tmp.write(file_content)
            tmp.close()
            image_path = tmp.name

        results = optimized_search_identity(name=name, image_path=image_path)
        return {"results": results, "status": "success"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Search error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/search-stream")
async def search_stream(name: str = Form(None), file: UploadFile = File(None)):
    """Streaming search with real-time progress"""
    try:
        if not name and not file:
            raise HTTPException(status_code=422, detail="Provide name or image")
        
        image_path = None
        if file:
            if not file.content_type or not file.content_type.startswith('image/'):
                raise HTTPException(status_code=422, detail="File must be an image")
            
            file_content = await file.read()
            if len(file_content) == 0:
                raise HTTPException(status_code=422, detail="File is empty")
            
            tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
            tmp.write(file_content)
            tmp.close()
            image_path = tmp.name

        def generate_progress():
            def progress_callback(progress_data):
                yield f"data: {json.dumps({'type': 'progress', 'data': progress_data})}\n\n"
            
            results = optimized_search_identity(
                name=name, 
                image_path=image_path, 
                progress_callback=progress_callback
            )
            
            yield f"data: {json.dumps({'type': 'complete', 'data': {'results': results}})}\n\n"
        
        return StreamingResponse(
            generate_progress(),
            media_type="text/event-stream",
            headers={"Cache-Control": "no-cache", "Connection": "keep-alive"}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Streaming search error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True)
