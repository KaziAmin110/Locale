import os
from functools import lru_cache
from flask import abort
import requests
import jwt
from jwt import PyJWKClient

SUPABASE_URL = os.getenv("SUPABASE_URL")
if not SUPABASE_URL:
    raise RuntimeError("SUPABASE_URL not set")

JWKS_URL     = f"{SUPABASE_URL}/auth/v1/jwks"
EXPECTED_ISS = f"{SUPABASE_URL}/auth/v1"
EXPECTED_AUD = "authenticated"  # Supabase access tokens audience

@lru_cache(maxsize=1)
def _jwk_client() -> PyJWKClient:
    # PyJWKClient handles fetching and caching the JWKS for us
    return PyJWKClient(JWKS_URL, cache_keys=True)

def verify_supabase_bearer(authorization_header: str) -> dict:
    """Validate 'Authorization: Bearer <access_token>' issued by Supabase Auth.
       Return decoded claims (contains 'sub' = auth.users.id)."""
    if not authorization_header or not authorization_header.startswith("Bearer "):
        abort(401, "Missing Bearer token")

    token = authorization_header.split(" ", 1)[1].strip()

    try:
        signing_key = _jwk_client().get_signing_key_from_jwt(token).key
        claims = jwt.decode(
            token,
            signing_key,
            algorithms=["RS256"],
            audience=EXPECTED_AUD,
            issuer=EXPECTED_ISS,
        )
        # Example useful claims: sub (uuid), email, role, user_metadata
        return claims
    except jwt.ExpiredSignatureError:
        abort(401, "Token expired")
    except jwt.InvalidAudienceError:
        abort(401, "Invalid audience")
    except jwt.InvalidIssuerError:
        abort(401, "Invalid issuer")
    except Exception:
        abort(401, "Invalid token")
