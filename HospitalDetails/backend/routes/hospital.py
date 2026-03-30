from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from bson import ObjectId
from database import db
from models.hospital_model import Hospital
import os
import shutil
import json
import re

def create_slug(name: str) -> str:
    slug = name.lower()
    slug = re.sub(r"\s+", "-", slug)
    slug = re.sub(r"[^\w\-]", "", slug)
    return slug
router = APIRouter()

# ==============================
# CONFIG
# ==============================

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ==============================
# GET ALL HOSPITALS
# ==============================

@router.get("/")
async def get_hospitals():
    hospitals = []
    async for hospital in db.hospitals.find():
        hospital["_id"] = str(hospital["_id"])
        hospitals.append(hospital)
    return hospitals

@router.get("/slug/{slug}")
async def get_hospital_by_slug(slug: str):

    # convert slug back to hospital name
    name_from_slug = slug.replace("-", " ")

    # Case-insensitive search
    hospital = await db.hospitals.find_one({
        "name": {"$regex": f"^{name_from_slug}$", "$options": "i"}
    })

    if not hospital:
        raise HTTPException(status_code=404, detail="Hospital not found")

    hospital["_id"] = str(hospital["_id"])
    return hospital
# ==============================
# GET SINGLE HOSPITAL
# ==============================

@router.get("/{hospital_id}")
async def get_hospital(hospital_id: str):

    if not ObjectId.is_valid(hospital_id):
        raise HTTPException(status_code=400, detail="Invalid hospital ID")

    hospital = await db.hospitals.find_one({"_id": ObjectId(hospital_id)})

    if not hospital:
        raise HTTPException(status_code=404, detail="Hospital not found")

    hospital["_id"] = str(hospital["_id"])
    return hospital


# ==============================
# CREATE HOSPITAL (JSON + FILE UPLOAD)
# ==============================

@router.post("/")
async def create_hospital(
    hospital_json: str = Form(...),
    doctor_images: list[UploadFile] = File(None)
):
    try:
        hospital_data = json.loads(hospital_json)

        if "doctors" not in hospital_data:
            hospital_data["doctors"] = []

        # Initialize images array
        for doctor in hospital_data["doctors"]:
            doctor["images"] = []

        # Save uploaded images
        if doctor_images:
            image_index = 0

            for doctor in hospital_data["doctors"]:
                if image_index < len(doctor_images):
                    file = doctor_images[image_index]

                    file_path = f"{UPLOAD_FOLDER}/{file.filename}"

                    with open(file_path, "wb") as buffer:
                        shutil.copyfileobj(file.file, buffer)

                    doctor["images"].append(file_path)
                    image_index += 1
        hospital_data["slug"] = create_slug(hospital_data["name"])
        validated = Hospital(**hospital_data)

        result = await db.hospitals.insert_one(
            validated.dict(exclude_none=True)
        )

        return {"id": str(result.inserted_id)}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
# ==============================
# UPDATE HOSPITAL
# ==============================

@router.put("/{hospital_id}")
async def update_hospital(
    hospital_id: str,
    hospital: Hospital
):

    if not ObjectId.is_valid(hospital_id):
        raise HTTPException(status_code=400, detail="Invalid hospital ID")

    result = await db.hospitals.update_one(
        {"_id": ObjectId(hospital_id)},
        {"$set": hospital.dict(exclude_none=True)}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Hospital not found")

    return {"message": "Hospital updated successfully"}


# ==============================
# DELETE HOSPITAL
# ==============================

@router.delete("/{hospital_id}")
async def delete_hospital(hospital_id: str):

    if not ObjectId.is_valid(hospital_id):
        raise HTTPException(status_code=400, detail="Invalid hospital ID")

    result = await db.hospitals.delete_one({"_id": ObjectId(hospital_id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Hospital not found")

    return {"message": "Hospital deleted successfully"}