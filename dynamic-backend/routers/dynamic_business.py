from fastapi import APIRouter, Form, UploadFile, File
from database import dynamic_business_collection
import json
import os
import shutil
from uuid import uuid4

router = APIRouter(
    prefix="/dynamic",
    tags=["Dynamic Business"]
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# CREATE BUSINESS
@router.post("/business")
async def create_dynamic_business(
    category: str = Form(...),
    sub_category: str = Form(None),
    data: str = Form(...),
    image: UploadFile = File(None)
):
    
    parsed_data = json.loads(data)

    image_url = None

    if image:
        filename = f"{uuid4()}_{image.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        image_url = f"/uploads/{filename}"

    doc = {
        "category": category,
        "sub_category": sub_category,
        "image": image_url,
        "data": parsed_data
    }

    result = dynamic_business_collection.insert_one(doc)

    return {
        "message": "Dynamic business created",
        "id": str(result.inserted_id)
    }


# GET ALL
@router.get("/business")
def get_dynamic_business():

    businesses = []

    for item in dynamic_business_collection.find():
        businesses.append({
            "_id": str(item["_id"]),
            "category": item.get("category"),
            "sub_category": item.get("sub_category"),
            "image": item.get("image"),
            "data": item.get("data")
        })

    return businesses