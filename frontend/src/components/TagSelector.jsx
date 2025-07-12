import React, { useState, useEffect } from 'react';
import { tagService } from '../services/api';

const TagSelector = ({ selectedTags, onChange }) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [filteredTags, setFilteredTags] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch available tags when component mounts
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await tagService.getTags();
        setTags(response.data);
        setFilteredTags(response.data);
      } catch (err) {
        console.error('Failed to fetch tags:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTags();
  }, []);

  // Filter tags based on input
  useEffect(() => {
    if (inputValue.trim() === '') {
      setFilteredTags(tags);
    } else {
      const filtered = tags.filter(tag => 
        tag.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredTags(filtered);
    }
  }, [inputValue, tags]);

  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
  };

  // Add a tag
  const addTag = (tag) => {
    if (selectedTags.some(t => t === tag.name)) {
      return; // Don't add duplicate tags
    }
    
    onChange([...selectedTags, tag.name]);
    setInputValue('');
    setShowSuggestions(false);
  };

  // Create a new tag
  const createNewTag = () => {
    const newTagName = inputValue.trim();
    
    if (newTagName === '') return;
    
    if (selectedTags.some(t => t === newTagName)) {
      return; // Don't add duplicate tags
    }
    
    onChange([...selectedTags, newTagName]);
    setInputValue('');
    setShowSuggestions(false);
  };

  // Remove a tag
  const removeTag = (tagToRemove) => {
    onChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  // Handle key down (for enter key)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim() !== '') {
        createNewTag();
      }
    }
  };

  return (
    <div className="relative">
      {/* Selected tags */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map((tag, index) => (
          <div 
            key={index}
            className="bg-primary-100 text-primary-800 px-2 py-1 rounded-md text-sm flex items-center"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 text-primary-600 hover:text-primary-800 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      
      {/* Tag input */}
      <div className="relative">
        <input
          type="text"
          className="input"
          placeholder="Add tags (e.g., react, javascript)"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        
        {/* Tag suggestions */}
        {showSuggestions && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-2 text-center text-gray-500">Loading tags...</div>
            ) : filteredTags.length > 0 ? (
              <ul className="py-1">
                {filteredTags.map(tag => (
                  <li
                    key={tag.id}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => addTag(tag)}
                  >
                    {tag.name}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-2">
                <p className="text-gray-500">No matching tags</p>
                {inputValue.trim() !== '' && (
                  <button
                    type="button"
                    onClick={createNewTag}
                    className="mt-1 text-primary-600 hover:text-primary-800"
                  >
                    Create tag "{inputValue}"
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      {selectedTags.length === 0 && (
        <p className="mt-1 text-sm text-red-500">At least one tag is required</p>
      )}
    </div>
  );
};

export default TagSelector;
