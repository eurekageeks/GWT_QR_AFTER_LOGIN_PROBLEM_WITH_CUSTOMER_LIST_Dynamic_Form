from fastapi import APIRouter, Form, HTTPException
from app.database import category_collection, sub_category_collection
from bson import ObjectId

router = APIRouter(prefix="/admin", tags=["Sub Category"])


# --------------------------------
# ADD SUB-CATEGORY
# --------------------------------
@router.post("/sub-categories")
async def add_sub_category(
    category_id: str = Form(...),
    name: str = Form(...)
):
    # Validate category
    category = category_collection.find_one({"_id": ObjectId(category_id)})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    # Prevent duplicate sub-category under same category
    exists = sub_category_collection.find_one({
        "category_id": ObjectId(category_id),
        "name": name
    })
    if exists:
        raise HTTPException(
            status_code=400,
            detail="Sub-category already exists for this category"
        )

    data = {
        "category_id": ObjectId(category_id),
        "name": name
    }

    result = sub_category_collection.insert_one(data)

    return {
        "message": "Sub-category added successfully",
        "data": {
            "_id": str(result.inserted_id),
            "category_id": category_id,
            "name": name
        }
    }


# --------------------------------
# GET SUB-CATEGORIES (BY CATEGORY)
# --------------------------------
@router.get("/sub-categories/{category_id}")
async def get_sub_categories(category_id: str):
    return [
        {
            "_id": str(sub["_id"]),
            "name": sub["name"],
            "category_id": str(sub["category_id"])
        }
        for sub in sub_category_collection.find(
            {"category_id": ObjectId(category_id)}
        )
    ]