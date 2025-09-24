import { LanguageProvider } from "@/contexts/LanguageContext";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { StorySection } from "@/components/StorySection";
import { StatusChecker } from "@/components/StatusChecker";
import { QuizSection } from "@/components/QuizSection";
import { PublicAwarenessSection } from "@/components/PublicAwarenessSection";
import { ChatbotSection } from "@/components/ChatbotSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <Navigation />
        
        {/* Hero Section */}
        <HeroSection />
        
        {/* Story Section */}
        <StorySection />
        
        {/* Status Checker */}
        <StatusChecker />
        
        {/* Quiz Section */}
        <QuizSection />
        
        {/* Public Awareness */}
        <PublicAwarenessSection />
        
        {/* Floating Chatbot */}
        <ChatbotSection />
        
        {/* Footer */}
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default Index;
