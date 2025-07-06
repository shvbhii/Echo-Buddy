
import React from 'react';

const FILTERS = [
  { id: 'none', label: 'Normal', color: 'bg-blue-500', hover: 'hover:bg-blue-600' },
  { id: 'high', label: 'High Pitch', color: 'bg-yellow-500', hover: 'hover:bg-yellow-600' },
  { id: 'low', label: 'Low Pitch', color: 'bg-purple-500', hover: 'hover:bg-purple-600' },
  { id: 'robot', label: 'Robot', color: 'bg-gray-500', hover: 'hover:bg-gray-600' },
];

const FilterControls = ({ activeFilter, onFilterChange, isDisabled }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {FILTERS.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          disabled={isDisabled}
          className={`
            px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-md transition-all duration-200
            ${activeFilter === filter.id ? `${filter.color} ring-2 ring-offset-2 ring-offset-slate-900 ring-white` : 'bg-slate-700 hover:bg-slate-600'}
            ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FilterControls;