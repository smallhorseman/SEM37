# seo_analyzer/gemini_service.py
import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

def get_gemini_recommendations(seo_data):
    """
    Takes SEO data, sends it to the Gemini API, and returns strategic recommendations.

    Args:
        seo_data (dict): The dictionary of analysis results from the on-page checker.

    Returns:
        str: A string containing the AI-generated SEO recommendations.
    """
    try:
        # Configure the Gemini API client by getting the key from the environment
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return "Error: GEMINI_API_KEY not found. Please add it to your .env file."
        genai.configure(api_key=api_key)
        
        model = genai.GenerativeModel('gemini-pro')

        # --- Prompt Engineering ---
        # Create a detailed prompt for the AI model
        prompt = f"""
        You are an expert SEO strategist. Analyze the following on-page SEO data for the website {seo_data.get('url', '')}.
        Provide a concise, actionable strategy to improve its search engine ranking. 
        Focus on the 2-3 most critical issues first. 
        Present your recommendations in a clear, easy-to-understand format using markdown.

        Here is the data:
        - **Title Tag:** - Text: "{seo_data['title']['text']}"
          - Length: {seo_data['title']['length']} (Recommended: 50-60 characters)
          - Status: {seo_data['title']['status']}

        - **Meta Description:** - Text: "{seo_data['metaDescription']['text']}"
          - Length: {seo_data['metaDescription']['length']} (Recommended: 150-160 characters)
          - Status: {seo_data['metaDescription']['status']}

        - **H1 Tags:** - Count: {seo_data['h1']['count']} (Recommended: 1)
          - Tags Found: {', '.join(seo_data['h1']['tags']) if seo_data['h1']['tags'] else 'None'}
          - Status: {seo_data['h1']['status']}

        - **Word Count:** {seo_data['wordCount']} words.

        - **Image SEO:** Found {len(seo_data['images'])} images. {len([img for img in seo_data['images'] if not img['alt']])} images are missing alt text.

        Based on this data, provide your expert recommendations.
        """

        # Generate the content
        response = model.generate_content(prompt)
        
        return response.text

    except Exception as e:
        print(f"An error occurred while calling the Gemini API: {e}")
        return f"Error: Could not generate AI recommendations. Details: {e}"
