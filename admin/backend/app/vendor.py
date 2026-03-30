from fastapi import APIRouter, Depends
from pydantic import BaseModel
from datetime import datetime
from database import users_collection
from uuid import uuid4

router = APIRouter(prefix="/vendor", tags=["Vendor"])

class VendorProfileRequest(BaseModel):
    vendor_name: str
    owner_name: str
    business_type: str
    gst_number: str | None = None
    fssai_license: str | None = None
    year_of_establishment: int | None = None

@router.post("/profile")
async def create_vendor_profile(data: VendorProfileRequest, user_email: str):
    vendor_id = f"VND-{datetime.now().year}-{uuid4().hex[:6].upper()}"

    await users_collection.update_one(
        {"email": user_email},
        {
            "$set": {
                "vendor_id": vendor_id,
                "vendor_profile": data.dict(),
                "vendor_profile_completed": True
            }
        }
    )

    return {
        "message": "Vendor profile created",
        "vendor_id": vendor_id
    }
