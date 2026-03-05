import pymongo
from datetime import datetime

class MongoPipeline:
    def __init__(self):
        self.client = pymongo.MongoClient("mongodb://localhost:27017")
        self.db = self.client["hackathons"]
        self.collection = self.db["hackathons"]

    def process_item(self, item, spider):
        data = dict(item)
        data["createdAt"] = datetime.utcnow()
        self.collection.update_one(
            {"title": data["title"], "source": data["source"]},
            {"$set": data},
            upsert=True
        )
        return item
