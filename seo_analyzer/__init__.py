# seo_analyzer/__init__.py
from flask import Flask
from flask_cors import CORS

def create_app():
    """Creates and configures the Flask app."""
    app = Flask(__name__)
    
    # Define the allowed origins for CORS
    origins = [
        "http://localhost:5174",      # For local development
        "https://tools.studio37.cc"   # Your live frontend URL
    ]

    # Apply CORS to all routes, allowing requests from the defined origins
    CORS(app, resources={r"/*": {"origins": origins}})

    # Import and register the routes (blueprint)
    from . import routes
    app.register_blueprint(routes.main)

    return app
