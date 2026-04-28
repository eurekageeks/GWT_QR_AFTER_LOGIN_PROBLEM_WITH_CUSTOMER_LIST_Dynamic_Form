from fastapi import APIRouter, Form, UploadFile, File
from typing import List, Optional
from database import dynamic_business_collection
import json
import os
import shutil
from uuid import uuid4
from datetime import datetime

router = APIRouter(prefix="/dynamic", tags=["Dynamic Business"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def save_file(file: UploadFile):
    filename = f"{uuid4()}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return f"/uploads/{filename}"


@router.post("/business")
async def create_business(
    category: str = Form(...),
    sub_category: str = Form(None),

    clinic_name: str = Form(None),
    clinic_type: str = Form(None),
    about_clinic: str = Form(None),
    clinic_description: str = Form(None),

    phone: str = Form(None),
    email: str = Form(None),
    whatsapp: str = Form(None),
    website: str = Form(None),

    clinic_address: str = Form(None),
    city: str = Form(None),
    state: str = Form(None),
    pincode: str = Form(None),
    map_location: str = Form(None),

    services: str = Form("[]"),
    amenities: str = Form("[]"),
    payment_methods: str = Form("[]"),
    insurance: str = Form("[]"),
    doctors: str = Form("[]"),

    clinic_logo: UploadFile = File(None),
    images: List[UploadFile] = File(None)
):
    # ✅ Parse JSON fields
    services = json.loads(services)
    amenities = json.loads(amenities)
    payment_methods = json.loads(payment_methods)
    insurance = json.loads(insurance)
    doctors = json.loads(doctors)

    # ✅ Save logo
    logo_url = save_file(clinic_logo) if clinic_logo else None

    # ✅ Save multiple images
    image_urls = []
    if images:
        for img in images:
            image_urls.append(save_file(img))

    # ✅ Final structured document
    doc = {
        "category": category,
        "sub_category": sub_category,

        "clinic_name": clinic_name,
        "clinic_type": clinic_type,
        "about_clinic": about_clinic,
        "clinic_description": clinic_description,

        "contact": {
            "phone": phone,
            "email": email,
            "whatsapp": whatsapp,
            "website": website
        },

        "location": {
            "address": clinic_address,
            "city": city,
            "state": state,
            "pincode": pincode,
            "map_location": map_location
        },

        "services": services,
        "amenities": amenities,
        "payment_methods": payment_methods,
        "insurance": insurance,
        "doctors": doctors,

        "logo": logo_url,
        "images": image_urls,

        "created_at": datetime.utcnow()
    }

    result = dynamic_business_collection.insert_one(doc)

    return {
        "message": "Business created successfully",
        "id": str(result.inserted_id)
    }

@router.get("/business")
def get_business():
    data = []

    for item in dynamic_business_collection.find():
        item["_id"] = str(item["_id"])
        data.append(item)

    return data