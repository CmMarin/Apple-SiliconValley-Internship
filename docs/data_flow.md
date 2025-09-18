# Data Flow Overview

This document outlines the data flow within the Electron Task Sync application, detailing how unstructured bilingual natural language input is processed and transformed into structured tasks, which are then synced with Google Calendar.

## 1. User Input

The process begins when a user inputs a natural language task in either Romanian or English. For example:

- "Trebuie să duc copiii la școală la 8 dimineața și după asta să cumpăr fructe."
- "I have a meeting with Ana tomorrow at 3 PM."

## 2. Frontend Interaction

The input is captured through the frontend interface built with Next.js. The user submits the task via a form, which triggers an API call to the backend.

## 3. API Call

The frontend sends the raw text input to the backend API endpoint defined in `frontend/src/pages/api/proxy.ts`. This endpoint acts as a bridge between the frontend and the backend services.

## 4. NLP Processing

Upon receiving the input, the backend (using FastAPI) processes the text through the NLP pipeline. The following steps occur:

- The input text is passed to the NLP extractor (`backend/app/nlp/extractor.py`).
- The extractor utilizes Hugging Face models (e.g., `bert-base-multilingual-cased` or `flan-t5-small`) to identify tasks, times, categories, and deadlines from the input.

## 5. Structured Data Output

The NLP processing results in a structured JSON format, which organizes the extracted tasks. For example:

```json
[
  {"task": "Drop kids at school", "time": "08:00 AM", "category": "Family"},
  {"task": "Buy fruits", "category": "Shopping"}
]
```

## 6. Data Storage

The structured tasks are then stored in a MongoDB database (`backend/app/db/mongo.py`). This allows for persistent storage and retrieval of tasks.

## 7. Google Calendar Integration

The backend interacts with the Google Calendar API (`backend/app/google/calendar.py`) to create events based on the structured tasks. This includes:

- Creating calendar events for each task.
- Setting reminders as needed.

## 8. Frontend Display

Once the tasks are processed and synced with Google Calendar, the frontend updates the user interface to display:

- A list of parsed tasks.
- Sync status with Google Calendar.
- Options to export tasks to CSV format.

## 9. Summary

This data flow ensures that users can seamlessly convert their unstructured bilingual inputs into organized tasks, which are automatically synced with their Google Calendar, enhancing productivity and task management.