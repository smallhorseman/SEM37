# seo_analyzer/firestore_service.py
import os
from google.cloud import firestore
from datetime import datetime, timedelta, timezone

# --- Firestore Initialization ---
# This code is now simplified. It will automatically use the 
# GOOGLE_APPLICATION_CREDENTIALS environment variable (which Render sets to the path of your secret file)
# to authenticate. For local development, it will use your gcloud login.
db = None
try:
    print("Connecting to Firestore...")
    # The google-cloud-firestore library automatically finds and uses
    # the GOOGLE_APPLICATION_CREDENTIALS environment variable that Render sets.
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
