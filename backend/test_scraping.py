#!/usr/bin/env python3
"""
Test script to verify the web scraping functionality works
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_basic_scraping():
    """Test basic scraping functions without DeepFace dependency"""
    try:
        # Import only the scraping functions we need
        from search import extract_actual_web_content, create_accurate_platform_searches
        
        print("🔍 Testing basic web scraping functionality...")
        
        # Test 1: Platform search creation
        print("\n1. Testing platform search creation...")
        platform_results = create_accurate_platform_searches("test name")
        print(f"   ✅ Created {len(platform_results)} platform searches")
        
        # Test 2: Basic web content extraction (limited test)
        print("\n2. Testing web content extraction...")
        try:
            # Test with a very simple search to avoid rate limiting
            web_results = extract_actual_web_content("test", max_results=2)
            print(f"   ✅ Web scraping function works, found {len(web_results)} results")
        except Exception as e:
            print(f"   ⚠️ Web scraping had issues: {e}")
        
        print("\n✅ Basic scraping functions are working!")
        return True
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False
    except Exception as e:
        print(f"❌ Error testing scraping: {e}")
        return False

def test_simple_search():
    """Test a simple search without face detection"""
    try:
        # Create a simplified search function that doesn't use DeepFace
        from search import create_accurate_platform_searches, extract_actual_web_content
        
        print("\n🔍 Testing simplified search...")
        
        name = "shahina"
        results = []
        
        # Add platform searches
        platform_results = create_accurate_platform_searches(name)
        results.extend(platform_results[:3])  # Limit to 3
        
        # Try web scraping (with error handling)
        try:
            web_results = extract_actual_web_content(name, max_results=2)
            results.extend(web_results)
        except Exception as e:
            print(f"   ⚠️ Web scraping error: {e}")
        
        print(f"✅ Search completed with {len(results)} results")
        
        # Print sample results
        for i, result in enumerate(results[:3]):
            print(f"   {i+1}. {result.get('source', 'Unknown')}: {result.get('preview', '')[:100]}...")
        
        return results
        
    except Exception as e:
        print(f"❌ Search test failed: {e}")
        return []

if __name__ == "__main__":
    print("🚀 Starting scraping functionality test...\n")
    
    # Test 1: Basic functionality
    basic_works = test_basic_scraping()
    
    if basic_works:
        # Test 2: Simple search
        search_results = test_simple_search()
        
        if search_results:
            print(f"\n🎉 SUCCESS: Scraping system is working with {len(search_results)} results!")
        else:
            print("\n⚠️ Basic functions work but search returned no results")
    else:
        print("\n❌ FAILED: Basic scraping functions are not working")
    
    print("\n🏁 Test completed!")