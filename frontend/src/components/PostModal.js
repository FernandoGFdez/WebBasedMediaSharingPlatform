import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import {
  Favorite as FavoriteIcon,
} from '@mui/icons-material';
import '../styles/PostModal.css';

function PostModal({ post, onClose }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState(null);
  const [postUser, setPostUser] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getSession();
  }, []);

  useEffect(() => {
    const fetchPostUser = async () => {
      if (post.user_id) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', post.user_id)
          .single();
        setPostUser(data);
      }
    };
    fetchPostUser();
  }, [post.user_id]);

  useEffect(() => {
    const fetchLikesAndComments = async () => {
      // Fetch likes count
      const { data: likes } = await supabase
        .from('likes')
        .select('*')
        .eq('post_id', post.id);
      
      setLikesCount(likes?.length || 0);

      // Check if current user liked the post
      if (user) {
        const { data: userLike } = await supabase
          .from('likes')
          .select('id')
          .eq('post_id', post.id)
          .eq('user_id', user.id)
          .single();
        setIsLiked(!!userLike);
      }

      // Fetch comments
      const { data: commentsData } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:profiles (username, avatar_url)
        `)
        .eq('post_id', post.id)
        .order('created_at', { ascending: true });
      
      setComments(commentsData || []);
    };

    fetchLikesAndComments();
  }, [post.id, user]);

  const handleLike = async () => {
    if (!user) return;

    if (isLiked) {
      await supabase
        .from('likes')
        .delete()
        .eq('post_id', post.id)
        .eq('user_id', user.id);
      setLikesCount(prev => prev - 1);
    } else {
      await supabase
        .from('likes')
        .insert([{ post_id: post.id, user_id: user.id }]);
      setLikesCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    const { data: comment } = await supabase
      .from('comments')
      .insert([{
        post_id: post.id,
        user_id: user.id,
        content: newComment.trim()
      }])
      .select(`
        *,
        profiles:profiles (username, avatar_url)
      `)
      .single();

    if (comment) {
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  const defaultAvatar = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg';

  return (
    <div className="post-modal-overlay" onClick={onClose}>
      <button className="post-modal-close" onClick={onClose}>×</button>
      <div className="post-modal-content" onClick={e => e.stopPropagation()}>
        <div className="post-modal-left">
          <img src={post.image_url} alt={post.caption} />
        </div>
        <div className="post-modal-right">
          <div className="post-modal-header">
            <img 
              src={postUser?.avatar_url || defaultAvatar} 
              alt={postUser?.username} 
              className="post-modal-avatar"
            />
            <span className="post-modal-username">{postUser?.username}</span>
          </div>
          
          <div className="post-modal-comments">
            {/* Caption */}
            {post.caption && (
              <div className="post-modal-comment">
                <img 
                  src={postUser?.avatar_url || defaultAvatar} 
                  alt={postUser?.username}
                  className="comment-avatar"
                />
                <div className="comment-content">
                  <span className="comment-username">{postUser?.username}</span>
                  <span className="comment-text">{post.caption}</span>
                </div>
              </div>
            )}

            {/* Comments */}
            {comments.map(comment => (
              <div key={comment.id} className="post-modal-comment">
                <img 
                  src={comment.profiles?.avatar_url || defaultAvatar} 
                  alt={comment.profiles?.username}
                  className="comment-avatar"
                />
                <div className="comment-content">
                  <span className="comment-username">{comment.profiles?.username}</span>
                  <span className="comment-text">{comment.content}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="post-modal-actions">
            <div className="post-modal-buttons">
              <button 
                className={`action-button ${isLiked ? 'liked' : ''}`}
                onClick={handleLike}
              >
                <FavoriteIcon />
              </button>
            </div>
            <div className="post-modal-likes">
              {likesCount} likes
            </div>
            
            <form onSubmit={handleComment} className="post-modal-comment-form">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button 
                type="submit"
                disabled={!newComment.trim()}
              >
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostModal; 