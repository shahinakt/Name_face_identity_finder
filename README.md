# Digital Identity Finder

A full-stack application for searching digital footprints and public information using name or facial recognition.

## Features

- Dual search methods (name or photo)
- Privacy-first, no data storage
- Real-time search with progress tracking
- Modern, responsive web interface

## Tech Stack

**Backend**: FastAPI, Uvicorn, Python
**Frontend**: Next.js, React, Tailwind CSS

## Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
python main.py
```

Backend runs on `http://127.0.0.1:8001`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

## API Endpoints

- `POST /search` - Search by name or image
- `POST /search-stream` - Streaming search with progress updates
- `GET /health` - Health check

## Project Structure

```
backend/              # FastAPI server
frontend/             # Next.js React app
README.md
LICENSE
```

## License

MIT
