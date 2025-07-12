import React from 'react';
import FilterDropdown from './FilterDropdown';
import './Filters.css';

const Filters = ({ 
  sortBy, 
  setSortBy, 
  filterBy, 
  setFilterBy, 
  selectedTags, 
  setSelectedTags,
  searchQuery,
  setSearchQuery 
}) => {
  const sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Oldest', value: 'oldest' },
    { label: 'Most Votes', value: 'votes' },
    { label: 'Most Answers', value: 'answers' },
    { label: 'Recent Activity', value: 'activity' }
  ];

  const filterOptions = [
    { label: 'All Questions', value: 'all' },
    { label: 'Unanswered', value: 'unanswered' },
    { label: 'Answered', value: 'answered' },
    { label: 'No Accepted Answer', value: 'no_accepted' },
    { label: 'Has Accepted Answer', value: 'has_accepted' }
  ];

  const tagOptions = [
    'JavaScript', 'Python', 'React', 'CSS', 'HTML', 'Node.js', 
    'Django', 'Flask', 'SQL', 'TypeScript', 'MongoDB', 'Express',
    'Vue', 'Angular', 'PHP', 'Java', 'C++', 'C#', 'Go', 'Rust'
  ];

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearAllFilters = () => {
    setSortBy('newest');
    setFilterBy('all');
    setSelectedTags([]);
    setSearchQuery('');
  };

  return (
    <div className="filters-container">
      <div className="filters-row">
        <div className="filters-left">
          <FilterDropdown
            label="Sort by"
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            className="sort-filter"
          />
          
          <FilterDropdown
            label="Filter"
            options={filterOptions}
            value={filterBy}
            onChange={setFilterBy}
            className="status-filter"
          />

          <div className="search-container">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        <div className="filters-right">
          {(sortBy !== 'newest' || filterBy !== 'all' || selectedTags.length > 0 || searchQuery) && (
            <button onClick={clearAllFilters} className="clear-filters-btn">
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Tags Section */}
      <div className="tags-section">
        <h4 className="tags-title">Filter by Tags:</h4>
        <div className="tags-container">
          {tagOptions.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`tag-filter ${selectedTags.includes(tag) ? 'active' : ''}`}
            >
              {tag}
              {selectedTags.includes(tag) && <span className="tag-remove">×</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedTags.length > 0 || searchQuery || filterBy !== 'all') && (
        <div className="active-filters">
          <span className="active-filters-label">Active filters:</span>
          {searchQuery && (
            <span className="active-filter">
              Search: "{searchQuery}"
              <button onClick={() => setSearchQuery('')} className="remove-filter">×</button>
            </span>
          )}
          {filterBy !== 'all' && (
            <span className="active-filter">
              Status: {filterOptions.find(f => f.value === filterBy)?.label}
              <button onClick={() => setFilterBy('all')} className="remove-filter">×</button>
            </span>
          )}
          {selectedTags.map(tag => (
            <span key={tag} className="active-filter">
              {tag}
              <button onClick={() => handleTagToggle(tag)} className="remove-filter">×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Filters;
