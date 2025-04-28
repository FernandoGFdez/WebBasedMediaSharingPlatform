import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Favorite as FavoriteIcon,
  ChatBubbleOutline as CommentIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import CommentsModal from './CommentsModal';
import '../styles/Post.css';

function Post({ username, userAvatar, image, caption, likes, postId }) {
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleProfileClick = () => {
    navigate(`/profile/${username}`);
  };

  return (
    <div className="post">
      <div className="post-header">
        <img 
          className="post-avatar"
          src={userAvatar}
          alt={username}
          onClick={handleProfileClick}
          style={{ cursor: 'pointer' }}
        />
        <span 
          className="post-username"
          onClick={handleProfileClick}
          style={{ cursor: 'pointer' }}
        >
          {username}
        </span>
      </div>

      <img
        className="post-image"
        src={image}
        alt="Post content"
      />

      <div className="post-actions">
        <button 
          className={`action-button ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          <FavoriteIcon />
        </button>
        <button 
          className="action-button"
          onClick={() => setShowComments(true)}
        >
          <CommentIcon />
        </button>
      </div>

      <div className="post-likes">
        {isLiked ? likes : likes} likes
      </div>

      <div className="post-caption">
        <span 
          className="post-username-caption"
          onClick={handleProfileClick}
          style={{ cursor: 'pointer' }}
        >
          {username}
        </span>
        {caption}
      </div>

      {showComments && (
        <CommentsModal
          postId={postId}
          onClose={() => setShowComments(false)}
        />
      )}
    </div>
  );
}

export default Post;