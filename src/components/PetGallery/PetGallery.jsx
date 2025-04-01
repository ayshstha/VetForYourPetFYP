import "./PetGallery.css";

export default function PetGallery() {
  const galleryItems = [
    {
      image: "/petgallery1.jpg",
      description:
        "surgical intervention of pom- Ensuring the best care for our furry friends",
    },
    {
      image: "/petgallery2.jpg",
      description: "Prince Hridayendra Shah with Ace for consultation ",
    },
    {
      image: "/petgallery3.jpg",
      description: "Paras khadka with his family for their dog checkup",
    },
    {
      image: "/petgallery5.jpg",
      description: "Anil Keshary Shah with ruffus in our clinic",
    },
    {
      image: "/petgallery6.jpg",
      description: "Traveller from Spain with capo for treatment",
    },
    {
      image: "/petgallery4.jpg",
      description:
        "Small appreciation note from our customer - Making tails wag and hearts happy",
    },
  ];

  return (
    <section className="pet-gallery">
      <h2>Pet Gallery</h2>
      <p className="gallery-subtitle">Sharing some of the precious moments</p>

      <div className="gallery-grid">
        {galleryItems.map((item, index) => (
          <div key={index} className="gallery-item">
            <div className="gallery-image">
              <img src={item.image} alt={item.description} />
            </div>
            <div className="gallery-description">
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
