
# ENHANCED WEB SCRAPING USAGE EXAMPLES

## 1. Enhanced Comprehensive Search (ALL NEW FEATURES)
from search import search_identity
results = search_identity(name="person_name", use_enhanced=True)
# This includes: Instagram (preserved), activities scraping, advanced Google search

## 2. User Activities Search (NEW - likes, comments, interactions)
from search import search_user_activities_comprehensive
activities = search_user_activities_comprehensive("person_name", platforms=['instagram', 'twitter'])
# Returns: liked posts, comments made, shares, interactions, engagement data

## 3. Advanced Google Search (NEW - comprehensive categories)
from search import search_google_comprehensive_all_categories  
google_results = search_google_comprehensive_all_categories("person_name")
# Searches: social media, professional, academic, news, personal sites, forums, images

## 4. API Usage (ENHANCED)
# Standard search with enhanced features
POST /search
{
    "name": "person_name",
    "use_enhanced": true
}

# Activities-only search
POST /search-activities
{
    "name": "person_name", 
    "platforms": "instagram,twitter,facebook"
}

# Comprehensive Google search
POST /search-google-comprehensive
{
    "name": "person_name",
    "max_results": 25
}

## 5. Existing Instagram Code (PRESERVED - no changes)
from search import extract_actual_web_content, scrape_instagram_directly
instagram_results = extract_actual_web_content("person_name")
# All original Instagram scraping functionality works exactly as before
