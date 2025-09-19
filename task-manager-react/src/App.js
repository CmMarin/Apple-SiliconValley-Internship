import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import FilterBar from './components/FilterBar';
import Header from './components/Header';

function App() {
  // Load tasks from localStorage
  const loadTasks = () => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        return JSON.parse(savedTasks);
      } catch (e) {
        console.error('Error parsing tasks from localStorage', e);
        return [];
      }
    }
    return [];
  };

  const [tasks, setTasks] = useState(loadTasks);
  const [filter, setFilter] = useState({
    priority: 'all',
    status: 'all',
    dateRange: 'all'
  });
  const [editingTask, setEditingTask] = useState(null);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Add a new task
  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTasks([...tasks, newTask]);
  };

  // Update an existing task
  const updateTask = (updatedTask) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    setEditingTask(null); // Clear editing state
  };

  // Delete a task
  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // Toggle task completion status
  const toggleTaskStatus = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  // Filter tasks based on current filter settings
  const filterTasks = () => {
    return tasks.filter(task => {
      // Filter by priority
      if (filter.priority !== 'all' && task.priority !== filter.priority) {
        return false;
      }
      
      // Filter by completion status
      if (filter.status === 'completed' && !task.completed) {
        return false;
      }
      if (filter.status === 'active' && task.completed) {
        return false;
      }
      
      // Filter by due date
      if (filter.dateRange !== 'all') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        
        if (filter.dateRange === 'today' && dueDate.getTime() !== today.getTime()) {
          return false;
        }
        
        if (filter.dateRange === 'week') {
          const weekLater = new Date(today);
          weekLater.setDate(today.getDate() + 7);
          if (dueDate < today || dueDate > weekLater) {
            return false;
          }
        }
        
        if (filter.dateRange === 'overdue') {
          if (dueDate >= today || task.completed) {
            return false;
          }
        }
      }
      
      return true;
    });
  };

  const filteredTasks = filterTasks();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-card p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Task</h2>
          <TaskForm 
            onSubmit={editingTask ? updateTask : addTask} 
            initialValues={editingTask || {}} 
            isEditing={!!editingTask}
            onCancel={() => setEditingTask(null)}
          />
        </div>
        
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="sm:flex sm:items-center sm:justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">My Tasks</h2>
            <FilterBar filter={filter} setFilter={setFilter} />
          </div>
          
          <TaskList 
            tasks={filteredTasks} 
            onDelete={deleteTask} 
            onToggleStatus={toggleTaskStatus} 
            onEdit={setEditingTask}
          />
          
          {filteredTasks.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              No tasks match your current filters.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;