import React, { useState, useRef, useEffect } from 'react';
import './TagSelector.css';

const TagSelector = ({ selectedTags = [], onTagsChange, placeholder = "Select tags..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [inputValue, setInputValue] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Predefined tags - you can expand this list
  const availableTags = [
    'React', 'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust',
    'TypeScript', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel', 'Rails',
    'Vue.js', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js', 'Gatsby', 'GraphQL', 'REST',
    'MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'Redis', 'Docker', 'Kubernetes', 'AWS',
    'Azure', 'GCP', 'Firebase', 'Heroku', 'Vercel', 'Netlify', 'Git', 'GitHub', 'GitLab',
    'CI/CD', 'Testing', 'Jest', 'Cypress', 'Selenium', 'Webpack', 'Babel', 'ESLint',
    'Prettier', 'Tailwind', 'Bootstrap', 'Material-UI', 'Ant Design', 'CSS', 'HTML',
    'SASS', 'LESS', 'Webpack', 'Vite', 'Parcel', 'npm', 'yarn', 'pnpm', 'Linux', 'Windows',
    'macOS', 'Ubuntu', 'CentOS', 'Debian', 'Alpine', 'Nginx', 'Apache', 'IIS', 'JWT',
    'OAuth', 'OpenID', 'SAML', 'LDAP', 'Active Directory', 'SSO', 'MFA', '2FA', 'HTTPS',
    'SSL', 'TLS', 'API', 'Microservices', 'Monolith', 'Serverless', 'Lambda', 'Functions',
    'Event-Driven', 'Message Queues', 'RabbitMQ', 'Apache Kafka', 'Redis Pub/Sub', 'WebSockets',
    'Socket.io', 'SignalR', 'gRPC', 'Protocol Buffers', 'JSON', 'XML', 'YAML', 'TOML',
    'Markdown', 'LaTeX', 'MathJax', 'KaTeX', 'Chart.js', 'D3.js', 'Three.js', 'WebGL',
    'Canvas', 'SVG', 'PWA', 'Service Workers', 'IndexedDB', 'LocalStorage', 'SessionStorage',
    'Cookies', 'CORS', 'CSP', 'XSS', 'CSRF', 'SQL Injection', 'Rate Limiting', 'Caching',
    'CDN', 'Load Balancing', 'Auto Scaling', 'Monitoring', 'Logging', 'Analytics', 'SEO',
    'Accessibility', 'WCAG', 'ARIA', 'Semantic HTML', 'Progressive Enhancement', 'Graceful Degradation'
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredTags = availableTags.filter(tag =>
    tag.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedTags.includes(tag)
  );

  const handleTagSelect = (tag) => {
    if (!selectedTags.includes(tag)) {
      onTagsChange([...selectedTags, tag]);
    }
    setSearchTerm('');
    setInputValue('');
    setIsOpen(false);
  };

  const handleTagRemove = (tagToRemove) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setSearchTerm(value);
    setIsOpen(true);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (!selectedTags.includes(newTag) && !availableTags.includes(newTag)) {
        onTagsChange([...selectedTags, newTag]);
        setInputValue('');
        setSearchTerm('');
      }
    } else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
      handleTagRemove(selectedTags[selectedTags.length - 1]);
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  return (
    <div className="tag-selector" ref={dropdownRef}>
      <div className="tag-input-container">
        {selectedTags.map((tag, index) => (
          <span key={index} className="selected-tag">
            {tag}
            <button
              type="button"
              onClick={() => handleTagRemove(tag)}
              className="remove-tag"
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onFocus={handleInputFocus}
          placeholder={selectedTags.length === 0 ? placeholder : "Add more tags..."}
          className="tag-input"
        />
      </div>
      
      {isOpen && (
        <div className="tag-dropdown">
          {filteredTags.length > 0 ? (
            <div className="tag-suggestions">
              {filteredTags.slice(0, 10).map((tag, index) => (
                <div
                  key={index}
                  className="tag-suggestion"
                  onClick={() => handleTagSelect(tag)}
                >
                  {tag}
                </div>
              ))}
            </div>
          ) : searchTerm && (
            <div className="no-suggestions">
              No tags found. Press Enter to add "{searchTerm}" as a new tag.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TagSelector;
