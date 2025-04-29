import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; 
import {
  Favorite as FavoriteIcon,
  ChatBubbleOutline as CommentIcon,
} from '@mui/icons-material';
import CommentsModal from './CommentsModal';
import '../styles/Post.css';

function Post({ username, userAvatar, image, caption, postId }) {
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);
    };
    fetchUser();
  }, []);

  // Fetch likes count
  useEffect(() => {
    const fetchLikesCount = async () => {
      const { data, error } = await supabase
        .from('likes')
        .select('*')
        .eq('post_id', postId);

      if (error) {
        console.error('Error fetching likes count:', error.message);
      } else {
        console.log('Fetched likes:', data);
        setLikesCount(data.length); // number of likes
      }
    };

    fetchLikesCount();
  }, [postId]);

  // Check if the user already liked this post
  useEffect(() => {
    const checkIfLiked = async () => {
      if (!userId) return;

      const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .maybeSingle();  // ✅ safer

      if (error) {
        console.error('Error checking like:', error.message);
      }

      setIsLiked(!!data); // true if like exists
    };

    checkIfLiked();
  }, [userId, postId]);

  const handleLike = async () => {
    if (!userId) {
      console.error('No user ID');
      return;
    }

    if (isLiked) {
      // Unlike
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error unliking post:', error.message);
      } else {
        setIsLiked(false);
        setLikesCount((prev) => prev - 1);
      }
    } else {
      // Like
      const { error } = await supabase
        .from('likes')
        .insert([{ post_id: postId, user_id: userId }]);

      if (error) {
        console.error('Error liking post:', error.message);
      } else {
        setIsLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    }
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
        {likesCount} likes
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
