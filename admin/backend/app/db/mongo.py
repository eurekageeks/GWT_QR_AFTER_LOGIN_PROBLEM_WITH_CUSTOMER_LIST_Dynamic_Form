from pymongo import MongoClient

MONGO_URL = "mongodb://localhost:27017"

client = MongoClient(MONGO_URL)

db = client.qr_auth_system

users_collection = db.users
categories_collection = db["categories"]
sub_categories_collection = db["sub_categories"]