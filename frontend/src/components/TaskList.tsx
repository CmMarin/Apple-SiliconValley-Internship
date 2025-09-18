import React from 'react';

type Task = { task: string; time?: string; category?: string; deadline?: string };
interface TaskListProps { tasks?: Task[] }

const TaskList: React.FC<TaskListProps> = ({ tasks = [] }) => {
    return (
        <div className="task-list">
            <h2 className="text-xl font-bold mb-4">Task List</h2>
            <ul className="list-disc pl-5">
                {tasks.map((task, index) => (
                    <li key={index} className="mb-2">
                        <span className="font-semibold">{task.task}</span>
                        {task.time && <span className="text-gray-500"> at {task.time}</span>}
                        {task.deadline && <span className="text-gray-500"> (Deadline: {task.deadline})</span>}
                        {task.category && <span className="text-gray-500"> - {task.category}</span>}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskList;