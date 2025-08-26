# seo_analyzer/firestore_service.py
import os
from google.cloud import firestore
from google.oauth2 import service_account
from datetime import datetime, timedelta, timezone

# --- Firestore Initialization ---
db = None
try:
    print("Connecting to Firestore...")
    
    # Get the path to the credentials file from the environment variable set by Render
    credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

    if credentials_path:
        print(f"Found credentials file at: {credentials_path}")
        # Explicitly use the service account file for authentication
        credentials = service_account.Credentials.from_service_account_file(credentials_path)
        db = firestore.Client(credentials=credentials)
    else:
        # Fallback for local development (uses your gcloud login)
        print("No credentials file path found, using default credentials for local development.")
        db = firestore.Client()

    print("Successfully connected to Firestore.")

except Exception as e:
    print(f"Error connecting to Firestore: {e}")


def save_analysis(domain, data):
    """
    Saves a new analysis result to Firestore.
    """
    if not db:
        print("Firestore client not initialized. Skipping save.")
        return

    try:
        doc_ref = db.collection('analyses').document(domain)
        data['timestamp'] = firestore.SERVER_TIMESTAMP
        doc_ref.set(data)
        print(f"Successfully saved analysis for {domain}")
    except Exception as e:
        print(f"Error saving analysis for {domain}: {e}")


def get_latest_analysis(domain):
    """
    Retrieves the latest analysis for a domain if it's recent.
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
            
            if timestamp and (datetime.now(timezone.utc) - timestamp) < timedelta(hours=24):
                print(f"Found recent analysis for {domain} in cache.")
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
