import React from 'react';
import { Link } from 'react-router-dom';

const SearchResults = ({ users, query }) => {
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="search-results">
      <h2>Search Results for "{query}"</h2>
      {filteredUsers.length > 0 ? (
        <ul>
          {filteredUsers.map(user => (
            <li key={user.username}>
              <Link to={`/profile/${user.username}`}>
                <img src={user.avatar} alt={user.username} width={50} height={50} />
                <span>{user.username}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
};

export default SearchResults;
