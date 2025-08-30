from functools import wraps
from flask import jsonify, request
from flask_jwt_extended import verify_jwt_in_request, get_jwt
from .models import Role

def role_required(*roles: str):
    """Restrict access to users whose JWT 'role' is in roles."""
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            if request.method == 'OPTIONS':
                return fn(*args, **kwargs)
            verify_jwt_in_request()
            claims = get_jwt()
            if claims.get("role") not in roles:
                return jsonify({"msg": "Forbidden: insufficient role"}), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper
