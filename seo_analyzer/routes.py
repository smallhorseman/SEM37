from flask import Blueprint, jsonify, request
import random
from .scrapper import scrape_top_organic_keywords
from .firestore_service import save_analysis, get_latest_analysis
from .on_page_analyzer import analyze_on_page_seo

main = Blueprint('main', __name__)

@main.route('/analyze', methods=['POST'])
def analyze_domain():
    data = request.get_json()
    domain = data.get('domain')

    if not domain:
        return jsonify({"error": "Domain is required"}), 400

    cached_data = get_latest_analysis(domain)
    if cached_data:
        return jsonify(cached_data)

    scraped_keywords = scrape_top_organic_keywords(domain)
    
    top_organic_keywords_data = [
        {"keyword": item["keyword"], "position": item["position"], "volume": "N/A"} 
        for item in scraped_keywords
    ]

    analysis_result = {
        'organicKeywords': f"{random.randint(5000, 25000):,}",
        'paidKeywords': f"{random.randint(500, 5000):,}",
        'monthlyTraffic': f"{random.randint(20, 100)}.{random.randint(0,9)}K",
        'domainAuthority': str(random.randint(40, 95)),
        'organicKeywordsChange': f"+{random.uniform(1.0, 10.0):.1f}%",
        'paidKeywordsChange': f"-{random.uniform(1.0, 5.0):.1f}%",
        'monthlyTrafficChange': f"+{random.uniform(5.0, 20.0):.1f}%",
        'domainAuthorityChange': f"+{random.uniform(1.0, 3.0):.1f}%",
        'topOrganicKeywords': top_organic_keywords_data[:10],
        'topPaidKeywords': [
            {'keyword': 'seo software', 'cpc': round(random.uniform(8.0, 15.0), 2), 'adSpend': random.randint(4000, 9000)},
            {'keyword': 'ppc competitor research', 'cpc': round(random.uniform(15.0, 25.0), 2), 'adSpend': random.randint(7000, 12000)},
            {'keyword': 'keyword tracking tool', 'cpc': round(random.uniform(5.0, 12.0), 2), 'adSpend': random.randint(3000, 6000)},
        ],
    }

    save_analysis(domain, analysis_result)
    return jsonify(analysis_result)


@main.route('/keyword_finder', methods=['POST'])
def keyword_finder():
    data = request.get_json()
    keyword = data.get('keyword')

    if not keyword:
        return jsonify({"error": "Keyword is required"}), 400

    mock_results = [
        {'keyword': f'{keyword} for small business', 'volume': random.randint(5000, 10000), 'cpc': round(random.uniform(10.0, 20.0), 2), 'difficulty': random.randint(80, 95)},
        {'keyword': f'best {keyword} tools', 'volume': random.randint(3000, 8000), 'cpc': round(random.uniform(5.0, 15.0), 2), 'difficulty': random.randint(70, 85)},
        {'keyword': f'free {keyword} analysis', 'volume': random.randint(1000, 5000), 'cpc': 0, 'difficulty': random.randint(60, 75)},
        {'keyword': f'how to use {keyword}', 'volume': random.randint(500, 2000), 'cpc': round(random.uniform(1.0, 5.0), 2), 'difficulty': random.randint(50, 65)},
        {'keyword': f'{keyword} pricing', 'volume': random.randint(1000, 3000), 'cpc': round(random.uniform(3.0, 10.0), 2), 'difficulty': random.randint(75, 90)},
    ]

    return jsonify(mock_results)

@main.route('/on_page_seo_check', methods=['POST'])
def on_page_seo_check():
    data = request.get_json()
    url = data.get('url')

    if not url:
        return jsonify({"error": "URL is required"}), 400

    analysis_data = analyze_on_page_seo(url)
    
    if 'error' in analysis_data:
        return jsonify(analysis_data), 500

    return jsonify(analysis_data)
