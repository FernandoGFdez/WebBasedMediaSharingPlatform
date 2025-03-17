import React, { useState } from "react";
import { Link } from "react-router-dom";

const Search = () => {
  const [query, setQuery] = useState("");

  // Dummy user data (Replace with API data later)
  const users = [
    { username: "johndoe", name: "John Doe", avatar: "https://via.placeholder.com/50" },
    { username: "janedoe", name: "Jane Doe", avatar: "https://via.placeholder.com/50" },
    { username: "alexsmith", name: "Alex Smith", avatar: "https://via.placeholder.com/50" },
  ];

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(query.toLowerCase()) ||
    user.username.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Search Users</h2>
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by username..."
        className="w-full p-2 border rounded-md"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Search Results */}
      <div className="mt-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <Link
              key={user.username}
              to={`/profile/${user.username}`}
              className="flex items-center space-x-4 p-2 border-b hover:bg-gray-100"
            >
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-gray-600">@{user.username}</p>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500 mt-4">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default Search;
