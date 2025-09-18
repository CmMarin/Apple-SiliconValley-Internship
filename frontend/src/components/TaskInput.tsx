import React, { useState } from 'react';

const TaskInput: React.FC<{ onAddTask: (task: string) => void }> = ({ onAddTask }) => {
    const [taskInput, setTaskInput] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTaskInput(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (taskInput.trim()) {
            onAddTask(taskInput);
            setTaskInput('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
            <input
                type="text"
                value={taskInput}
                onChange={handleInputChange}
                placeholder="Enter your task here..."
                className="border p-2 rounded"
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                Add Task
            </button>
        </form>
    );
};

export default TaskInput;