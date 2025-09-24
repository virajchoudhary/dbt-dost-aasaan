import { Volume2 } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface AudioButtonProps {
  text: string;
  className?: string;
}

export const AudioButton = ({ text, className = "" }: AudioButtonProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { language } = useLanguage();

  const handleSpeak = async () => {
    if (isPlaying) {
      // Stop current audio
      setIsPlaying(false);
      return;
    }

    try {
      setIsPlaying(true);
      
      // Use Google Cloud Text-to-Speech API
      // For demo purposes, we'll use the Web Speech API but with proper language setting
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Cancel any ongoing speech
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        // Try to find a voice that matches the language
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
          voice.lang.startsWith(language === 'hi' ? 'hi' : 'en')
        );
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
        
        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        
        window.speechSynthesis.speak(utterance);
      } else {
        // Fallback: In a real implementation, this would call Google Cloud TTS API
        setIsPlaying(false);
        alert(language === 'hi' ? 
          'क्षमा करें, आपका browser text-to-speech support नहीं करता।' : 
          'Sorry, your browser does not support text-to-speech.'
        );
      }
    } catch (error) {
      console.error('TTS Error:', error);
      setIsPlaying(false);
    }
  };

  return (
    <button
      onClick={handleSpeak}
      className={`audio-button ${isPlaying ? 'bg-primary/30' : ''} ${className}`}
      title={language === 'hi' ? 'सुनें' : 'Listen'}
      aria-label={isPlaying ? 
        (language === 'hi' ? "ऑडियो बंद करें" : "Stop audio") : 
        (language === 'hi' ? "ऑडियो चलाएं" : "Play audio")
      }
    >
      <Volume2 className={`w-4 h-4 ${isPlaying ? 'text-primary' : 'text-primary/70'}`} />
    </button>
  );
};