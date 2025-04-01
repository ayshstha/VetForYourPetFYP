import React from "react";
import {
  Heart,
  Users,
  Award,
  PawPrint,
  Calendar,
  ClipboardCheck,
  Bath,
  AmbulanceIcon as FirstAid,
  Utensils,
  Lightbulb,
  Phone,
  Mail,
  MapPin,
  ArrowUp,
  Star,
} from "lucide-react";
import "./Blog.css";

const Blog = () => {
  return (
    <div style={{ marginTop: "100px", textAlign: "center" }}>
      <div className="main-content">
        <section className="mission" id="mission">
          <div className="section-background"></div>
          <h1 className="title-glow">
            Transforming Lives of Street Animals in Nepal
          </h1>
          <div className="mission-content">
            <p className="mission-text">
              The condition of street animals in Nepal has become increasingly
              critical, with many suffering from illness, injuries, and
              unhealthy living conditions. Our platform aims to bridge the gap
              between these animals in need and those who want to help, making
              rescue and adoption processes more accessible and efficient.
            </p>
          </div>
        </section>

        <section className="about-us" id="about">
          <h2 className="section-title">Who We Are</h2>
          <div className="about-content">
            <div className="about-text">
              <p className="about-intro">
                As one of Nepal's few internationally trained veterinarians, Dr.
                Pranav Raj Joshi has established "Vet for Your Pet" as a leading
                force in animal welfare services.
              </p>
              <div className="about-images">
                <div className="about-image main-image">
                  <img
                    src="/blogwhoarewe.jpg?height=400&width=600"
                    alt="Dr. Pranav Raj Joshi with rescued dogs"
                  />
                </div>
                <div className="about-image-grid">
                  <div className="about-image">
                    <img
                      src="/blogwhoarewe2.jpg?height=200&width=300"
                      alt="Our state-of-the-art clinic"
                    />
                  </div>
                  <div className="about-image">
                    <img
                      src="/blogwhoarewe3.jpg?height=200&width=300"
                      alt="Our team in action"
                    />
                  </div>
                </div>
              </div>
              <div className="about-details">
                <p>
                  Operating two state-of-the-art clinics in Kathmandu and
                  Bhaktapur, Dr. Joshi has pioneered innovative approaches to
                  animal care, including a groundbreaking method for vaccinating
                  hard-to-catch stray dogs using specially designed blow darts.
                </p>
                <p>
                  Despite resource constraints and minimal government funding,
                  Dr. Joshi's dedication has sparked a cultural transformation
                  in Nepal's approach to street dog care.
                </p>
                <p>
                  Our team consists of passionate veterinarians, animal welfare
                  specialists, and volunteers who work tirelessly to improve the
                  lives of street animals. We believe in the power of community
                  engagement and education to create lasting change.
                </p>
                <p>
                  Through our efforts, we've not only rescued and treated
                  thousands of animals but also raised awareness about
                  responsible pet ownership and the importance of animal welfare
                  in society.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="location" id="location">
          <h2 className="section-title">Where Are We Located?</h2>
          <div className="location-container">
            <div className="location-details">
              <h3>Contact Us</h3>
              <p>
                <strong>Phone:</strong> 01-9893244
              </p>
              <p>
                <strong>Email:</strong> info@pawfinder.com
              </p>
              <p>
                <strong>Address:</strong> Gapali-6, Bhadrapur, Nepal
              </p>
            </div>
            <div className="location-map">
              <iframe
                title="Vet for Your Pet Location"
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3533.6623039870165!2d85.4245952!3d27.6659179!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1aa647a21f4f%3A0x3e7f525049cc9eb4!2sVet%20for%20Your%20Pet%20-%20the%20Animals%E2%80%99%20Clinic!5e0!3m2!1sen!2snp!4v1737965287085!5m2!1sen!2snp"
                width="100%"
                height="250"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </section>
        
        <section className="services" id="services">
          <h2 className="section-title">Our Services</h2>
          <div className="services-grid">
            {[
              {
                icon: Calendar,
                title: "Checkup Appointments",
                image:
                  "https://images.unsplash.com/photo-1576201836106-db1758fd1c97",
                items: [
                  "Flexible scheduling for clinic or home visits",
                  "Comprehensive health checkups",
                  "Vaccinations and dental care",
                  "Pregnancy and skin checkups",
                  "Detailed pet history tracking",
                ],
              },
              {
                icon: Heart,
                title: "Rescue Services",
                image:
                  "https://images.unsplash.com/photo-1450778869180-41d0601e046e",
                items: [
                  "Quick response to rescue requests",
                  "Photo-based identification system",
                  "Precise location mapping",
                  "Detailed condition reporting",
                  "Emergency response coordination",
                ],
              },
              {
                icon: ClipboardCheck,
                title: "Adoption Program",
                image:
                  "https://images.unsplash.com/photo-1601758228041-f3b2795255f1",
                items: [
                  "Detailed dog profiles",
                  "Adoption criteria verification",
                  "Location suitability check",
                  "Financial responsibility assessment",
                  "Time commitment evaluation",
                ],
              },
            ].map((service, index) => (
              <div key={index} className="service-card">
                <service.icon className="service-icon" />
                <h3>{service.title}</h3>
                <div className="service-image">
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                  />
                </div>
                <ul>
                  {service.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="care-guide" id="care">
          <h2 className="section-title">Essential Dog Care Guide</h2>
          <div className="care-grid">
            {[
              {
                icon: Bath,
                title: "Daily Care Essentials",
                image:
                  "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7",
                items: [
                  "Regular grooming and bathing",
                  "Dental hygiene maintenance",
                  "Exercise and playtime",
                  "Proper nutrition and feeding schedule",
                  "Regular health check-ups",
                ],
              },
              {
                icon: Utensils,
                title: "Nutrition Guidelines",
                image:
                  "https://images.unsplash.com/photo-1585846888147-3fe14c130048",
                items: [
                  "Age-appropriate food selection",
                  "Proper portion control",
                  "Regular feeding schedule",
                  "Fresh water availability",
                  "Safe treats and supplements",
                ],
              },

              {
                icon: FirstAid,
                title: "Health Monitoring",
                image:
                  "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def",
                items: [
                  "Regular veterinary check-ups",
                  "Vaccination schedule",
                  "Parasite prevention",
                  "Emergency care awareness",
                  "Behavioral health monitoring",
                ],
              },
            ].map((care, index) => (
              <div key={index} className="care-card">
                <care.icon className="care-icon" />
                <h3>{care.title}</h3>
                <div className="care-image">
                  <img
                    src={care.image || "/placeholder.svg"}
                    alt={care.title}
                  />
                </div>
                <ul>
                  {care.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="fun-facts" id="facts">
          <h2 className="section-title">Did You Know?</h2>
          <div className="facts-grid">
            {[
              {
                icon: Lightbulb,
                title: "Dog's Nose Print",
                content:
                  "Just like human fingerprints, each dog's nose print is unique! No two dogs have the same nose print pattern.",
              },
              {
                icon: Lightbulb,
                title: "Hearing Ability",
                content:
                  "Dogs can hear sounds at frequencies up to 65,000 Hz, while humans can only hear up to 20,000 Hz.",
              },
              {
                icon: Lightbulb,
                title: "Sense of Smell",
                content:
                  "A dog's sense of smell is up to 100,000 times stronger than humans! They have up to 300 million olfactory receptors.",
              },
              {
                icon: Lightbulb,
                title: "Dog Care Tips",
                content: [
                  "Regular exercise is crucial for mental and physical health",
                  "Dogs need social interaction and mental stimulation",
                  "Consistent grooming helps prevent skin issues",
                  "Regular vet check-ups prevent health problems",
                ],
              },
            ].map((fact, index) => (
              <div key={index} className="fact-card">
                <fact.icon className="fact-icon" />
                <h3>{fact.title}</h3>
                {Array.isArray(fact.content) ? (
                  <ul>
                    {fact.content.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{fact.content}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Blog;
