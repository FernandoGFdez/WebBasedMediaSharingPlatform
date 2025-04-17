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
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

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

  // Check if current user is following this profile
  useEffect(() => {
    const checkFollowing = async () => {
      if (currentUser && profile && currentUser.id !== profile.id) {
        const { data, error } = await supabase
          .from('follows')
          .select('id')
          .eq('follower_id', currentUser.id)
          .eq('following_id', profile.id)
          .single();
        setIsFollowing(!!data && !error);
      } else {
        setIsFollowing(false);
      }
    };
    checkFollowing();
  }, [currentUser, profile]);

  // Fetch followers and following counts
  useEffect(() => {
    const fetchFollowCounts = async () => {
      if (profile && profile.id) {
        // Followers: people who follow this profile
        const { count: followers, error: followersError } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('following_id', profile.id);
        // Following: people this profile follows
        const { count: following, error: followingError } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('follower_id', profile.id);
        setFollowersCount(followersError ? 0 : followers || 0);
        setFollowingCount(followingError ? 0 : following || 0);
      } else {
        setFollowersCount(0);
        setFollowingCount(0);
      }
    };
    fetchFollowCounts();
  }, [profile]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // Avatar upload handler
  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (!file || !profile) return;
    setAvatarUploading(true);
    try {
      // 1. Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      const { data: uploadData, error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;
      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
      // 3. Update profile
      const { error: updateError } = await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', profile.id);
      if (updateError) throw updateError;
      // 4. Refresh profile
      setProfile({ ...profile, avatar_url: publicUrl });
    } catch (err) {
      alert('Failed to upload avatar: ' + (err.message || err));
    } finally {
      setAvatarUploading(false);
    }
  };

  // Follow handler
  const handleFollow = async () => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }
    setFollowLoading(true);
    try {
      const { error } = await supabase.from('follows').insert({
        follower_id: currentUser.id,
        following_id: profile.id,
      });
      if (error) throw error;
      setIsFollowing(true);
    } catch (err) {
      alert('Failed to follow: ' + (err.message || err));
    } finally {
      setFollowLoading(false);
    }
  };

  // Unfollow handler
  const handleUnfollow = async () => {
    setFollowLoading(true);
    try {
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', currentUser.id)
        .eq('following_id', profile.id);
      if (error) throw error;
      setIsFollowing(false);
    } catch (err) {
      alert('Failed to unfollow: ' + (err.message || err));
    } finally {
      setFollowLoading(false);
    }
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {/* Avatar */}
          <img
            src={profile.avatar_url || 'https://i.pravatar.cc/150?img=1'}
            alt={profile.username}
            className="profile-avatar"
            style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover' }}
          />
          <div className="profile-info">
            <h2>{profile.username}</h2>
            <div className="profile-stats" style={{ display: 'flex', gap: '24px', margin: '8px 0' }}>
              <span><b>{followersCount}</b> Followers</span>
              <span><b>{followingCount}</b> Following</span>
            </div>
            <p>{profile.full_name}</p>
            <p>{profile.bio}</p>
          </div>
        </div>
        {showSignOut && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
            <button className="submit-button" onClick={handleSignOut} style={{ marginLeft: 'auto' }}>
              Sign Out
            </button>
            <label className="submit-button" style={{ cursor: avatarUploading ? 'not-allowed' : 'pointer', opacity: avatarUploading ? 0.6 : 1 }}>
              {avatarUploading ? 'Uploading...' : (profile.avatar_url ? 'Change Avatar' : 'Upload Avatar')}
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleAvatarChange}
                disabled={avatarUploading}
              />
            </label>
          </div>
        )}
        {/* Follow/Unfollow button for other users */}
        {!showSignOut && profile && (
          <button
            className="submit-button"
            style={{ marginLeft: 16, minWidth: 120, opacity: followLoading ? 0.6 : 1 }}
            onClick={isFollowing ? handleUnfollow : handleFollow}
            disabled={followLoading}
          >
            {followLoading
              ? (isFollowing ? 'Unfollowing...' : 'Following...')
              : (isFollowing ? 'Unfollow' : 'Follow')}
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


