import React from 'react';
import { format } from 'date-fns';

function TaskList({ tasks, onDelete, onToggleStatus, onEdit }) {
  // Helper to get priority badge class
  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Format date in a readable format
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  // Check if a task is overdue
  const isOverdue = (dueDate, completed) => {
    if (completed) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const taskDueDate = new Date(dueDate);
    taskDueDate.setHours(0, 0, 0, 0);
    
    return taskDueDate < today;
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div 
          key={task.id}
          className={`border rounded-lg shadow-sm p-4 transition-all ${
            task.completed 
              ? 'bg-gray-50 border-gray-200' 
              : isOverdue(task.dueDate, task.completed)
                ? 'bg-red-50 border-red-200' 
                : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="pt-0.5">
                <input 
                  type="checkbox" 
                  checked={task.completed} 
                  onChange={() => onToggleStatus(task.id)}
                  className="h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                />
              </div>
              <div className="flex-1">
                <h3 className={`text-lg font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className={`mt-1 text-sm ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                    {task.description}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getPriorityBadgeClass(task.priority)}`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                  </span>
                  
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    isOverdue(task.dueDate, task.completed) 
                      ? 'bg-red-100 text-red-800 border border-red-200' 
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}>
                    {isOverdue(task.dueDate, task.completed) ? 'Overdue: ' : 'Due: '}
                    {formatDate(task.dueDate)}
                  </span>
                  
                  {task.completed && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                      Completed
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(task)}
                className="text-primary-600 hover:text-primary-800 p-1"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                </svg>
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this task?')) {
                    onDelete(task.id);
                  }
                }}
                className="text-red-600 hover:text-red-800 p-1"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskList;