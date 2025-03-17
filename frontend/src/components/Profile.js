import React from "react";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { username } = useParams();

  // Dummy user data (Replace with API data later)
  const user = {
    name: "John Doe",
    bio: "Photographer | Traveler | Coder",
    avatar: "https://via.placeholder.com/150",
    posts: [
      "https://via.placeholder.com/200",
      "https://via.placeholder.com/200",
      "https://via.placeholder.com/200",
      "https://via.placeholder.com/200",
    ],
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Profile Header */}
      <div className="flex items-center space-x-4">
        <img src={user.avatar} alt="Profile" className="w-20 h-20 rounded-full" />
        <div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-gray-600">@{username}</p>
          <p className="text-gray-700">{user.bio}</p>
        </div>
      </div>

      {/* Posts Grid */}
      <h3 className="mt-6 text-lg font-semibold">Posts</h3>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {user.posts.map((post, index) => (
          <img key={index} src={post} alt="Post" className="w-full h-auto rounded-md" />
        ))}
      </div>
    </div>
  );
};

export default Profile;
