import React, { useState } from 'react';
import '../styles/App.css';

export default function ImageUpload() {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); // show preview
        console.log('Image uploaded:', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="image-upload">
      <h1>Upload Your Image</h1>
      <p>Upload an image of the food item you want to know more about.</p>
      <label className="upload-button">
        Upload Image
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </label>

      {preview && (
        <img src={preview} alt="Preview" className="image-preview" />
      )}
    </div>
  );
}
