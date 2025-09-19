import React, { useState } from 'react';

function TaskForm({ onSubmit, initialValues = {}, isEditing = false, onCancel = () => {} }) {
  const [task, setTask] = useState({
    title: initialValues.title || '',
    description: initialValues.description || '',
    dueDate: initialValues.dueDate || '',
    priority: initialValues.priority || 'medium'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prevTask => ({ ...prevTask, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate fields
    if (!task.title.trim()) {
      alert('Please enter a task title');
      return;
    }
    if (!task.dueDate) {
      alert('Please select a due date');
      return;
    }

    onSubmit({
      ...task,
      id: initialValues.id, // Will be undefined for new tasks
      completed: initialValues.completed || false
    });

    // Reset form if not editing
    if (!isEditing) {
      setTask({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="label">Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={task.title}
          onChange={handleChange}
          className="input py-2 px-3 shadow-sm"
          placeholder="What needs to be done?"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="label">Description</label>
        <textarea
          id="description"
          name="description"
          value={task.description}
          onChange={handleChange}
          rows="3"
          className="input py-2 px-3 shadow-sm"
          placeholder="Add details about your task"
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="dueDate" className="label">Due Date *</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={task.dueDate}
            onChange={handleChange}
            className="input py-2 px-3 shadow-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="priority" className="label">Priority</label>
          <select
            id="priority"
            name="priority"
            value={task.priority}
            onChange={handleChange}
            className="input py-2 px-3 shadow-sm"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-3">
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn-primary"
        >
          {isEditing ? 'Update Task' : 'Add Task'}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;