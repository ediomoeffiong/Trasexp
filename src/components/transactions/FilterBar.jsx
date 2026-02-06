import React, { useState, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';

const FilterBar = ({ onFilterChange, activeFiltersCount }) => {
    const [filters, setFilters] = useState({
        keyword: '',
        type: 'all',
        category: 'all',
        dateFrom: '',
        dateTo: ''
    });

    const [searchInput, setSearchInput] = useState('');

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setFilters(prev => ({ ...prev, keyword: searchInput }));
        }, 300);

        return () => clearTimeout(timer);
    }, [searchInput]);

    // Notify parent component when filters change
    useEffect(() => {
        onFilterChange(filters);
    }, [filters, onFilterChange]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setSearchInput('');
        setFilters({
            keyword: '',
            type: 'all',
            category: 'all',
            dateFrom: '',
            dateTo: ''
        });
    };

    const categories = [
        { value: 'all', label: 'All Categories' },
        { value: 'FOOD', label: 'Food' },
        { value: 'TRANSPORT', label: 'Transport' },
        { value: 'ENTERTAINMENT', label: 'Entertainment' },
        { value: 'UTILITIES', label: 'Utilities' },
        { value: 'HEALTHCARE', label: 'Healthcare' },
        { value: 'SHOPPING', label: 'Shopping' },
        { value: 'EDUCATION', label: 'Education' },
        { value: 'OTHER', label: 'Other' }
    ];

    return (
        <div className="filter-bar card">
            <div className="filter-bar-header">
                <div className="flex items-center gap-2">
                    <Filter size={20} className="text-primary" />
                    <h3 className="font-bold text-lg">Filters</h3>
                    {activeFiltersCount > 0 && (
                        <span className="filter-badge">{activeFiltersCount}</span>
                    )}
                </div>
                {activeFiltersCount > 0 && (
                    <button
                        onClick={clearFilters}
                        className="btn-clear-filters"
                        aria-label="Clear all filters"
                    >
                        <X size={16} />
                        Clear All
                    </button>
                )}
            </div>

            <div className="filter-bar-content">
                {/* Search Input */}
                <div className="filter-group filter-search">
                    <label className="filter-label">Search</label>
                    <div className="search-input-wrapper">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by title..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="search-input"
                        />
                        {searchInput && (
                            <button
                                onClick={() => setSearchInput('')}
                                className="search-clear"
                                aria-label="Clear search"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Type Filter */}
                <div className="filter-group">
                    <label className="filter-label" htmlFor="type-filter">Type</label>
                    <select
                        id="type-filter"
                        value={filters.type}
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Types</option>
                        <option value="INCOME">Income</option>
                        <option value="EXPENSE">Expense</option>
                    </select>
                </div>

                {/* Category Filter */}
                <div className="filter-group">
                    <label className="filter-label" htmlFor="category-filter">Category</label>
                    <select
                        id="category-filter"
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="filter-select"
                    >
                        {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date Range Filters */}
                <div className="filter-group">
                    <label className="filter-label" htmlFor="date-from">From Date</label>
                    <input
                        id="date-from"
                        type="date"
                        value={filters.dateFrom}
                        onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                        className="filter-date-input"
                    />
                </div>

                <div className="filter-group">
                    <label className="filter-label" htmlFor="date-to">To Date</label>
                    <input
                        id="date-to"
                        type="date"
                        value={filters.dateTo}
                        onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                        className="filter-date-input"
                    />
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
