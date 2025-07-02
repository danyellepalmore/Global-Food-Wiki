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
  }
    const ImageUpload = ({ onUploadComplete }) => {
    const handleFileChange = (e) => {
      console.log("Image file selected: ", e.target.files[0]);
      onUploadComplete(); // Simulate upload completion
    };

  return <input type="file" onChange={handleFileChange} />;
};

  return (
    <div className="image-upload, centered-content">
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
