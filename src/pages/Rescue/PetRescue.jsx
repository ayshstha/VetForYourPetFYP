import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Heart,
  PawPrint,
  Home,
  Shield,
  X,
  Camera,
  MapPin,
  FileText,
  AlertCircle,
} from "lucide-react";
import Rescue from "../../components/Rescue/Rescue";
import AxiosInstance from "../../components/AxiosInstance";
import "./PetRescue.css";

const rescueIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const DEFAULT_COORDS = {
  lat: 27.7172,
  lng: 85.324,
};

const OpenStreetMapComponent = ({ initialLocation, onLocationSelect }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const coords = initialLocation || DEFAULT_COORDS;
    const map = L.map(mapRef.current).setView([coords.lat, coords.lng], 18);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    markerRef.current = L.marker([coords.lat, coords.lng], {
      icon: rescueIcon,
      draggable: true,
    }).addTo(map);

    markerRef.current.on("dragend", (e) => {
      const { lat, lng } = e.target.getLatLng();
      onLocationSelect({ lat, lng });
    });

    return () => map.remove();
  }, [initialLocation, onLocationSelect]);

  return (
    <div
      className="map-container"
      ref={mapRef}
      style={{ height: "400px", width: "100%", borderRadius: "8px" }}
    />
  );
};

const PetRescue = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    images: [],
    location: DEFAULT_COORDS,
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [previewImages, setPreviewImages] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(true);

  const handleOpenModal = () => setShowModal(true);

  const handleCloseModal = () => {
    setShowModal(false);
    setErrors({});
    setPreviewImages([]);
    setFormData({
      images: [],
      location: DEFAULT_COORDS,
      description: "",
    });
  };
  const handleLocationSelect = (location) => {
    setFormData((prev) => ({
      ...prev,
      location,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalFiles = files.length + formData.images.length;

    if (totalFiles > 5) {
      setErrors({ ...errors, images: "Maximum 5 images allowed." });
      return;
    }
    setErrors({ ...errors, images: "" });

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files].slice(0, 5),
    }));

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviews].slice(0, 5));
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
    setPreviewImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.images.length === 0)
      newErrors.images = "Please upload at least one image.";
    if (!formData.location.lat || !formData.location.lng)
      newErrors.location = "Please pin a location on the map.";
    if (!formData.description.trim())
      newErrors.description = "Description is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const formPayload = new FormData();
      formPayload.append("latitude", formData.location.lat);
      formPayload.append("longitude", formData.location.lng);
      formPayload.append("description", formData.description);

      formData.images.forEach((image) => {
        formPayload.append("uploaded_images", image);
      });

      await AxiosInstance.post("/rescue-requests/", formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      handleCloseModal();
      alert("Rescue request submitted successfully!");
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit request. Please try again.");
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          }));
          setLoadingLocation(false);
        },
        () => setLoadingLocation(false)
      );
    } else {
      setLoadingLocation(false);
    }
  }, []);

  return (
    <div className="rescue-container">
      <section className="rescue-intro">
        <div className="intro-content">
          <h1>Give Hope to Homeless Dogs</h1>
          <p>
            Every dog deserves a chance at happiness. Our rescue mission
            transforms lives, one paw at a time.
          </p>
          <button className="rescue-btn" onClick={handleOpenModal}>
            Rescue!!!
          </button>
        </div>
      </section>

      <Rescue showButton={false} />

      <section className="video-section">
        <h2>See Our Rescue Work</h2>
        <div className="video-container">
          <video
            src="/blogvid.mp4"
            controls
            className="local-video"
            poster="/path/to/thumbnail.jpg"
          ></video>
        </div>
      </section>

      {/* Info Section */}
      <section className="rescue-info">
        <div className="info-grid">
          <div className="info-card">
            <Heart className="info-icon" />
            <h3>Why They Need Us</h3>
            <p>
              Many dogs face abandonment, abuse, or injuries on the streets.
              Without intervention, these beautiful souls have little chance of
              survival or finding loving homes.
            </p>
          </div>
          <div className="info-card">
            <PawPrint className="info-icon" />
            <h3>Our Rescue Process</h3>
            <p>
              From emergency rescue to rehabilitation, we provide comprehensive
              care including medical treatment, behavioral training, and
              emotional support to prepare dogs for their forever homes.
            </p>
          </div>
          <div className="info-card">
            <Home className="info-icon" />
            <h3>Adoption Journey</h3>
            <p>
              We carefully match dogs with loving families, ensuring both the
              dog and adopter are set up for a successful, lifelong bond. Each
              adoption includes support and guidance.
            </p>
          </div>
          <div className="info-card">
            <Shield className="info-icon" />
            <h3>Post-Adoption Care</h3>
            <p>
              Our commitment doesn't end with adoption. We provide ongoing
              support, medical advice, and training resources to ensure a smooth
              transition into their new homes.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="impact-stats">
        <div className="stats-container">
          <div className="stat-item">
            <h3>500+</h3>
            <p>Dogs Rescued</p>
          </div>
          <div className="stat-item">
            <h3>350+</h3>
            <p>Successful Adoptions</p>
          </div>
          <div className="stat-item">
            <h3>24/7</h3>
            <p>Emergency Response</p>
          </div>
        </div>
      </section>

      {showModal && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-content">
            <button className="close-btn" onClick={handleCloseModal}>
              <X />
            </button>
            <div className="form-header">
              <Heart className="form-header-icon pulse" />
              <h2>Help Us Save a Life</h2>
              <p>Your report can make a difference in a dog's life</p>
            </div>

            <form className="rescue-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>
                  <Camera className="form-icon" /> Upload Pictures
                </label>
                <div className="image-upload-container">
                  <input
                    type="file"
                    multiple
                    onChange={handleImageChange}
                    className="image-input"
                    accept="image/*"
                  />
                  <div className="upload-placeholder">
                    <Camera size={40} />
                    <p>Drag & drop images here, or click to upload</p>
                    <span>Supported formats: JPG, PNG, GIF (Max 5MB each)</span>
                  </div>
                </div>
                {previewImages.length > 0 && (
                  <div className="image-preview-grid">
                    {previewImages.map((url, index) => (
                      <div key={index} className="preview-image">
                        <img src={url} alt={`Preview ${index + 1}`} />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {errors.images && (
                  <span className="error-message">
                    <AlertCircle size={16} /> {errors.images}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>
                  <MapPin className="form-icon" /> Location
                </label>
                {loadingLocation ? (
                  <div>Loading map...</div>
                ) : (
                  <OpenStreetMapComponent
                    initialLocation={formData.location}
                    onLocationSelect={handleLocationSelect}
                  />
                )}
                {errors.location && (
                  <span className="error-message">
                    <AlertCircle size={16} /> {errors.location}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>
                  <FileText className="form-icon" /> Description
                </label>
                <textarea
                  rows="4"
                  placeholder="Describe the dog's condition and situation"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className={errors.description ? "error" : ""}
                ></textarea>
                {errors.description && (
                  <span className="error-message">
                    <AlertCircle size={16} /> {errors.description}
                  </span>
                )}
              </div>

              <button type="submit" className="submit-btn">
                <Heart className="btn-icon" /> Submit Report
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetRescue;