import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AudioButton } from "./AudioButton";
import priyaImage from "@/assets/priya-character.jpg";
import heroBackground from "@/assets/hero-background.jpg";

export const HeroSection = () => {
  const scrollToStory = () => {
    document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      className="story-section bg-gradient-hero folk-pattern relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 127, 39, 0.9), rgba(255, 193, 7, 0.8)), url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight">
                अपना छात्रवृत्ति पैसा सीधे पाएं!
                <AudioButton text="अपना छात्रवृत्ति पैसा सीधे पाएं" />
              </h1>
              <h2 className="text-2xl md:text-3xl font-display font-semibold text-white/90">
                Get Your Scholarship Money Directly!
                <AudioButton text="Get Your Scholarship Money Directly!" />
              </h2>
            </div>
            
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Priya और लाखों छात्रों की तरह, आप भी DBT से अपना पैसा सुरक्षित पा सकते हैं।
              <AudioButton text="Priya और लाखों छात्रों की तरह, आप भी DBT से अपना पैसा सुरक्षित पा सकते हैं।" />
            </p>
            
            <p className="text-lg md:text-xl text-white/80">
              Like Priya and millions of students, you can also receive your money safely through DBT.
              <AudioButton text="Like Priya and millions of students, you can also receive your money safely through DBT." />
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg"
                variant="secondary"
                onClick={scrollToStory}
                className="text-lg px-8 py-4 shadow-medium hover:shadow-strong transition-all duration-300"
              >
                <Play className="w-5 h-5 mr-2" />
                कहानी शुरू करें / Start Story
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={() => document.getElementById('checker')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-lg px-8 py-4 bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                अभी जांचें / Check Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>

          {/* Right Content - Character */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="animate-story-float">
                <img
                  src={priyaImage}
                  alt="Priya - छात्रा जो DBT के बारे में सीख रही है"
                  className="w-80 h-80 object-cover rounded-full shadow-glow border-8 border-white/30"
                />
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-white/90 rounded-full p-3 shadow-medium animate-bounce-gentle">
                <div className="text-2xl">🏛️</div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white/90 rounded-full p-3 shadow-medium animate-bounce-gentle animation-delay-400">
                <div className="text-2xl">💰</div>
              </div>
              
              <div className="absolute top-1/2 -right-8 bg-white/90 rounded-full p-2 shadow-medium animate-bounce-gentle animation-delay-200">
                <div className="text-xl">📱</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-gentle">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};