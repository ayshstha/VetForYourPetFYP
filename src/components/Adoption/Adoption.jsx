import "./Adoption.css";

export default function Adoption({ showButton = true }) {
  return (
    <section className="adoption-process">
      <div className="process-title">
        <h2>Adoption Process</h2>
        <p>Our simple 3-step process to help you find your perfect companion</p>
      </div>

      <div className="steps">
        <div className="step">
          <img src="/Adoptiondogicon.png" alt="Browse Dogs" />
          <h3>Browse Available Dogs</h3>
          <p>
            View our selection of loving dogs waiting for their forever home
          </p>
        </div>

        <div className="step">
          <img src="/Applicationreview.png" alt="Application Review" />
          <h3>Application Review</h3>
          <p>
            Submit your application and our team will review it within 24 hours
          </p>
        </div>

        <div className="step">
          <img src="/Welcomehome.png" alt="Application Review" />
          <h3>Welcome Home</h3>
          <p>
            Complete the adoption process and welcome your new family member
          </p>
        </div>
      </div>

      {showButton && <button className="apply-btn">Apply Now</button>}
    </section>
  );
}
