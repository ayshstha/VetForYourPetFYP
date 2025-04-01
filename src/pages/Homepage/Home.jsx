import React from "react";
import Hero from "../../components/Hero/Hero";
import Adoption from "../../components/Adoption/Adoption";
import Rescue from "../../components/Rescue/Rescue";
import Services from "../../components/Services/Services";
import PetGallery from "../../components/PetGallery/PetGallery";
import Testimonial from "../../components/Testimonial/Testimonial";
import Contact from "../../components/Contact/Contact";
import Donation from "../../components/Donation/Donation";

const Home = () => {
  return (
    <div>
      <Hero />
      <Adoption />
      <Rescue />
      <Services />
      <PetGallery />
      <Testimonial />
      <Contact />
      <Donation />
    </div>
  );
};

export default Home;
