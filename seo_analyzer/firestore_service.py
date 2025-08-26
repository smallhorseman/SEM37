# seo_analyzer/firestore_service.py
import os
from google.cloud import firestore
from datetime import datetime, timedelta, timezone

# --- Firestore Initialization ---
# This setup is more secure and flexible.
# It will automatically find your project credentials without needing a file.
# 1. For local development: Run `gcloud auth application-default login` in your terminal.
# 2. When deployed: It will automatically use the service account credentials from the environment.
try:
    db = firestore.Client()
    # The client will automatically discover the project ID from the environment.
    print(f"Successfully connected to Firestore project: {db.project}")
except Exception as e:
    print(f"Error connecting to Firestore: {e}")
    print("Please ensure you have authenticated via `gcloud auth application-default login` for local development.")
    db = None

def save_analysis(domain, data):
    """
    Saves a new analysis result to Firestore.

    Args:
        domain (str): The domain that was analyzed.
        data (dict): The analysis data to save.
    """
    if not db:
        print("Firestore client not initialized. Skipping save.")
        return

    try:
        # Create a reference to the document. We'll use the domain name as the
        # document ID for easy lookup.
        doc_ref = db.collection('analyses').document(domain)
        
        # Add a timestamp to the data before saving.
        data['timestamp'] = firestore.SERVER_TIMESTAMP
        
        # Use .set() to create or overwrite the document with the new data.
        doc_ref.set(data)
        print(f"Successfully saved analysis for {domain}")
    except Exception as e:
        print(f"Error saving analysis for {domain}: {e}")


def get_latest_analysis(domain):
    """
    Retrieves the latest analysis for a domain if it's recent (less than 24 hours old).

    Args:
        domain (str): The domain to look up.

    Returns:
        dict or None: The analysis data if a recent one exists, otherwise None.
    """
    if not db:
        print("Firestore client not initialized. Skipping fetch.")
        return None
        
    try:
        doc_ref = db.collection('analyses').document(domain)
        doc = doc_ref.get()

        if doc.exists:
            data = doc.to_dict()
            timestamp = data.get('timestamp')
            
            # Check if the analysis is less than 24 hours old.
            if timestamp and (datetime.now(timezone.utc) - timestamp) < timedelta(hours=24):
                print(f"Found recent analysis for {domain} in cache.")
                # Convert Firestore timestamp to a string for JSON serialization
                data['timestamp'] = timestamp.isoformat()
                return data
            else:
                print(f"Analysis for {domain} is outdated.")
                return None
        else:
            print(f"No previous analysis found for {domain}.")
            return None
    except Exception as e:
        print(f"Error getting analysis for {domain}: {e}")
        return None
```

After you update the file with this clean version, please try deploying to Render again. This should resolve the `SyntaxErro
