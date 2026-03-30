from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routes.category import router as category_router
from app.routes.sub_category import router as sub_category_router
from app.routes.business import router as business_router
import os

app = FastAPI(title="Admin Dashboard API")

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ✅ MOUNT ONCE
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_PREFIX = "/api"
app.include_router(category_router, prefix=API_PREFIX)
app.include_router(sub_category_router, prefix=API_PREFIX)
app.include_router(business_router, prefix=API_PREFIX)

@app.get("/")
def root():
    return {"status": "FastAPI backend is running 🚀"}