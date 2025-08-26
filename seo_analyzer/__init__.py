from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    
    CORS(app, resources={
        r"/analyze": {"origins": "*"},
        r"/keyword_finder": {"origins": "*"},
        r"/on_page_seo_check": {"origins": "*"}
    })

    from . import routes
    app.register_blueprint(routes.main)

    return app
