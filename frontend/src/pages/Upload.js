import React, { useState } from 'react';
import '../styles/Upload.css';

function Upload() {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here we'll add the logic to send to backend later
    console.log('Submitting:', { image, caption });
  };

  return (
    <div className="upload-container">
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="image-upload">
          {preview ? (
            <img src={preview} alt="Preview" className="image-preview" />
          ) : (
            <div className="upload-placeholder">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="image-input"
              />
              <label htmlFor="image-input">Select Image</label>
            </div>
          )}
        </div>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
          className="caption-input"
        />
        <button type="submit" className="submit-button">
          Share
        </button>
      </form>
    </div>
  );
}

export default Upload; 