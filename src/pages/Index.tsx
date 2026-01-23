import Navigation from "@/components/Navigation";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ChatSection from "@/components/sections/ChatSection";
import ReviewGeneratorSection from "@/components/sections/ReviewGeneratorSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/Footer";
import { Helmet, HelmetProvider } from "react-helmet-async";

const Index = () => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Areesha Abbas | Modern Web Developer & AI Solutions</title>
        <meta 
          name="description" 
          content="Portfolio of Areesha Abbas - Specialized in crafting high-performance web applications and custom AI integrations." 
        />
        <meta 
          name="keywords" 
          content="web developer, AI integration, React, TypeScript, Full Stack Developer, portfolio, automation specialist" 
        />
      </Helmet>
      
      <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
        <Navigation />
        <main>
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <ProjectsSection />
          <ChatSection />
          <ReviewGeneratorSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default Index;