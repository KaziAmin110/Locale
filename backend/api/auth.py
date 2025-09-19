import os
from flask import Blueprint, request, jsonify
from api.supa_verify import verify_supabase_bearer
from supabase import create_client, Client

bp = Blueprint("auth", __name__)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise RuntimeError("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")

# Server-side Supabase client (service role) to manage your app tables
_supa: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

@bp.post("/auth/google-login")
def google_login():
    """Caller sends Authorization: Bearer <Supabase access_token>."""
    claims = verify_supabase_bearer(request.headers.get("Authorization", ""))
    auth_user_id = claims["sub"]
    email = claims.get("email")
    name  = claims.get("user_metadata", {}).get("full_name") or claims.get("name")

    # Upsert your app-level users row linked to auth.users
    # on_conflict('auth_user_id') ensures idempotency
    data = {
        "auth_user_id": auth_user_id,
        "email": email,
        "name": name
    }
    resp = _supa.table("users").upsert(data, on_conflict="auth_user_id").select("*").execute()
    row = (resp.data or [None])[0]

    # Return minimal profile (your id if present; fall back to claims otherwise)
    payload = {
        "auth_user_id": auth_user_id,
        "email": email,
        "name": name
    }
    if row and "id" in row:
        payload["id"] = row["id"]

    return jsonify(payload), 200

@bp.get("/auth/me")
def me():
    """Return identity for the provided Supabase access_token."""
    claims = verify_supabase_bearer(request.headers.get("Authorization", ""))
    auth_user_id = claims["sub"]

    # Try to return your app profile first
    prof = _supa.table("users").select("id,email,name").eq("auth_user_id", auth_user_id).limit(1).execute()
    if prof.data:
        row = prof.data[0]
        return jsonify({
            "id": row["id"],
            "auth_user_id": auth_user_id,
            "email": row.get("email"),
            "name": row.get("name")
        }), 200

    # Fallback to claims if no app profile yet
    return jsonify({
        "auth_user_id": auth_user_id,
        "email": claims.get("email"),
        "name": claims.get("user_metadata", {}).get("full_name") or claims.get("name")
    }), 200
