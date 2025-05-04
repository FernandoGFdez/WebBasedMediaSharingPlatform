import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EmailConfirmed.css';

function EmailConfirmed() {
  const navigate = useNavigate();

  return (
    <div className="email-confirmed-container">
      <div className="email-confirmed-content">
        <h2>Email Confirmed!</h2>
        <p>Your email has been successfully verified. You can now log in to your account.</p>
        <button 
          className="login-button"
          onClick={() => navigate('/auth')}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}

export default EmailConfirmed; 