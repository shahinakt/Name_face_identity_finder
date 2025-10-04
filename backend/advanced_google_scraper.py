#!/usr/bin/env python3
"""
Enhanced Google web scraping module for comprehensive person information gathering
This module provides advanced Google search capabilities without modifying existing Instagram code
"""

import requests
from bs4 import BeautifulSoup
import time
import random
import re
import json
from urllib.parse import quote_plus, urljoin, urlparse, parse_qs
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading

logger = logging.getLogger(__name__)

class AdvancedGoogleScraper:
    """
    Advanced Google scraper for comprehensive person information
    """
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'DNT': '1',
            'Upgrade-Insecure-Requests': '1'
        })
        self.search_count = 0
        self.rate_limit_delay = 2
        
    def comprehensive_google_search(self, name, max_results=50):
        """
        Perform comprehensive Google search across multiple categories
        """
        all_results = []
        
        try:
            print(f"🌐 Starting comprehensive Google search for: {name}")
            
            # Category 1: Social Media Profiles
            print("📱 Searching social media profiles...")
            social_results = self._search_social_media_profiles(name)
            all_results.extend(social_results)
            
            # Category 2: Professional Information
            print("💼 Searching professional information...")
            professional_results = self._search_professional_info(name)
            all_results.extend(professional_results)
            
            # Category 3: Academic and Educational
            print("🎓 Searching academic information...")
            academic_results = self._search_academic_info(name)
            all_results.extend(academic_results)
            
            # Category 4: News and Media Mentions
            print("📰 Searching news and media mentions...")
            news_results = self._search_news_mentions(name)
            all_results.extend(news_results)
            
            # Category 5: Personal Websites and Blogs
            print("🌐 Searching personal websites...")
            personal_results = self._search_personal_websites(name)
            all_results.extend(personal_results)
            
            # Category 6: Forum and Community Posts
            print("💬 Searching forums and communities...")
            forum_results = self._search_forum_posts(name)
            all_results.extend(forum_results)
            
            # Category 7: Images and Visual Content
            print("🖼️ Searching image content...")
            image_results = self._search_image_content(name)
            all_results.extend(image_results)
            
            # Category 8: Location-based Information
            print("📍 Searching location-based info...")
            location_results = self._search_location_info(name)
            all_results.extend(location_results)
            
            # Process and rank all results
            final_results = self._process_comprehensive_results(all_results, name, max_results)
            
            print(f"✅ Comprehensive Google search completed with {len(final_results)} results")
            return final_results
            
        except Exception as e:
            logger.error(f"Comprehensive Google search error: {e}")
            return []
    
    def _search_social_media_profiles(self, name):
        """
        Advanced social media profile search
        """
        results = []
        
        # Enhanced social media search queries
        social_queries = [
            # Instagram variations
            f'"{name}" site:instagram.com profile OR bio',
            f'@{name.replace(" ", "")} instagram',
            f'"{name}" instagram user account',
            
            # Twitter/X variations
            f'"{name}" site:twitter.com OR site:x.com profile',
            f'@{name.replace(" ", "")} twitter',
            f'"{name}" twitter bio OR profile',
            
            # Facebook variations
            f'"{name}" site:facebook.com profile OR page',
            f'"{name}" facebook public profile',
            
            # LinkedIn variations
            f'"{name}" site:linkedin.com/in/ profile',
            f'"{name}" linkedin professional',
            
            # TikTok variations
            f'"{name}" site:tiktok.com/@{name.replace(" ", "")}',
            f'"{name}" tiktok user profile',
            
            # YouTube variations
            f'"{name}" site:youtube.com/channel OR site:youtube.com/c',
            f'"{name}" youtube creator',
            
            # Other platforms
            f'"{name}" site:pinterest.com',
            f'"{name}" site:reddit.com/user',
            f'"{name}" site:github.com',
            f'"{name}" site:twitch.tv',
            f'"{name}" site:discord.com'
        ]
        
        # Use concurrent searching for better performance
        with ThreadPoolExecutor(max_workers=3) as executor:
            future_to_query = {
                executor.submit(self._execute_google_search, query, "social_media"): query 
                for query in social_queries[:8]  # Limit concurrent searches
            }
            
            for future in as_completed(future_to_query):
                try:
                    query_results = future.result()
                    results.extend(query_results)
                except Exception as e:
                    logger.error(f"Social media search error: {e}")
                    continue
        
        return results
    
    def _search_professional_info(self, name):
        """
        Search for professional information
        """
        results = []
        
        professional_queries = [
            f'"{name}" linkedin OR professional OR career',
            f'"{name}" company OR organization OR workplace',
            f'"{name}" job title OR position OR role',
            f'"{name}" business OR entrepreneur OR founder',
            f'"{name}" CEO OR director OR manager',
            f'"{name}" consultant OR specialist OR expert',
            f'"{name}" CV OR resume OR curriculum vitae',
            f'"{name}" work experience OR employment'
        ]
        
        for query in professional_queries[:5]:  # Limit for performance
            try:
                query_results = self._execute_google_search(query, "professional")
                results.extend(query_results)
                time.sleep(self.rate_limit_delay)
            except Exception as e:
                logger.error(f"Professional search error: {e}")
                continue
        
        return results
    
    def _search_academic_info(self, name):
        """
        Search for academic and educational information
        """
        results = []
        
        academic_queries = [
            f'"{name}" site:scholar.google.com',
            f'"{name}" research OR publication OR paper',
            f'"{name}" university OR college OR school',
            f'"{name}" professor OR student OR academic',
            f'"{name}" PhD OR degree OR education',
            f'"{name}" thesis OR dissertation',
            f'"{name}" site:researchgate.net',
            f'"{name}" site:academia.edu'
        ]
        
        for query in academic_queries[:6]:
            try:
                query_results = self._execute_google_search(query, "academic")
                results.extend(query_results)
                time.sleep(self.rate_limit_delay)
            except Exception as e:
                continue
        
        return results
    
    def _search_news_mentions(self, name):
        """
        Search for news and media mentions
        """
        results = []
        
        news_queries = [
            f'"{name}" news OR article OR press',
            f'"{name}" interview OR podcast OR media',
            f'"{name}" announcement OR release',
            f'"{name}" award OR recognition OR achievement',
            f'"{name}" event OR conference OR speaking',
            f'"{name}" featured OR mentioned OR quoted'
        ]
        
        # Use Google News search
        for query in news_queries[:4]:
            try:
                # Regular news search
                query_results = self._execute_google_search(query, "news")
                results.extend(query_results)
                
                # Google News specific search
                news_results = self._search_google_news(query, name)
                results.extend(news_results)
                
                time.sleep(self.rate_limit_delay)
            except Exception as e:
                continue
        
        return results
    
    def _search_personal_websites(self, name):
        """
        Search for personal websites and blogs
        """
        results = []
        
        website_queries = [
            f'"{name}" personal website OR homepage',
            f'"{name}" blog OR blogger',
            f'"{name}" portfolio OR showcase',
            f'"{name}" about me OR bio',
            f'"{name}" contact OR reach out',
            f'"{name}" site:wordpress.com OR site:blogspot.com',
            f'"{name}" personal site OR page'
        ]
        
        for query in website_queries[:5]:
            try:
                query_results = self._execute_google_search(query, "personal_web")
                results.extend(query_results)
                time.sleep(self.rate_limit_delay)
            except Exception as e:
                continue
        
        return results
    
    def _search_forum_posts(self, name):
        """
        Search for forum posts and community discussions
        """
        results = []
        
        forum_queries = [
            f'"{name}" site:reddit.com',
            f'"{name}" forum OR discussion OR community',
            f'"{name}" site:quora.com',
            f'"{name}" site:stackoverflow.com',
            f'"{name}" comment OR post OR thread',
            f'"{name}" discussion board OR message board'
        ]
        
        for query in forum_queries[:4]:
            try:
                query_results = self._execute_google_search(query, "forum")
                results.extend(query_results)
                time.sleep(self.rate_limit_delay)
            except Exception as e:
                continue
        
        return results
    
    def _search_image_content(self, name):
        """
        Search for image content related to the person
        """
        results = []
        
        try:
            # Google Images search
            image_queries = [
                f'"{name}" person OR photo',
                f'"{name}" profile picture OR avatar',
                f'"{name}" headshot OR portrait'
            ]
            
            for query in image_queries[:2]:
                try:
                    image_results = self._search_google_images(query, name)
                    results.extend(image_results)
                    time.sleep(self.rate_limit_delay)
                except Exception as e:
                    continue
        
        except Exception as e:
            logger.error(f"Image search error: {e}")
        
        return results
    
    def _search_location_info(self, name):
        """
        Search for location-based information
        """
        results = []
        
        location_queries = [
            f'"{name}" location OR address OR city',
            f'"{name}" hometown OR origin OR from',
            f'"{name}" lives in OR based in OR located',
            f'"{name}" local OR area OR region'
        ]
        
        for query in location_queries[:3]:
            try:
                query_results = self._execute_google_search(query, "location")
                results.extend(query_results)
                time.sleep(self.rate_limit_delay)
            except Exception as e:
                continue
        
        return results
    
    def _execute_google_search(self, query, search_type):
        """
        Execute a Google search and extract results
        """
        results = []
        
        try:
            self.search_count += 1
            search_url = f"https://www.google.com/search?q={quote_plus(query)}&num=8"
            
            # Add random delay to avoid rate limiting
            if self.search_count % 5 == 0:
                time.sleep(random.uniform(3, 6))
            
            response = self.session.get(search_url, timeout=15)
            
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Extract search results using multiple selectors
                result_selectors = ['div.g', 'div.tF2Cxc', 'div.MjjYud']
                search_results = []
                
                for selector in result_selectors:
                    search_results = soup.select(selector)
                    if search_results:
                        break
                
                for result in search_results[:4]:  # Limit results per query
                    try:
                        parsed_result = self._parse_search_result(result, search_type, query)
                        if parsed_result:
                            results.append(parsed_result)
                    except Exception as e:
                        continue
            
            elif response.status_code == 429:
                # Rate limited - increase delay
                self.rate_limit_delay += 1
                time.sleep(10)
        
        except Exception as e:
            logger.error(f"Google search execution error: {e}")
        
        return results
    
    def _parse_search_result(self, result_element, search_type, query):
        """
        Parse individual search result
        """
        try:
            # Extract title
            title_selectors = ['h3', 'h3.LC20lb', 'h3.r']
            title = ""
            for selector in title_selectors:
                title_elem = result_element.select_one(selector)
                if title_elem:
                    title = title_elem.get_text().strip()
                    break
            
            # Extract snippet
            snippet_selectors = [
                'span.aCOpRe', 'span.hgKElc', 'div.VwiC3b', 
                'div.yXK7lf', 'div.s', 'span.st', 'div.BNeawe'
            ]
            snippet = ""
            for selector in snippet_selectors:
                snippet_elem = result_element.select_one(selector)
                if snippet_elem:
                    snippet = snippet_elem.get_text().strip()
                    break
            
            # Extract URL
            link_elem = result_element.select_one('a')
            url = ""
            if link_elem:
                href = link_elem.get('href', '')
                if href.startswith('/url?q='):
                    # Extract actual URL from Google redirect
                    parsed_url = urlparse(href)
                    query_params = parse_qs(parsed_url.query)
                    url = query_params.get('q', [''])[0]
                elif href.startswith('http'):
                    url = href
            
            if title and snippet and url:
                # Determine platform and calculate score
                platform = self._determine_platform_from_url(url)
                score = self._calculate_result_score(title, snippet, search_type, platform)
                
                return {
                    "source": f"{platform} - {search_type.replace('_', ' ').title()}",
                    "preview": f"{snippet[:250]}...",
                    "score": score,
                    "platform": platform,
                    "search_type": f"google_{search_type}",
                    "link": url,
                    "title": title,
                    "snippet": snippet,
                    "query_used": query,
                    "advanced_google_search": True
                }
        
        except Exception as e:
            logger.error(f"Error parsing search result: {e}")
        
        return None
    
    def _search_google_news(self, query, name):
        """
        Search Google News specifically
        """
        results = []
        
        try:
            news_url = f"https://www.google.com/search?q={quote_plus(query)}&tbm=nws&num=5"
            response = self.session.get(news_url, timeout=15)
            
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # News-specific selectors
                news_results = soup.select('div.SoAPf, div.dbsr, article')[:3]
                
                for result in news_results:
                    try:
                        title_elem = result.select_one('h3, .mCBkyc')
                        snippet_elem = result.select_one('.GI74Re, .Y3v8qd')
                        link_elem = result.select_one('a')
                        
                        if title_elem and link_elem:
                            title = title_elem.get_text().strip()
                            snippet = snippet_elem.get_text().strip() if snippet_elem else ""
                            link = link_elem.get('href', '')
                            
                            if name.lower() in f"{title} {snippet}".lower():
                                results.append({
                                    "source": "Google News - Media Mention",
                                    "preview": f"News: {snippet[:200]}...",
                                    "score": 0.8,
                                    "platform": "News Media",
                                    "search_type": "google_news",
                                    "link": link,
                                    "title": title,
                                    "snippet": snippet,
                                    "news_article": True
                                })
                    
                    except Exception as e:
                        continue
        
        except Exception as e:
            logger.error(f"Google News search error: {e}")
        
        return results
    
    def _search_google_images(self, query, name):
        """
        Search Google Images
        """
        results = []
        
        try:
            images_url = f"https://www.google.com/search?q={quote_plus(query)}&tbm=isch&num=10"
            response = self.session.get(images_url, timeout=15)
            
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Look for image results
                image_containers = soup.select('div.isv-r, div.bRMDJf')[:5]
                
                for container in image_containers:
                    try:
                        # Extract image information
                        img_elem = container.select_one('img')
                        link_elem = container.select_one('a')
                        
                        if img_elem and link_elem:
                            img_alt = img_elem.get('alt', '')
                            img_src = img_elem.get('src', '')
                            page_link = link_elem.get('href', '')
                            
                            if name.lower() in img_alt.lower():
                                results.append({
                                    "source": "Google Images - Photo Content",
                                    "preview": f"Image found: {img_alt[:150]}...",
                                    "score": 0.7,
                                    "platform": "Google Images",
                                    "search_type": "google_images",
                                    "link": page_link,
                                    "image_src": img_src,
                                    "image_alt": img_alt,
                                    "image_result": True
                                })
                    
                    except Exception as e:
                        continue
        
        except Exception as e:
            logger.error(f"Google Images search error: {e}")
        
        return results
    
    def _determine_platform_from_url(self, url):
        """
        Determine platform from URL
        """
        if not url:
            return "Web"
        
        url_lower = url.lower()
        platform_mapping = {
            'instagram.com': 'Instagram',
            'twitter.com': 'Twitter',
            'x.com': 'Twitter/X',
            'facebook.com': 'Facebook',
            'linkedin.com': 'LinkedIn',
            'tiktok.com': 'TikTok',
            'youtube.com': 'YouTube',
            'github.com': 'GitHub',
            'pinterest.com': 'Pinterest',
            'reddit.com': 'Reddit',
            'quora.com': 'Quora',
            'scholar.google.com': 'Google Scholar',
            'researchgate.net': 'ResearchGate',
            'academia.edu': 'Academia.edu',
            'wordpress.com': 'WordPress',
            'blogspot.com': 'Blogger',
            'medium.com': 'Medium'
        }
        
        for domain, platform in platform_mapping.items():
            if domain in url_lower:
                return platform
        
        return "Web"
    
    def _calculate_result_score(self, title, snippet, search_type, platform):
        """
        Calculate relevance score for search results
        """
        score = 0.5  # Base score
        
        # Search type bonuses
        type_bonuses = {
            'social_media': 0.2,
            'professional': 0.25,
            'academic': 0.3,
            'news': 0.35,
            'personal_web': 0.15,
            'forum': 0.1,
            'location': 0.1
        }
        
        score += type_bonuses.get(search_type, 0.1)
        
        # Platform bonuses
        platform_bonuses = {
            'LinkedIn': 0.2,
            'Google Scholar': 0.25,
            'Instagram': 0.15,
            'Twitter': 0.15,
            'Facebook': 0.1,
            'News Media': 0.3
        }
        
        score += platform_bonuses.get(platform, 0.05)
        
        # Content quality indicators
        quality_indicators = [
            'profile', 'bio', 'about', 'official', 'verified',
            'professional', 'academic', 'research', 'publication'
        ]
        
        content_text = f"{title} {snippet}".lower()
        for indicator in quality_indicators:
            if indicator in content_text:
                score += 0.05
        
        return min(score, 0.95)
    
    def _process_comprehensive_results(self, all_results, name, max_results):
        """
        Process and rank comprehensive search results
        """
        try:
            # Remove duplicates based on URL
            seen_urls = set()
            unique_results = []
            
            for result in all_results:
                url = result.get('link', '')
                result_key = f"{url}_{result.get('title', '')[:50]}"
                
                if result_key not in seen_urls:
                    seen_urls.add(result_key)
                    
                    # Additional relevance check
                    if self._is_relevant_result(result, name):
                        unique_results.append(result)
            
            # Sort by score and search type priority
            search_type_priority = {
                'google_social_media': 10,
                'google_professional': 9,
                'google_academic': 8,
                'google_news': 7,
                'google_personal_web': 6,
                'google_forum': 5,
                'google_images': 4,
                'google_location': 3
            }
            
            unique_results.sort(
                key=lambda x: (
                    search_type_priority.get(x.get('search_type', ''), 0),
                    x.get('score', 0)
                ),
                reverse=True
            )
            
            return unique_results[:max_results]
            
        except Exception as e:
            logger.error(f"Error processing comprehensive results: {e}")
            return all_results[:max_results]
    
    def _is_relevant_result(self, result, name):
        """
        Check if result is relevant to the person
        """
        try:
            name_lower = name.lower()
            title = result.get('title', '').lower()
            snippet = result.get('snippet', '').lower()
            
            # Check if name appears in title or snippet
            if name_lower in title or name_lower in snippet:
                return True
            
            # Check for name parts (for full names)
            name_parts = name_lower.split()
            if len(name_parts) > 1:
                parts_found = sum(1 for part in name_parts if part in f"{title} {snippet}")
                if parts_found >= len(name_parts) * 0.6:  # At least 60% of name parts
                    return True
            
            return False
            
        except Exception as e:
            return True  # Default to relevant if we can't determine

def enhanced_google_comprehensive_search(name, max_results=50):
    """
    Main function for enhanced comprehensive Google search
    """
    try:
        scraper = AdvancedGoogleScraper()
        results = scraper.comprehensive_google_search(name, max_results)
        return results
    except Exception as e:
        logger.error(f"Enhanced Google comprehensive search error: {e}")
        return []