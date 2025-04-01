import { useState, useEffect } from "react";
import AxiosInstance from "../AxiosInstance";
import "./Testimonial.css";

export default function Testimonial() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await AxiosInstance.get("/feedback/?featured=true");
        setTestimonials(response.data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  if (loading) return <div className="loading">Loading testimonials...</div>;

  return (
    <section className="testimonial">
      <div className="testimonial-title">
        <h2>What Our Customers Say</h2>
        <p>Real experiences from our pet parents</p>
      </div>

      <div className="testimonial-grid">
        {testimonials.map((testimonial) => (
          <div className="testimonial-card" key={testimonial.id}>
            <div className="testimonial-image">
              <img
                src={testimonial.user.profile_picture || "/default-avatar.png"}
                alt={testimonial.user.full_name}
                onError={(e) => {
                  e.target.src = "/default-avatar.png";
                }}
              />
            </div>
            <div className="testimonial-content">
              <h3>{testimonial.user.full_name || "Anonymous User"}</h3>
              <p className="testimonial-text">{testimonial.message}</p>
              <p className="testimonial-date">
                {new Date(testimonial.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
