import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import MentorSpotlight from "@/components/MentorSpotlight";
import Domains from "@/components/Domains";
import Team from "@/components/Team";
import HomeGallery from "@/components/HomeGallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <About />
      <MentorSpotlight />
      <Domains />
      <Team />
      <HomeGallery />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
