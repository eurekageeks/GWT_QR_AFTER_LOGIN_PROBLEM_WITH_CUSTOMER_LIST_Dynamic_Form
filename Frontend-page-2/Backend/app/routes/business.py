from fastapi import APIRouter, Form, UploadFile, File, HTTPException
from app.database import (
    category_collection,
    sub_category_collection,
    business_collection
)
from bson import ObjectId
from uuid import uuid4
import os
import shutil

router = APIRouter(prefix="/admin", tags=["Business"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# -------------------------------
# ADD BUSINESS
# -------------------------------
from typing import Optional

@router.post("/businesses")
def add_business(
    category_id: str = Form(...),
    sub_category_id: Optional[str] = Form(None),
    image: UploadFile = File(...)
):
    # Validate category
    if not category_collection.find_one({"_id": ObjectId(category_id)}):
        raise HTTPException(status_code=404, detail="Category not found")

    # Validate sub-category only if provided
    if sub_category_id:
        if not sub_category_collection.find_one({"_id": ObjectId(sub_category_id)}):
            raise HTTPException(status_code=404, detail="Sub-category not found")

    # Save image
    filename = f"{uuid4()}_{image.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    data = {
        "category_id": ObjectId(category_id),
        "sub_category_id": ObjectId(sub_category_id) if sub_category_id else None,
        "image": f"/uploads/{filename}"
    }

    result = business_collection.insert_one(data)

    return {
        "message": "Business added successfully",
        "data": {
            "_id": str(result.inserted_id),
            "category_id": category_id,
            "sub_category_id": sub_category_id if sub_category_id else None,
            "image": data["image"]
        }
    }


# -------------------------------
# GET BUSINESSES  ✅ FIXED
# -------------------------------
@router.get("/businesses")
def get_businesses():
    businesses = []

    for item in business_collection.find():
        category = category_collection.find_one(
            {"_id": item["category_id"]}
        )
        sub_category = sub_category_collection.find_one(
            {"_id": item["sub_category_id"]}
        )

        businesses.append({
            "_id": str(item["_id"]),
            "image": item.get("image"),
            "category": category["name"] if category else "",
            "sub_category": sub_category["name"] if sub_category else ""
        })

    return businesses
