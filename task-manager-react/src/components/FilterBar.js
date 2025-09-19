import React from 'react';

function FilterBar({ filter, setFilter }) {
  const handleFilterChange = (type, value) => {
    setFilter(prev => ({ ...prev, [type]: value }));
  };

  return (
    <div className="mt-4 sm:mt-0 space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
      <div className="flex items-center space-x-2">
        <label htmlFor="priority-filter" className="text-sm text-gray-600">
          Priority:
        </label>
        <select
          id="priority-filter"
          value={filter.priority}
          onChange={(e) => handleFilterChange('priority', e.target.value)}
          className="text-sm border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="all">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <label htmlFor="status-filter" className="text-sm text-gray-600">
          Status:
        </label>
        <select
          id="status-filter"
          value={filter.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="text-sm border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <label htmlFor="date-filter" className="text-sm text-gray-600">
          Due Date:
        </label>
        <select
          id="date-filter"
          value={filter.dateRange}
          onChange={(e) => handleFilterChange('dateRange', e.target.value)}
          className="text-sm border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="all">All</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>
    </div>
  );
}

export default FilterBar;