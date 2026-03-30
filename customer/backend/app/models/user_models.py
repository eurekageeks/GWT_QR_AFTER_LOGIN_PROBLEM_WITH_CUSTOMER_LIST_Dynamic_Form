# app/models/user_models.py
from pydantic import BaseModel, EmailStr, Field
from typing import Literal


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


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
