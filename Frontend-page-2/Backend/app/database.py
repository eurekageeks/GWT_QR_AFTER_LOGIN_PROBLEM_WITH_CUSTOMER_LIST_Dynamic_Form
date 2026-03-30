from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import os

# MongoDB URL & DB Name
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "admin_dashboard")

try:
    client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=5000)
    client.admin.command("ping")
    print("✅ MongoDB connected successfully")
except ConnectionFailure as e:
    print("❌ MongoDB connection failed")
    raise e   # stop app if DB fails

# Database
db = client[DB_NAME]

# Collections
category_collection = db["categories"]
sub_category_collection = db["sub_categories"]
business_collection = db["businesses"]

# Optional but HIGHLY recommended indexes
category_collection.create_index("name", unique=True)
sub_category_collection.create_index(
    [("category_id", 1), ("name", 1)],
    unique=True
)
business_collection.create_index(
    [("category_id", 1), ("sub_category_id", 1)]
)
