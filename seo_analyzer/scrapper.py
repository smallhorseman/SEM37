import requests
from bs4 import BeautifulSoup

def scrape_top_organic_keywords(domain):
    query = f"site:{domain}"
    url = f"https://www.google.com/search?q={query}&num=20"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')
        results = soup.select("div.g")
        
        organic_keywords = []
        position = 1

        for result in results:
            title_element = result.find("h3")
            link_element = result.find("a")

            if title_element and link_element and link_element.has_attr('href'):
                title = title_element.get_text()
                raw_url = link_element['href']

                if raw_url.startswith('/url?q='):
                    url = raw_url.split('/url?q=')[1].split('&sa=')[0]
                    
                    if domain in url:
                        organic_keywords.append({
                            "position": position,
                            "keyword": title,
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
