import { Phone, MapPin } from 'lucide-react';
import './Rescue.css';

export default function Rescue({ showButton = true }) {
  return (
    <section className="rescue-portal">
      <h2 style={{ textAlign: "center", marginBottom: "3rem" }}>
        Rescue Portal
      </h2>
      <div className="rescue-content">
        <div className="emergency-contacts">
          <h3>Emergency Contacts</h3>
          <div className="contact-item">
            <Phone size={20} />
            <span>01-9893244</span>
          </div>
          <div className="contact-item">
            <MapPin size={20} />
            <span>Gapali-6, Bhadrapur, Nepal</span>
          </div>
          {showButton && (
            <button className="report-btn">Report Emergency</button>
          )}
        </div>

        <div className="instructions">
          <h3>What to do if you find an injured stray Dog</h3>
          <ol>
            <li>Ensure your and the dog's safety first</li>
            <li>Take a picture if possible</li>
            <li>Pin the location through map</li>
            <li>Report the dog through our rescue portal</li>
          </ol>
        </div>
      </div>
    </section>
  );
}