import React, { useState } from "react";
import AxiosInstance from "../../components/AxiosInstance"; // Ensure this path is correct
import "./Footer.css";

export default function Footer() {
  const [message, setMessage] = useState(""); // State for feedback message
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState(""); // State for error messages
  const [success, setSuccess] = useState(""); // State for success messages
  const isAuthenticated = !!localStorage.getItem("Token"); // Check if user is authenticated

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validate feedback message
    if (!message.trim()) {
      setError("Feedback cannot be empty.");
      return;
    }

    setLoading(true); // Start loading
    setError(""); // Clear previous errors
    setSuccess(""); // Clear previous success messages

    try {
      // Send feedback to the backend
      const response = await AxiosInstance.post("feedback/", { message });

      if (response.status === 201) {
        setSuccess("Thank you for your feedback!"); // Show success message
        setMessage(""); // Clear the feedback input
        // Clear success message after 5 seconds
        setTimeout(() => setSuccess(""), 5000);
      }
    } catch (err) {
      // Handle errors
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to submit feedback. Please try again later.";
      setError(errorMessage);
      // Clear error message after 5 seconds
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* About Us Section */}
        <div className="footer-section">
          <h4>About Us</h4>
          <p>
            We at Vet for Your Pet are committed to providing your pets with
            compassionate and knowledgeable care.
          </p>
          <div className="social-links">
            <a
              href="https://www.facebook.com/vetforyourpet"
              className="social-icon"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/facebook.png"
                alt="Facebook"
                className="social-image"
              />
            </a>
            <a
              href="https://www.instagram.com/vetforyourpet/"
              className="social-icon"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/instagram.png"
                alt="Instagram"
                className="social-image"
              />
            </a>
            <a
              href="https://www.youtube.com/@vetforyourpet"
              className="social-icon"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/youtube.png" alt="YouTube" className="social-image" />
            </a>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li>
              <a href="/adopt">Adoption Process</a>
            </li>
            <li>
              <a href="/services">Our Services</a>
            </li>
            <li>
              <a href="/rescue">Rescue Portal</a>
            </li>
            <li>
              <a href="/blog">Blog</a>
            </li>
          </ul>
        </div>

        {/* Contact Us Section */}
        <div className="footer-section">
          <h4>Contact Us</h4>
          <ul className="footer-links">
            <li>Phone: 01-9893244</li>
            <li>Email: info@pawfinder.com</li>
            <li>Address: Gapali-6, Bhadrapur, Nepal</li>
          </ul>
        </div>

        {/* Feedback Section */}
        <div className="footer-section feedback-form">
          <h4>Share your feedback</h4>
          {isAuthenticated ? (
            <form onSubmit={handleSubmit}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your feedback..."
                rows={4}
                disabled={loading}
                maxLength={50} // Limit feedback to 500 characters
              />
              <small className="character-count">
                {message.length}/500 characters
              </small>
              <button
                type="submit"
                className="submit-feedback"
                disabled={loading || !message.trim()}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
              {error && <div className="alert error-message">⚠️ {error}</div>}
              {success && (
                <div className="alert success-message">✅ {success}</div>
              )}
            </form>
          ) : (
            <div className="auth-message">
              🔒 Please <a href="/login">log in</a> to submit feedback.
            </div>
          )}
        </div>
      </div>

      {/* Copyright Section */}
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Vet for Your Pet. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
