# seo_analyzer/__init__.py
from flask import Flask
from flask_cors import CORS

def create_app():
    """Creates and configures the Flask app."""
    app = Flask(__name__)
    
    # --- UPDATED ---
    # Define the allowed origins
    origins = [
        "http://localhost:5174", # For local development
        "https://tools.studio37.cc"  # Your live frontend URL
    ]

    # Allow requests from the defined origins to all endpoints
    CORS(app, resources={r"/*": {"origins": origins}})

    # Import and register the routes (blueprint)
    from . import routes
    app.register_blueprint(routes.main)

    return app
