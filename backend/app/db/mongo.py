from pymongo import MongoClient
import os

class MongoDB:
    def __init__(self):
        self.client = None
        self.db = None

    def connect(self):
        mongo_uri = os.getenv("MONGO_URI")
        self.client = MongoClient(mongo_uri)
        self.db = self.client.get_default_database()

    def close(self):
        if self.client:
            self.client.close()

    def insert_task(self, task_data):
        tasks_collection = self.db['tasks']
        result = tasks_collection.insert_one(task_data)
        return result.inserted_id

    def get_tasks(self):
        tasks_collection = self.db['tasks']
        return list(tasks_collection.find())

    def delete_task(self, task_id):
        tasks_collection = self.db['tasks']
        result = tasks_collection.delete_one({'_id': task_id})
        return result.deleted_count

    def update_task(self, task_id, update_data):
        tasks_collection = self.db['tasks']
        result = tasks_collection.update_one({'_id': task_id}, {'$set': update_data})
        return result.modified_count