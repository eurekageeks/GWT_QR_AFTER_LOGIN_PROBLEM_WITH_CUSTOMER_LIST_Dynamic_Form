from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")

db = client["dynamic_db"]

dynamic_business_collection = db["dynamic_business"]