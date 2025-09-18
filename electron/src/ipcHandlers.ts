// ipcHandlers.ts
import { ipcMain, IpcMainEvent } from 'electron';

// Example IPC handler for receiving task input from the renderer process
ipcMain.on('submit-task', (event: IpcMainEvent, taskData: { task: string; time?: string; category?: string; deadline?: string }) => {
    // Handle the task data received from the frontend
    console.log('Received task data:', taskData);
    // Here you would typically process the task data, 
    // such as sending it to the backend for NLP processing
});

// Example IPC handler for sending tasks back to the renderer process
ipcMain.on('get-tasks', (event: IpcMainEvent) => {
    // Fetch tasks from the database or backend
    const tasks: Array<{ task: string; time?: string; category?: string; deadline?: string }> = []; // Replace with actual task fetching logic
    event.reply('tasks-response', tasks);
});