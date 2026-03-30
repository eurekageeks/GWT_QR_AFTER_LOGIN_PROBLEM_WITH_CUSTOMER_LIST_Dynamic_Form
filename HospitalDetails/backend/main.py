from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.hospital import router as hospital_router
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="Hospital API")

# ✅ CORS Middleware (must be before including routers)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Include Routers
app.include_router(hospital_router, prefix="/api/hospitals", tags=["Hospitals"])

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
async def root():
    return {"message": "Hospital API is running 🚀"}