import React from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Profile.css';

function Profile() {
  const { username } = useParams();

  const users = {
    John: {
      avatar: 'https://i.pravatar.cc/150?img=3',
      bio: 'Photographer & Nature Lover 🌿',
      fullName: 'John Doe',
      posts: 2,
      followers: 1200,
      following: 340
    },
    Sam: {
      avatar: 'https://i.pravatar.cc/150?img=5',
      bio: 'Travel Enthusiast ✈️',
      fullName: 'Sam Watson',
      posts: 1,
      followers: 100,
      following: 200
    }
  };
  const user = users[username];

  const samplePosts = [
    {
      id: 1,
      username: 'John',
      userAvatar: 'https://i.pravatar.cc/150?img=3',
      image: 'https://images.unsplash.com/photo-1741290606668-c367b34d3d4a?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      caption: 'Beautiful day in nature! 🌿 #nature #photography',
      likes: 124
    },
    {
      id: 2,
      username: 'Sam',
      userAvatar: 'https://i.pravatar.cc/150?img=5',
      image: 'https://images.fineartamerica.com/images-medium-large-5/new-york-city-lights-and-skyline-at-photography-by-steve-kelley-aka-mudpig.jpg',
      caption: 'City lights and urban vibes 🌆 #cityscape #urban',
      likes: 89
    },
    {
      id: 3,
      username: 'John',
      userAvatar: 'https://i.pravatar.cc/150?img=3',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      caption: 'Another adventure! #nature #photography',
      likes: 203
      }
  ];
  
  const userPosts = samplePosts.filter(post => post.username === username);

  if (!user) {
    return <div>User not found</div>;
  }
  
  return (
    <div className="profile-container">
      <div className="profile-header">
        <img className="profile-avatar" src={user.avatar} alt={user.username} />
        <div className="profile-info">
          <h2>{user.username}</h2>
          <p>{user.bio}</p>
          <div className="profile-stats">
            <span><strong>{user.posts}</strong> posts</span>
            <span><strong>{user.followers}</strong> followers</span>
            <span><strong>{user.following}</strong> following</span>
          </div>
        </div>
      </div>
      <div className="profile-posts">
        {userPosts.map(post => (
          <div key={post.id} className="profile-post">
            <img src={post.image} alt={post.caption} />
            <p>{post.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;


