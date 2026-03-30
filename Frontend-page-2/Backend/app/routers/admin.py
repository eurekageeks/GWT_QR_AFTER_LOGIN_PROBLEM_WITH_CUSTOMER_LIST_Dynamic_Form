from fastapi import APIRouter

router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"]
)

@router.post("/add-category")
def add_category(payload: dict):
    return {
        "message": "Category added successfully",
        "data": payload
    }
