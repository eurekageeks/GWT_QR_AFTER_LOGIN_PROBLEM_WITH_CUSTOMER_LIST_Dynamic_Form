from fastapi import APIRouter, Depends, HTTPException
from app.models.user_models import VendorProfileRequest
from app.db.mongo import vendors_collection
from bson import ObjectId

router = APIRouter(
    prefix="/vendor",
    tags=["Vendor"]
)

# ---------------- CREATE / UPDATE PROFILE ----------------
@router.post("/profile")
async def create_or_update_vendor_profile(profile: VendorProfileRequest):
    vendor_data = profile.dict()

    result = vendors_collection.insert_one(vendor_data)

    return {
        "message": "Vendor profile saved",
        "vendor_id": str(result.inserted_id)
    }

# ---------------- GET MY PROFILE ----------------
@router.get("/profile/me")
async def get_my_vendor_profile():
    vendor = vendors_collection.find_one()

    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor profile not found")

    vendor["_id"] = str(vendor["_id"])
    return vendor

# ---------------- LIST ALL VENDORS ----------------
@router.get("/list")
async def get_vendor_list():
    vendors = []
    for vendor in vendors_collection.find():
        vendor["_id"] = str(vendor["_id"])
        vendors.append(vendor)

    return vendors
@router.put("/profile")
async def update_vendor_profile(profile: VendorProfileRequest):
    updated = vendors_collection.find_one_and_update(
        {},
        {"$set": profile.dict()},
        return_document=True
    )

    if not updated:
        raise HTTPException(status_code=404, detail="Vendor profile not found")

    updated["_id"] = str(updated["_id"])
    return updated