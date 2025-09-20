from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config

# Import routes
from routes.auth import auth_bp
from routes.onboarding import onboarding_bp
from routes.apartments import apartments_bp
from routes.people import people_bp
from routes.spots import spots_bp
from routes.matches import matches_bp
from routes.chat import chat_bp
from routes.profile import profile_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    CORS(app, origins=["http://localhost:3000"])  # React dev server
    jwt = JWTManager(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(onboarding_bp, url_prefix='/api/onboarding')
    app.register_blueprint(apartments_bp, url_prefix='/api/apartments')
    app.register_blueprint(people_bp, url_prefix='/api/people')
    app.register_blueprint(spots_bp, url_prefix='/api/spots')
    app.register_blueprint(matches_bp, url_prefix='/api/matches')
    app.register_blueprint(chat_bp, url_prefix='/api/chat')
    app.register_blueprint(profile_bp, url_prefix='/api/profile')
    
    @app.route('/api/health')
    def health_check():
        return jsonify({"status": "healthy", "message": "CityMate Backend Running"})
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5002)