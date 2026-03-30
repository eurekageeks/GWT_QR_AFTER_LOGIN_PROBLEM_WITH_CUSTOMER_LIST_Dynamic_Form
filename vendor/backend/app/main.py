# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.auth import router as auth_router
from app.routes.vendor import router as vendor_router

# later:
# from app.routes.admin import router as admin_router
# from app.routes.customer import router as customer_router

app = FastAPI(title="Restaurant Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- REGISTER ROUTERS ----------------
app.include_router(auth_router)        # /auth/*
app.include_router(vendor_router)      # /vendor/*
# app.include_router(admin_router)     # /admin/*
# app.include_router(customer_router)  # /customer/*
