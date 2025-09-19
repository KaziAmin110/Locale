from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv; load_dotenv()

from api.auth import bp as auth_bp

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.get("/api/health")
def health():
    return {"status": "ok"}

# mount your two endpoints
app.register_blueprint(auth_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True, port=5000)
