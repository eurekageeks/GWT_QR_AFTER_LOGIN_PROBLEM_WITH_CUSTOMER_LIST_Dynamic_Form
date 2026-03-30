from pymongo import MongoClient

# 🔹 MongoDB connection URL
MONGO_URL = "mongodb://localhost:27017"

# 🔹 Create client
client = MongoClient(MONGO_URL)

# 🔹 Database name
db = client["qr_auth_system"]

# 🔹 Collections
users_collection = db["users"]
vendors_collection = db["vendors"]
