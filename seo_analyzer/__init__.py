# seo_analyzer/__init__.py
from flask import Flask
from flask_cors import CORS

def create_app():
    """Creates and configures the Flask app."""
    app = Flask(__name__)
    
    # Allow requests to all endpoints from your frontend
    CORS(app, resources={
        r"/analyze": {"origins": "http://localhost:5174"},
        r"/keyword_finder": {"origins": "http://localhost:5174"},
        r"/on_page_seo_check": {"origins": "http://localhost:5174"} # Added the new endpoint here
    })

    # Import and register the routes (blueprint)
    from . import routes
    app.register_blueprint(routes.main)

    return app
