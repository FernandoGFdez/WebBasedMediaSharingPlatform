import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/Profile.css';

function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();
      if (error) {
        setError('User not found');
        setProfile(null);
      } else {
        setProfile(data);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [username]);

  useEffect(() => {
    // Get the current logged-in user
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUser(session?.user || null);
    };
    getSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user || null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Fetch posts for this user
    const fetchPosts = async () => {
      if (profile && profile.id) {
        setPostsLoading(true);
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false });
        if (!error) setPosts(data);
        else setPosts([]);
        setPostsLoading(false);
      }
    };
    fetchPosts();
  }, [profile]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return <div className="profile-container">Loading...</div>;
  }
  if (error) {
    return <div className="profile-container">{error}</div>;
  }
  if (!profile) {
    return <div className="profile-container">User not found</div>;
  }

  // Only show sign out if the logged-in user is viewing their own profile
  const showSignOut = currentUser && profile && currentUser.id === profile.id;

  return (
    <div className="profile-container">
      <div className="profile-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="profile-info">
          <h2>{profile.username}</h2>
          <p>{profile.full_name}</p>
          <p>{profile.bio}</p>
        </div>
        {showSignOut && (
          <button className="submit-button" onClick={handleSignOut} style={{ marginLeft: 'auto' }}>
            Sign Out
          </button>
        )}
      </div>
      <div className="profile-posts">
        <h3>My Posts</h3>
        {postsLoading ? (
          <p>Loading posts...</p>
        ) : posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <div className="profile-posts-grid">
            {posts.map(post => (
              <div key={post.id} className="profile-post">
                <img src={post.image_url} alt={post.caption} className="profile-post-image" />
                <p className="profile-post-caption">{post.caption}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;


