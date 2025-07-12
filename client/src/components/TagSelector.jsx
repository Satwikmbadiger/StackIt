// Pre-defined tag selector stub
import React from 'react';

const tags = ['JavaScript', 'Python', 'React', 'CSS', 'Node.js'];

const TagSelector = ({ selectedTags, onChange }) => (
  <div className="tag-selector">
    {tags.map(tag => (
      <label key={tag}>
        <input
          type="checkbox"
          value={tag}
          checked={selectedTags.includes(tag)}
          onChange={e => {
            if (e.target.checked) {
              onChange([...selectedTags, tag]);
            } else {
              onChange(selectedTags.filter(t => t !== tag));
            }
          }}
        />
        {tag}
      </label>
    ))}
  </div>
);

export default TagSelector;
