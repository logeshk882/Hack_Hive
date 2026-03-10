import pymongo
from datetime import datetime

class MongoPipeline:
    def __init__(self):
        try:
            self.client = pymongo.MongoClient("mongodb://localhost:27017")
            # Database: hackathons, Collection: hackathons
            self.db = self.client["hackathons"]
            self.collection = self.db["hackathons"]
            print("Connected to MongoDB: hackathons.hackathons")
        except Exception as e:
            print(f"Could not connect to MongoDB: {e}")

    def process_item(self, item, spider):
        data = dict(item)
        data["createdAt"] = datetime.utcnow()
        try:
            self.collection.update_one(
                {"title": data["title"], "source": data["source"]},
                {"$set": data},
                upsert=True
            )
        except Exception as e:
            print(f"Error saving to MongoDB: {e}")
        return item
