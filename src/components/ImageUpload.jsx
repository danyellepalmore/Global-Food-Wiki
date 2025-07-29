import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css';

export default function ImageUpload() {
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file); // Save the file for uploading
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setConfirmed(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmImage = () => {
    setConfirmed(true);
  };

  const handleSearch = async () => {
    if (!imageFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const res = await fetch('http://localhost:5000/api/recognize', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Image recognition failed.');
      const data = await res.json();
      const recognizedDish = data.name;
      navigate(`/results?name=${encodeURIComponent(recognizedDish)}`);
    } catch (err) {
      alert('Recognition failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="image-upload centered-content">
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

      {preview && !confirmed && (
        <>
          <img src={preview} alt="Preview" className="image-preview" />
          <button onClick={handleConfirmImage} className="upload-button">Confirm Image</button>
        </>
      )}

      {confirmed && (
        <>
          <img src={preview} alt="Confirmed" className="image-preview" />
          <button onClick={handleSearch} className="search-button" disabled={loading}>
            {loading ? 'Identifying...' : 'Search'}
          </button>
        </>
      )}
    </div>
  );
}
