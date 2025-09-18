#!/bin/bash

# Navigate to the backend directory and run the FastAPI server
cd ../backend/app
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &

# Navigate to the frontend directory and run the Next.js development server
cd ../../frontend
npm run dev &

# Navigate to the electron directory and run the Electron app
cd ../electron
npm start