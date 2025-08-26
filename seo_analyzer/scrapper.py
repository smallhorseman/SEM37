# seo_analyzer/scraper.py
import requests
from bs4 import BeautifulSoup

def scrape_top_organic_keywords(domain):
    """
    Scrapes Google for the top organic search results for a given domain.

    Args:
        domain (str): The domain to search for (e.g., 'spyfu.com').

    Returns:
        list: A list of dictionaries, where each dictionary represents an
              organic search result with 'position', 'keyword' (title),
              and 'url'. Returns an empty list if scraping fails.
    """
    # We use a specific Google search operator "site:" to find pages
    # belonging only to the specified domain.
    query = f"site:{domain}"
    
    # The URL for the Google search request.
    # `num=20` attempts to get 20 results.
    url = f"https://www.google.com/search?q={query}&num=20"

    # It's crucial to set a User-Agent header. This makes our request look
    # like it's coming from a real web browser, reducing the chance of
    # being blocked by Google.
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
    }

    try:
        # Send the HTTP GET request to Google.
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise an exception for bad status codes (4xx or 5xx)

        # Parse the HTML content of the page using BeautifulSoup.
        soup = BeautifulSoup(response.text, 'html.parser')

        # Find all the organic search result containers. Google's class names
        # can be obfuscated and change often. This selector is based on the
        # common structure of search result divs as of late 2024/early 2025.
        # This is the most fragile part of the scraper.
        results = soup.select("div.g")
        
        organic_keywords = []
        position = 1

        for result in results:
            # We look for an h3 tag, which typically contains the title.
            title_element = result.find("h3")
            # The link is usually in an 'a' tag right before the h3.
            link_element = result.find("a")

            if title_element and link_element and link_element.has_attr('href'):
                # Clean up the title and URL.
                title = title_element.get_text()
                raw_url = link_element['href']

                # Google's search result links are often wrapped. We need to parse them.
                if raw_url.startswith('/url?q='):
                    url = raw_url.split('/url?q=')[1].split('&sa=')[0]
                    
                    # We only want results that are actual pages from the target domain.
                    if domain in url:
                        organic_keywords.append({
                            "position": position,
                            "keyword": title, # Using the page title as the "keyword" for now
                            "url": url
                        })
                        position += 1
        
        return organic_keywords

    except requests.exceptions.RequestException as e:
        print(f"An error occurred during the request: {e}")
        return []
    except Exception as e:
        print(f"An error occurred during scraping: {e}")
        return []

