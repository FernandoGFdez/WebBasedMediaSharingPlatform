import React from 'react';
import {
  Favorite as FavoriteIcon,
  ChatBubbleOutline as CommentIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import '../styles/Post.css';

function Post({ username, userAvatar, image, caption, likes }) {
  return (
    <div className="post">
      <div className="post-header">
        <Link to={`/profile/${username}`}>
          <img 
            className="post-avatar"
            src={userAvatar}
          />
        </Link>
        <a
          href={`/profile/${username}`}
          style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}
        >
          <span className="post-username">{username}</span>
        </a>
      </div>

      <img
        className="post-image"
        src={image}
        alt="Post content"
      />

      <div className="post-actions">
        <button className="action-button like-button">
          <FavoriteIcon />
        </button>
        <button className="action-button">
          <CommentIcon />
        </button>
      </div>

      <div className="post-likes">
        {likes} likes
      </div>

      <div className="post-caption">
        <span className="post-username-caption">{username}</span>
        {caption}
      </div>
    </div>
  );
}

export default Post; 