import './Contact.css';

export default function Contact() {
  return (
    <section className="contact">
      <h2>Contact Us</h2>
      <p className="contact-subtitle">We're here to help and answer any questions</p>

      <div className="contact-grid">
        <div className="contact-card">
          <div className="contact-image">
            <img src="/phone.png" alt="Phone" />
          </div>
          <h3>Phone</h3>
          <p>01-9612344</p>
        </div>

        <div className="contact-card">
          <div className="contact-image">
            <img src="/mail.png" alt="Email" />
          </div>
          <h3>Email</h3>
          <p>info.vetforpet@gmail.com</p>
        </div>

        <div className="contact-card">
          <div className="contact-image">
            <img src="/map.png" alt="Address" />
          </div>
          <h3>Address</h3>
          <p>Gapali-6, Bhadrapur, Nepal</p>
        </div>

        <div className="contact-card">
          <div className="contact-image">
            <img src="/clock.png" alt="Open Hours" />
          </div>
          <h3>Open Hours</h3>
          <p>Sun-Sat: 10AM-6PM</p>
        </div>
      </div>
    </section>
  );
}
