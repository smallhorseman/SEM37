# seo_analyzer/on_page_analyzer.py
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time
from .gemini_service import get_gemini_recommendations # Import the new function

def analyze_on_page_seo(url):
    """
    Analyzes the on-page SEO elements of a given URL using Selenium
    and gets AI recommendations from Gemini.
    """
    # --- Selenium Setup ---
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36")

    try:
        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
    except Exception as e:
        return {'error': f"Could not start Selenium WebDriver. Please ensure Chrome is installed. Error: {e}"}

    try:
        url = url.strip()
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url
        
        driver.get(url)
        time.sleep(3) 
        
        page_source = driver.page_source
        soup = BeautifulSoup(page_source, 'html.parser')

        # --- Data Gathering (Same as before) ---
        title_tag = soup.find('title')
        title_text = title_tag.get_text() if title_tag else ''
        title_analysis = {'text': title_text, 'length': len(title_text), 'status': 'good' if 50 <= len(title_text) <= 60 else 'warning' if len(title_text) > 0 else 'error'}

        meta_desc_tag = soup.find('meta', attrs={'name': 'description'})
        meta_desc_text = meta_desc_tag['content'] if meta_desc_tag and meta_desc_tag.has_attr('content') else ''
        meta_desc_analysis = {'text': meta_desc_text, 'length': len(meta_desc_text), 'status': 'good' if 150 <= len(meta_desc_text) <= 160 else 'warning' if len(meta_desc_text) > 0 else 'error'}

        h1_tags = [h1.get_text(strip=True) for h1 in soup.find_all('h1')]
        h1_analysis = {'tags': h1_tags, 'count': len(h1_tags), 'status': 'good' if len(h1_tags) == 1 else 'error'}
        
        body_text = soup.find('body').get_text(separator=' ', strip=True) if soup.find('body') else ''
        word_count = len(body_text.split())

        images = []
        for img in soup.find_all('img'):
            images.append({'src': img.get('src', ''), 'alt': img.get('alt', '').strip(), 'status': 'good' if img.get('alt', '').strip() else 'error'})

        # --- Compile all the data ---
        analysis_results = {
            'title': title_analysis,
            'metaDescription': meta_desc_analysis,
            'h1': h1_analysis,
            'wordCount': word_count,
            'images': images,
            'url': url
        }

        # --- NEW: Call Gemini API for recommendations ---
        print("Getting AI recommendations...")
        recommendations = get_gemini_recommendations(analysis_results)
        analysis_results['recommendations'] = recommendations
        print("Done.")

        return analysis_results

    except Exception as e:
        return {'error': f"An unexpected error occurred during analysis: {e}"}
    finally:
        driver.quit()
