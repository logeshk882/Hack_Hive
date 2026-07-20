import pymongo
from hack_scraper.date_utils import is_hackathon_closed

def cleanup_expired_hackathons(mongo_uri="mongodb://localhost:27017", db_name="hackathons", collection_name="hackathons"):
    """
    Connects to MongoDB and deletes all hackathon documents whose deadline date or title indicates it is expired.
    """
    try:
        client = pymongo.MongoClient(mongo_uri, serverSelectionTimeoutMS=3000)
        db = client[db_name]
        collection = db[collection_name]
        
        cursor = collection.find({})
        expired_ids = []
        deleted_titles = []

        for item in cursor:
            deadline = item.get("deadline", "")
            title = item.get("title", "")
            if is_hackathon_closed(deadline, title):
                expired_ids.append(item["_id"])
                deleted_titles.append(title)

        if expired_ids:
            res = collection.delete_many({"_id": {"$in": expired_ids}})
            print(f"[Python Cleanup] Removed {res.deleted_count} expired/closed hackathons from MongoDB.")
            return res.deleted_count
        else:
            print("[Python Cleanup] No expired hackathons found in MongoDB.")
            return 0
    except Exception as e:
        print(f"[Python Cleanup Error] Could not clean expired hackathons: {e}")
        return 0

if __name__ == "__main__":
    cleanup_expired_hackathons()
