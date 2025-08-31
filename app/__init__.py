from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config
import logging

# Set up basic logging
logging.basicConfig(level=logging.DEBUG)

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Import models so they register with SQLAlchemy metadata
    from .models import User, Class, Enrollment, Grade  # noqa: F401

    # Register blueprints
    from .routes.auth import auth_bp
    from .routes.users import users_bp
    from .routes.classes import classes_bp
    from .routes.enrollments import enrollments_bp
    from .routes.grades import grades_bp
    from .routes.dashboard import dashboard_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(users_bp, url_prefix="/api/users")
    app.register_blueprint(classes_bp, url_prefix="/api/classes")
    app.register_blueprint(enrollments_bp, url_prefix="/api/enrollments")
    app.register_blueprint(grades_bp, url_prefix="/api/grades")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")

    # Initialize CORS after blueprints are registered
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True, automatic_options=True)

    @app.route("/")
    def homepage():
        return "Home page"

    @app.get("/api/health")
    def health():
        return {"status": "ok"}, 200

    @jwt.expired_token_loader
    def expired_callback(jwt_header, jwt_payload):
        return jsonify({"msg": "Token has expired"}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(err):
        return jsonify({"msg": "Invalid token"}), 401

    @jwt.unauthorized_loader
    def missing_token_callback(err):
        return jsonify({"msg": "Missing authorization token"}), 401

    return app
if __name__ == "__main__":
    app = create_app()

    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))

