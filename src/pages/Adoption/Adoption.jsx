import React, { useState, useEffect } from "react";
import { X, Heart, Calendar } from "lucide-react";
import AxiosInstance from "../../components/AxiosInstance";
import "./Adoption.css";
import AdoptionComponent from "../../components/Adoption/Adoption";

const TermsAndConditions = ({ dog, onClose, onSubmit }) => {
  const [agreed, setAgreed] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [adoptionReason, setAdoptionReason] = useState(""); // New state for adoption reason

  const handleSubmit = () => {
    const isoDate = new Date(selectedDate).toISOString();
    onSubmit({
      agreed,
      selectedDate: isoDate,
      adoptionReason, // Include adoption reason in submission
    });
  };

  return (
    <div className="terms-overlay">
      <div className="terms-modal">
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="terms-content">
          <h2>Adoption Terms & Conditions</h2>
          <h3>Terms for Adopting {dog.name}</h3>

          <p className="terms-intro">
            Please read and agree to the following terms and conditions to
            proceed with the adoption request.
          </p>

          <div className="terms-list">
            <div className="term-item">
              <span className="checkmark">✓</span>
              <p>The adopter must be at least 18 years old.</p>
            </div>
            <div className="term-item">
              <span className="checkmark">✓</span>
              <p>
                The adopter agrees to provide a safe, secure, and pet-friendly
                home environment for the dog.
              </p>
            </div>
            <div className="term-item">
              <span className="checkmark">✓</span>
              <p>
                The adopter commits to caring for the dog for its lifetime,
                ensuring its well-being, safety, and happiness.
              </p>
            </div>
            <div className="term-item">
              <span className="checkmark">✓</span>
              <p>
                The adopter is responsible for providing appropriate food, clean
                water, and shelter at all times.
              </p>
            </div>
            <div className="term-item">
              <span className="checkmark">✓</span>
              <p>The adopter agrees to provide regular veterinary care.</p>
            </div>
            <div className="term-item">
              <span className="checkmark">✓</span>
              <p>
                The dog must not be used for breeding, illegal activities, or
                any form of inhumane practice, such as dog fighting.
              </p>
            </div>
            <div className="term-item">
              <span className="checkmark">✓</span>
              <p>
                The organization reserves the right to conduct follow-up visits
                to ensure the dog's welfare.
              </p>
            </div>
          </div>

          {/* New Adoption Reason Section */}
          <div className="adoption-reason">
            <h3>Why do you want to adopt {dog.name}?</h3>
            <textarea
              value={adoptionReason}
              onChange={(e) => setAdoptionReason(e.target.value)}
              placeholder="Please explain why you want to adopt this dog..."
              required
            />
          </div>

          <div className="pickup-time">
            <h3>Select Pickup Time</h3>
            <div className="calendar-wrapper">
              <Calendar className="calendar-icon" size={20} />
              <input
                type="datetime-local"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
          </div>

          <div className="agreement-checkbox">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <label htmlFor="agree">
              I have read, understood, and agree to all the terms and conditions
              listed above. I confirm that I meet all the requirements for
              adopting {dog.name}.
            </label>
          </div>

          <div className="terms-buttons">
            <button className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button
              className={`submit-button ${
                !agreed || !selectedDate || !adoptionReason ? "disabled" : ""
              }`}
              onClick={handleSubmit}
              disabled={!agreed || !selectedDate || !adoptionReason}
            >
              Submit Adoption Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DogProfile = ({ dog, onClose }) => {
  const [showTerms, setShowTerms] = useState(false);

  const handleAdoptSubmit = async (data) => {
    try {
      const response = await AxiosInstance.post("/adoption-requests/", {
        dog: dog.id,
        pickup_date: data.selectedDate,
        adoption_reason: data.adoptionReason, // Include adoption reason in the request
      });

      if (response.status === 201) {
        alert("Adoption request submitted successfully!");
        setShowTerms(false);
        onClose();
        // Refresh dog list
        const updatedDogs = await AxiosInstance.get("/Adoption/");
        setAvailableDogs(updatedDogs.data);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || "Submission failed. Please try again.";
      alert(errorMessage);
    }
  };

  return (
    <div className="profile-overlay">
      <div className="profile-modal">
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="profile-content">
          <div className="profile-image">
            <img
              src={dog.image}
              alt={dog.name}
              onError={(e) => {
                e.target.src = "/placeholder-dog.jpg";
              }}
            />
          </div>

          <div className="profile-details">
            <h2>{dog.name}</h2>
            <section>
              <h3>Rescue Story</h3>
              <p>{dog.rescue_story || "No rescue story available"}</p>
            </section>
            <section>
              <h3>Behavior & Personality</h3>
              <p>{dog.behavior || "No behavior information available"}</p>
            </section>

            <button
              className="adopt-button"
              onClick={() => setShowTerms(true)}
              disabled={dog.has_pending_request}
            >
              <Heart className="heart-icon" />
              {dog.has_pending_request
                ? "Booked"
                : `Request to Adopt ${dog.name}`}
            </button>
          </div>
        </div>
      </div>

      {showTerms && (
        <TermsAndConditions
          dog={dog}
          onClose={() => setShowTerms(false)}
          onSubmit={handleAdoptSubmit}
        />
      )}
    </div>
  );
};

const Adoption = () => {
  const [availableDogs, setAvailableDogs] = useState([]);
  const [selectedDog, setSelectedDog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDogs = async () => {
    try {
      const response = await AxiosInstance.get("/Adoption/");
      setAvailableDogs(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load dogs. Please try again later.");
      console.error("Error fetching dogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDogs();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-dogs">Loading available dogs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center" }}>
      <AdoptionComponent showButton={false} />
      <section className="available-dogs">
        <h2>Dogs Available for Adoption</h2>
        {availableDogs.length === 0 ? (
          <div className="no-dogs">
            No dogs currently available for adoption
          </div>
        ) : (
          <div className="dogs-grid">
            {availableDogs.map((dog) => (
              <div key={dog.id} className="dog-card">
                <div className="dog-image">
                  <img
                    src={dog.image}
                    alt={dog.name}
                    onError={(e) => {
                      e.target.src = "/placeholder-dog.jpg";
                    }}
                  />
                </div>
                <h3>{dog.name}</h3>
                <button
                  onClick={() => setSelectedDog(dog)}
                  className="meet-btn"
                  disabled={dog.has_pending_request}
                >
                  {dog.has_pending_request ? "Booked" : "Meet"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {selectedDog && (
        <DogProfile dog={selectedDog} onClose={() => setSelectedDog(null)} />
      )}

      <section className="mission">
        <div className="mission-content">
          <h2>Our Mission</h2>
          <p>
            At Vet for Your Pet, we're committed to giving every stray dog a
            chance at a better life. Our team works tirelessly to rescue, heal,
            and care for dogs in need, ensuring they're ready to find loving,
            forever homes. Every dog deserves safety, love, and a family to call
            their own.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Adoption;
