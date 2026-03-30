# app/models/user_models.py

from pydantic import BaseModel, EmailStr, Field
from typing import Literal, Optional


# ================= AUTH MODELS =================

class SignupRequest(BaseModel):
    email: EmailStr
    mobile: str = Field(..., min_length=10, max_length=15)
    password: str = Field(..., min_length=6)
    role: Literal["vendor", "customer", "admin"]


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    role: Literal["vendor", "customer", "admin"]


# ================= VENDOR PROFILE MODELS =================

class VendorProfileRequest(BaseModel):
    vendor_name: str = Field(..., min_length=2)
    owner_name: str = Field(..., min_length=2)
    business_type: str
    year_of_establishment: Optional[int] = None
    gst_number: Optional[str] = None
    fssai_license: Optional[str] = None