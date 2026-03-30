from fastapi import APIRouter, HTTPException, status
from app.db.mongo import users_collection
from app.models.user_models import SignupRequest, LoginRequest
from app.utils.security import (
    hash_password,
    verify_password,
    create_access_token,
)

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

# ---------------- SIGNUP ----------------
@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(data: SignupRequest):
    existing_user = users_collection.find_one({"email": data.email})

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists"
        )

    users_collection.insert_one({
        "email": data.email,
        "mobile": data.mobile,
        "role": data.role,   # admin / vendor / customer
        "password": hash_password(data.password),
        "is_active": True
    })

    return {
        "message": "Signup successful"
    }


# ---------------- LOGIN ----------------
@router.post("/login")
def login(data: LoginRequest):
    user = users_collection.find_one({"email": data.email})

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if user["role"] != data.role:
        raise HTTPException(
            status_code=403,
            detail="You are not authorized for this role"
        )

    access_token = create_access_token({
        "user_id": str(user["_id"]),
        "email": user["email"],
        "role": user["role"],
    })

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "email": user["email"],
            "role": user["role"],
        }
    }
