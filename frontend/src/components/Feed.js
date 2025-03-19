import React from 'react';
import Post from './Post';
import '../styles/Feed.css';

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
    image: 'https://images.fineartamerica.com/images-medium-large-5/new-york-city-lights-and-skyline-at-photography-by-steve-kelley-aka-mudpig.jpg',
    caption: 'City lights and urban vibes 🌆 #cityscape #urban',
    likes: 89
  },
  {
    id: 3,
    username: 'John',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    caption: 'Another adventure! #nature #photography',
    likes: 203
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