import React, { useState, useEffect  } from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../styles/Search.css';

function Search() {
  const [query, setQuery] = useState('');
  const location = useLocation();
  
  const users = [
    { username: 'John', avatar: 'https://i.pravatar.cc/150?img=3', fullName: 'John Doe' },
    { username: 'JaneSmith', avatar: 'https://i.pravatar.cc/150?img=4', fullName: 'Jane Smith' },
    { username: 'Sam', avatar: 'https://i.pravatar.cc/150?img=5', fullName: 'Sam Watson' },
    { username: 'JamesBond', avatar: 'https://i.pravatar.cc/150?img=6', fullName: 'James Bond' },
  ];

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query');
    setQuery(query || '');
  }, [location]);

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search for users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      
      <div className="search-results">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div key={user.username} className="search-item">
              <Link to={`/profile/${user.username}`}>
                <img src={user.avatar} alt={user.username} className="search-avatar" />
                <span>{user.fullName}</span>
              </Link>
            </div>
          ))
        ) : (
          <p>No users found</p>
        )}
      </div>
    </div>
  );
}

export default Search;
