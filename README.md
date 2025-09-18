# Electron Task Sync

## Project Overview

The Electron Task Sync project aims to convert unstructured bilingual natural language input (Romanian + English) into structured tasks and automatically sync them with Google Calendar. This application will provide a user-friendly interface for task management and calendar integration.

## Project Structure

The project is organized into three main components:

1. **Electron App**: The core application built using Electron, which serves as the desktop interface.
   - Located in the `electron` directory.

2. **Frontend**: A Next.js application that provides the user interface for inputting tasks and viewing calendar events.
   - Located in the `frontend` directory.

3. **Backend**: A Python-based API that processes natural language input, interacts with the database, and communicates with Google Calendar.
   - Located in the `backend` directory.

## Core Features

- **Natural Language Task Input**: Users can input tasks in both Romanian and English.
- **Automatic Parsing**: The backend will parse the input to extract tasks, times, categories, and deadlines.
- **Structured Data Storage**: Parsed tasks will be stored in MongoDB.
- **Google Calendar Sync**: Tasks will be automatically synced with Google Calendar.
- **Web UI**: A clean and responsive UI built with Next.js and TailwindCSS for task management and calendar visualization.

## Tech Stack

- **Frontend**: Next.js, TailwindCSS
- **Backend**: Python (FastAPI), Hugging Face Transformers, Google API Client
- **Database**: MongoDB
- **Deployment**: Docker

## Implementation Steps

1. **Setup & Basics**: Initialize the Electron app, Next.js frontend, and FastAPI backend.
2. **NLP Pipeline**: Implement natural language processing to extract structured tasks from user input.
3. **Google Calendar Integration**: Set up Google Calendar API for event creation and management.
4. **Frontend Integration**: Connect the frontend with the backend to display tasks and sync with Google Calendar.
5. **Demo Ready Features**: Enhance the application with bilingual support, CSV export, and push notifications.

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository.
2. Navigate to the `electron`, `frontend`, and `backend` directories and install the necessary dependencies.
3. Set up the MongoDB database and Google Calendar API credentials.
4. Run the application using the provided scripts.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.