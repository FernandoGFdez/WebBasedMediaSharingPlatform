import React from 'react';
import Post from './Post';
import '../styles/Feed.css';

// Sample data for posts
const samplePosts = [
  {
    id: 1,
    username: 'John',
    userAvatar: '...',
    image: 'https://images.unsplash.com/photo-1741290606668-c367b34d3d4a?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    caption: 'Beautiful day in nature! 🌿 #nature #photography',
    likes: 124
  },
  {
    id: 2,
    username: 'Sam',
    userAvatar: '...',
    image: 'https://images.unsplash.com/photo-1739130524827-5fa364835c41?q=80&w=1664&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    caption: 'City lights and urban vibes 🌆 #cityscape #urban',
    likes: 89
  }
];

function Feed() {
  return (
    <div className="feed-container">
      {samplePosts.map(post => (
        <Post key={post.id} {...post} />
      ))}
    </div>
  );
}

export default Feed; 