import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import time
from .gemini_service import get_gemini_recommendations

# Global variable to store the path to the ChromeDriver executable
_CHROME_DRIVER_PATH = None

def _get_chrome_driver_path():
    global _CHROME_DRIVER_PATH
    if _CHROME_DRIVER_PATH is None:
        _CHROME_DRIVER_PATH = ChromeDriverManager().install()
    return _CHROME_DRIVER_PATH

def _normalize_url(url):
    url = url.strip()
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    return url

def analyze_on_page_seo(url):
    driver = None  # Initialize driver to None for bug fix
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36")

    try:
        driver_path = _get_chrome_driver_path()
        driver = webdriver.Chrome(service=Service(driver_path), options=chrome_options)

        url = _normalize_url(url)
        driver.get(url)

        # Use explicit wait instead of hardcoded sleep
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        
        page_source = driver.page_source
        soup = BeautifulSoup(page_source, 'html.parser')

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

        analysis_results = {
            'title': title_analysis,
            'metaDescription': meta_desc_analysis,
            'h1': h1_analysis,
            'wordCount': word_count,
            'images': images,
            'url': url
        }

        recommendations = get_gemini_recommendations(analysis_results)
        analysis_results['recommendations'] = recommendations

        return analysis_results

    except Exception as e:
        return {'error': f"An unexpected error occurred during analysis: {e}"}
    finally:
        if driver:  # Only quit if driver was successfully initialized
            driver.quit()
