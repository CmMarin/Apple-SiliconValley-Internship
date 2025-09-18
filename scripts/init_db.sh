#!/bin/bash

# This script initializes the MongoDB database for the task sync application.

# Set the MongoDB connection string
MONGO_URI="mongodb://localhost:27017"

# Set the database name
DB_NAME="task_sync_db"

# Create the database and collections
mongo $MONGO_URI/$DB_NAME --eval "
db.createCollection('tasks');
db.createCollection('users');
" 

echo "Database and collections initialized successfully."