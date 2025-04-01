import "./Services.css";

export default function Services() {
  return (
    <section className="adoption-process">
      <div className="process-title">
        <h2>Veterinary Services</h2>
        <p>Professional care for your furry family members</p>
      </div>

      <div className="steps">
        <div className="step">
          <img src="/Generalhealth.png" alt="General Health Checkup" />
          <h3>General Health Checkup</h3>
          <p>Regular health monitoring and preventive care for your pets</p>
        </div>

        <div className="step">
          <img src="/Vaccination.png" alt="Vaccination" />
          <h3>Vaccination</h3>
          <p>Keep your pet protected and healthy with regular vaccinations</p>
        </div>

        <div className="step">
          <img src="/Dentalcare.png" alt="Dental Treatment" />
          <h3>Dental care</h3>
          <p>Strong teeth, strong bond care for your pet's smile!"</p>
        </div>
      </div>

      <button className="apply-btn">Book Appointment</button>
    </section>
  );
}
