import React, { useEffect, useState } from 'react';
import Post from './Post';
import { supabase } from '../supabaseClient';
import '../styles/Feed.css';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get the current logged-in user
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      let query = supabase
        .from('posts')
        .select('id, image_url, caption, created_at, user_id, profiles(username, avatar_url)')
        .order('created_at', { ascending: false });
      if (user) {
        query = query.neq('user_id', user.id);
      }
      const { data, error } = await query;
      if (!error && data) {
        console.log('Fetched posts:', data);
        setPosts(data);
      } else {
        console.error('Error fetching posts:', error);
        setPosts([]);
      }
      setLoading(false);
    };
    fetchPosts();
  }, [user]);

  return (
    <div className="feed-container">
      {loading ? (
        <p>Loading feed...</p>
      ) : posts.length === 0 ? (
        <p>No posts yet. Be the first to upload!</p>
      ) : (
        posts.map(post => (
          <Post
            key={post.id}
            username={post.profiles?.username || 'Unknown'}
            userAvatar={post.profiles?.avatar_url || 'https://i.pravatar.cc/150?img=1'}
            image={post.image_url}
            caption={post.caption}
            likes={post.likes || 0}
            postId={post.id}
          />
        ))
      )}
    </div>
  );
}

export default Feed; 