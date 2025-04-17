import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, AddBox as AddBoxIcon, AccountCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/Navbar.css';

function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Listen for auth state changes
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
    // Fetch profile for logged-in user
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();
        if (!error) setProfile(data);
        else setProfile(null);
      } else {
        setProfile(null);
      }
    };
    fetchProfile();
  }, [user]);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value) {
      // Query Supabase for matching usernames
      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .ilike('username', `%${value}%`);
      if (!error && data) {
        setSearchResults(data);
      } else {
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchTerm) {
      navigate(`/profile/${searchTerm}`);
    }
  };

  const handleUserSelect = (username) => {
    setSearchTerm(username);
    navigate(`/profile/${username}`);
    setSearchResults([]); 
  };

  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('/profile/')) {
      setSearchResults([]); 
      setSearchTerm('');
    }
  }, [navigate]);

  const handleProfileClick = () => {
    if (user && profile && profile.username) {
      navigate(`/profile/${profile.username}`);
    } else {
      navigate('/auth');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-brand-link">
            MediaShare
          </Link>
        </div>

        <div className="search-container">
          <form onSubmit={handleSearch}>
            <input
              className="search-input"
              type="text"
              placeholder="Search for a username..."
              value={searchTerm}
              onChange={handleInputChange}
            />
          </form>

          {/* Display filtered results */}
          {searchTerm && searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((user) => (
                <div
                  key={user.username}
                  className="search-result-item"
                  onClick={() => handleUserSelect(user.username)}
                >
                  <img src={user.avatar_url || 'https://i.pravatar.cc/150?img=1'} alt={user.username} className="result-avatar" />
                  <span>{user.username}</span>
                </div>
              ))}
            </div>
          )}

          {/* Optionally show "No results found" */}
          {searchTerm && searchResults.length === 0 && (
            <div className="search-results">
              <div>No results found</div>
            </div>
          )}
        </div>

        <div className="navbar-actions">
          <Link to="/upload" className="icon-button">
            <AddBoxIcon />
          </Link>
          <button className="icon-button" onClick={handleProfileClick}>
            <AccountCircle />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
