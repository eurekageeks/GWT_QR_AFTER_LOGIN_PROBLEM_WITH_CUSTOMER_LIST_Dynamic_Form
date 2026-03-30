from fastapi import APIRouter, HTTPException
from app.db.mongo import users_collection
from app.models.user_models import SignupRequest, LoginRequest
from app.utils.security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/signup")
def signup(data: SignupRequest):
    if users_collection.find_one({"email": data.email}):
        raise HTTPException(status_code=400, detail="User already exists")

    users_collection.insert_one({
        "email": data.email,
        "mobile": data.mobile,
        "role": data.role,          # ✅ vendor / customer / admin
        "password": hash_password(data.password)
    })

    return {"message": "Signup successful"}


@router.post("/login")
def login(data: LoginRequest):
    user = users_collection.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token({
        "sub": user["email"],
        "role": user["role"]
    })

    # ✅ EXACT STRUCTURE FRONTEND EXPECTS
    return {
        "access_token": access_token,
        "user": {
            "email": user["email"],
            "role": user["role"]
        }
    }
