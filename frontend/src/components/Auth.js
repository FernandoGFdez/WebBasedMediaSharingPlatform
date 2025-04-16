import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/Auth.css';

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [bio, setBio] = useState('');
  const [full_name, setFullName] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  // Check for user session on mount
  React.useEffect(() => {
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

  // Fetch profile if user is logged in
  React.useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        setProfileLoading(true);
        setProfileError(null);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (error && error.code !== 'PGRST116') { // PGRST116: No rows found
          setProfileError(error.message);
        } else {
          setProfile(data);
        }
        setProfileLoading(false);
      } else {
        setProfile(null);
      }
    };
    fetchProfile();
  }, [user]);

  // Clear fields when toggling between sign in and sign up
  React.useEffect(() => {
    setEmail('');
    setPassword('');
    setError(null);
  }, [isSignUp]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSignUpSuccess(false);
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data && data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
          setError('This email is already registered. Please log in or use a different email.');
          setSignUpSuccess(false);
          return;
        }
        setSignUpSuccess(true);
        setTimeout(() => {
          setIsSignUp(false);
          setSignUpSuccess(false);
        }, 3000); // Show message for 3 seconds, then switch to login
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  // Handle username submission
  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError(null);
    try {
      const { error } = await supabase.from('profiles').insert([
        {
          id: user.id,
          username: username,
          full_name: full_name,
          bio: bio,
        },
      ]);
      if (error) throw error;
      setProfile({ id: user.id, username });
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  if (user && !profileLoading && !profile) {
    // Prompt for username if profile does not exist
    return (
      <div className="auth-container">
        <h2 className="auth-title">Set up your profile</h2>
        <form className="auth-form" onSubmit={handleUsernameSubmit}>
          <input
            className="auth-input"
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="auth-input"
            type="text"
            placeholder="Full Name"
            value={full_name}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            className="auth-input"
            type="text"
            placeholder="Write a bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
          />
          <button className="submit-button" type="submit" disabled={profileLoading}>
            {profileLoading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
        {profileError && <p className="auth-error">{profileError}</p>}
      </div>
    );
  }

  if (user && profile) {
    return (
      <div className="auth-container">
        <p>Signed in as {user.email}</p>
        <p>Username: {profile.username}</p>
        <button className="submit-button" onClick={handleSignOut}>Sign Out</button>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h2 className="auth-title">{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
      {signUpSuccess && (
        <div className="auth-success">Sign up successful! Please check your email to confirm your account. You will be redirected to the login form.</div>
      )}
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="auth-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="auth-input"
        />
        <button className="submit-button" type="submit" disabled={loading}>
          {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
      </form>
      <button className="switch-button" onClick={() => setIsSignUp((s) => !s)}>
        {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
      </button>
      {error && <p className="auth-error">{error}</p>}
    </div>
  );
}

export default Auth; 