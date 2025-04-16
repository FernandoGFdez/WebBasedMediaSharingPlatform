import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/Upload.css';

function Upload() {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState(null);

  React.useEffect(() => {
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!user) {
      setError('You must be signed in to upload a post.');
      return;
    }
    if (!image) {
      setError('Please select an image to upload.');
      return;
    }
    setLoading(true);
    try {
      // 1. Upload image to Supabase Storage
      const fileExt = image.name.split('.').pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      const { data, error } = await supabase.storage.from('post-images').upload(filePath, image, { upsert: true });
      console.log(data, error);
      if (error) throw error;
      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(filePath);
      // 3. Insert post into posts table
      const { error: insertError } = await supabase
        .from('posts')
        .insert([
          {
            user_id: user.id,
            image_url: publicUrl,
            caption: caption,
          },
        ]);
      if (insertError) throw insertError;
      setSuccess(true);
      setCaption('');
      setImage(null);
      setPreview(null);
    } catch (err) {
      setError(err.message || 'Failed to upload post.');
    } finally {
      setLoading(false);
    }
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
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Uploading...' : 'Share'}
        </button>
        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">Post uploaded successfully!</p>}
      </form>
    </div>
  );
}

export default Upload; 