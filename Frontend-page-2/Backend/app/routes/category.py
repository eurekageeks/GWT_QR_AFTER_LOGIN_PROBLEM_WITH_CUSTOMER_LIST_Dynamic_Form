from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.database import category_collection
from uuid import uuid4
from bson import ObjectId
import shutil
import os

router = APIRouter(prefix="/admin", tags=["Category"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# -------------------------------
# ADD CATEGORY
# -------------------------------
@router.post("/categories")
async def add_category(
    name: str = Form(...),
    image: UploadFile | None = File(None)
):
    # Check duplicate
    if category_collection.find_one({"name": name}):
        raise HTTPException(status_code=400, detail="Category already exists")

    image_url = None

    if image:
        filename = f"{uuid4()}_{image.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        image_url = f"/uploads/{filename}"

    data = {
        "name": name,
        "image": image_url
    }

    result = category_collection.insert_one(data)

    return {
        "message": "Category added successfully",
        "data": {
            "_id": str(result.inserted_id),
            "name": name,
            "image": image_url
        }
    }


# -------------------------------
# GET ALL CATEGORIES (Dropdown)
# -------------------------------
@router.get("/categories")
async def get_categories():
    return [
        {
            "_id": str(cat["_id"]),
            "name": cat["name"],
            "image": cat.get("image")
        }
        for cat in category_collection.find()
    ]
