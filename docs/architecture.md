# Architecture Overview

## Project Structure

The project is organized into several key components, each serving a specific purpose in the overall architecture:

- **Electron App**: The desktop application that serves as the user interface for task input and management.
  - **Main Process**: Responsible for managing application lifecycle and creating windows.
  - **Renderer Process**: Handles the user interface and communicates with the main process via IPC.

- **Frontend**: Built with Next.js, this component provides a clean and responsive user interface for task input and calendar visualization.
  - **Task Input**: A component for users to enter tasks in natural language.
  - **Task List**: Displays the structured tasks extracted from user input.
  - **Calendar View**: Shows events synced with Google Calendar.

- **Backend**: Developed using FastAPI, this component processes user input, extracts tasks, and interacts with the database and Google Calendar API.
  - **NLP Module**: Utilizes Hugging Face models for natural language processing to extract structured tasks from unstructured input.
  - **Database Module**: Manages interactions with MongoDB for storing tasks.
  - **Google Calendar Integration**: Handles API calls to create and manage calendar events.

## Data Flow

1. **User Input**: The user enters a bilingual natural language task in the Electron app.
2. **API Call**: The frontend sends the raw input to the backend via API.
3. **NLP Processing**: The backend processes the input using NLP models to extract structured tasks.
4. **Data Storage**: The structured tasks are stored in MongoDB.
5. **Google Calendar Sync**: The backend creates corresponding events in Google Calendar.
6. **Frontend Update**: The frontend displays the parsed tasks and sync status with Google Calendar.

## Technology Stack

- **Frontend**: Next.js, TailwindCSS
- **Backend**: FastAPI, Hugging Face Transformers, Google API Client
- **Database**: MongoDB
- **Deployment**: Docker for containerization

## Conclusion

This architecture provides a robust framework for converting unstructured bilingual input into structured tasks, facilitating seamless integration with Google Calendar and offering a user-friendly interface for task management.