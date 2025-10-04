# Name Face Identity Finder

A sophisticated full-stack application that enables users to search for digital footprints and public information using either a person's name or facial recognition technology. Built with modern web technologies and AI-powered face detection capabilities.

## Features

- **Dual Search Methods**: Search by name or upload a photo for facial recognition
- **Privacy-First Design**: No data storage, ephemeral processing
- **Real-time Processing**: Fast API responses with modern UI/UX
- **Cross-platform Compatibility**: Web-based interface accessible from any device
- **Professional UI**: Modern, responsive design with smooth animations

## Tech Stack

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) - Modern, fast web framework for building APIs
- **Runtime**: [Uvicorn](https://www.uvicorn.org/) - Lightning-fast ASGI server
- **AI/ML Libraries**:
  - [DeepFace](https://github.com/serengil/deepface) - Advanced facial recognition and analysis
  - [TensorFlow](https://www.tensorflow.org/) - Machine learning framework
  - [OpenCV](https://opencv.org/) - Computer vision library
  - [NumPy](https://numpy.org/) - Numerical computing
- **Web Scraping**: [BeautifulSoup4](https://www.crummy.com/software/BeautifulSoup/) - HTML/XML parsing
- **Image Processing**: [Pillow](https://python-pillow.org/) - Python Imaging Library
- **HTTP Client**: [Requests](https://requests.readthedocs.io/) - HTTP library

### Frontend
- **Framework**: [Next.js 15.5.4](https://nextjs.org/) - React-based full-stack framework
- **UI Library**: [React 19.1.0](https://react.dev/) - Modern component-based UI library
- **Styling**: [Tailwind CSS 4.1.11](https://tailwindcss.com/) - Utility-first CSS framework

# Name Face Identity Finder

## Overview

Name Face Identity Finder is a tool for finding and identifying faces and names from various sources using advanced scraping and search techniques. It features a Python backend for scraping/searching and a Next.js frontend for user interaction.

## Features

- Advanced Google scraping
- Enhanced search algorithms
- Optimized performance
- User-friendly frontend interface

## Project Structure

```
Name_face_identity_finder/
├── backend/
│   ├── main.py
│   ├── advanced_google_scraper.py
│   ├── enhanced_scraping.py
│   ├── optimized_search.py
│   ├── utils.py
│   └── ...
├── frontend/
│   ├── pages/
│   ├── components/
│   ├── styles/
│   └── ...
├── README.md
└── LICENSE
```

## Getting Started

### Backend Setup
1. Go to the `backend` directory:
  ```bash
  cd backend
  ```
2. Install Python dependencies:
  ```bash
  pip install -r requirements.txt
  ```
3. Run the backend:
  ```bash
  python main.py
  ```

### Frontend Setup
1. Go to the `frontend` directory:
  ```bash
  cd frontend
  ```
2. Install Node.js dependencies:
  ```bash
  npm install
  ```
3. Start the frontend development server:
  ```bash
  npm run dev
  ```

## Usage

See `backend/USAGE_EXAMPLES.md` for backend usage examples.

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements or bug fixes.

## License

MIT License
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## API Documentation

### Endpoints

- **GET** `/` - Health check and API information
- **GET** `/health` - Service health status
- **POST** `/search` - Main search endpoint

#### Search Endpoint
```http
POST /search
Content-Type: multipart/form-data

Parameters:
- name (optional): String - Person's name to search
- file (optional): File - Image file for facial recognition

Response:
{
  "results": [...],
  "status": "success"
}
```

## Configuration

### Environment Variables
Create appropriate environment files for different deployment scenarios:

- Development: Local configuration
- Production: Optimized settings with proper CORS and security

### CORS Configuration
The backend is configured with permissive CORS settings for development. Adjust for production use.

## Privacy & Security

- **No Data Storage**: Images and search queries are processed in memory only
- **Ephemeral Processing**: No persistent storage of user data
- **Privacy-First**: Designed with user privacy as a core principle

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.

## Acknowledgments

- [DeepFace](https://github.com/serengil/deepface) for facial recognition capabilities
- [FastAPI](https://fastapi.tiangolo.com/) for the robust backend framework
- [Next.js](https://nextjs.org/) for the modern frontend framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first styling approach

---

**Note**: This is a demonstration project. Ensure compliance with applicable laws and privacy regulations when using facial recognition technology in production environments.