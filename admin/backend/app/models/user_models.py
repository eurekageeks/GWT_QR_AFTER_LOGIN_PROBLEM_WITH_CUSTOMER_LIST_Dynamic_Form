from pydantic import BaseModel, EmailStr, Field
from typing import Literal, Optional


class SignupRequest(BaseModel):
    role: Literal["vendor", "customer", "admin"] = Field(
        ..., description="User role"
    )
    email: EmailStr
    mobile: str = Field(
        ..., min_length=10, max_length=15, description="Mobile number"
    )
    password: str = Field(
        ..., min_length=6, description="User password"
    )

    category_id: Optional[str] = None
    sub_category_id: Optional[str] = None

    category: Optional[str] = None
    sub_category: Optional[str] = None


# ✅ ADD THIS (MISSING)
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# (Optional but good)
class LoginResponse(BaseModel):
    message: str
    email: str
    role: str
    category: Optional[str] = None
    sub_category: Optional[str] = None