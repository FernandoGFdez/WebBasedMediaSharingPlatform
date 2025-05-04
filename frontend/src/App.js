import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Feed from './components/Feed';
import Upload from './pages/Upload';
import Profile from './components/Profile';
import Search from './components/Search';
import Auth from './components/Auth';
import EmailConfirmed from './pages/EmailConfirmed';
import './styles/App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/search" element={<Search />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/confirmed" element={<EmailConfirmed />} />
      </Routes>
    </Router>
  );
}

export default App;
