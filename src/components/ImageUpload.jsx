import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css';

//previously rane onimageupload
export default function ImageUpload() {
  const [preview, setPreview] = useState(null); //preview photo state
  const [image, setconfirmedImage] = useState(false); //cstate to confirm image upload
  const navigate = useNavigate(); // Hook to navigate to results page

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setconfirmedImage(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmImage = () => {
    setconfirmedImage(true);
  };

  const handleSearch = () => {
      navigate('/results', { state: { image: preview } });
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

    {preview && !image && (<>
    <img src={preview} alt="Preview" className="image-preview" />
    <button onClick={handleConfirmImage} className="upload-button">Confirm Image</button>
    </>
    )}
    {image && (
      <>
        <img src={preview} alt="Confirmed" className="image-preview" />
        <button className="search-button" onClick={handleSearch}>
        Search </button>
      </>
    )}
    </div>
  );
}
