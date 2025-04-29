import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/CommentsModal.css';

function CommentsModal({ postId, onClose }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    console.log('CommentsModal mounted with postId:', postId);
    
    // Get current user
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getSession();

    // Fetch comments
    const fetchComments = async () => {
      try {
        console.log('Fetching comments for postId:', postId);
        const { data, error } = await supabase
          .from('comments')
          .select(`
            id,
            content,
            created_at,
            user_id,
            profile:profiles (
              username,
              avatar_url
            )
          `)
          .eq('post_id', postId)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching comments:', error);
          throw error;
        }
        console.log('Fetched comments:', data);
        setComments(data || []);
      } catch (err) {
        console.error('Error in fetchComments:', err);
        setError('Failed to load comments');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to comment');
      return;
    }
    if (!newComment.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      console.log('Submitting comment for postId:', postId);
      console.log('User ID:', user.id);
      console.log('Comment content:', newComment.trim());

      const { error } = await supabase
        .from('comments')
        .insert([
          {
            post_id: postId,
            user_id: user.id,
            content: newComment.trim()
          }
        ]);

      if (error) {
        console.error('Error inserting comment:', error);
        throw error;
      }
      console.log('Comment submitted successfully');

      // Refresh comments
      const { data, error: fetchError } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          created_at,
          user_id,
          profile:profiles (
            username,
            avatar_url
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (fetchError) {
        console.error('Error fetching comments after insert:', fetchError);
        throw fetchError;
      }
      console.log('Refreshed comments:', data);
      setComments(data || []);
      setNewComment('');
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Comments</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="comments-list">
          {loading ? (
            <p>Loading comments...</p>
          ) : comments.length === 0 ? (
            <p>No comments yet</p>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="comment">
                <img 
                  src={comment.profile?.avatar_url || 'https://i.pravatar.cc/150?img=1'} 
                  alt="avatar" 
                  className="comment-avatar"
                />
                <div className="comment-content">
                  <span className="comment-username">{comment.profile?.username}</span>
                  <p>{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {user && (
          <form onSubmit={handleSubmit} className="comment-form">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="comment-input"
              disabled={submitting}
            />
            <button 
              type="submit" 
              className="comment-submit"
              disabled={!newComment.trim() || submitting}
            >
              {submitting ? 'Posting...' : 'Post'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default CommentsModal; 