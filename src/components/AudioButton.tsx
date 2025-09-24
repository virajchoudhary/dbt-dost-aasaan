import { Volume2 } from "lucide-react";
import { useState } from "react";

interface AudioButtonProps {
  text: string;
  className?: string;
}

export const AudioButton = ({ text, className = "" }: AudioButtonProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN'; // Default to Hindi
      utterance.rate = 0.8;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Sorry, your browser does not support text-to-speech.');
    }
  };

  return (
    <button
      onClick={handleSpeak}
      className={`audio-button ${isPlaying ? 'bg-primary/30' : ''} ${className}`}
      title="सुनें / Listen"
      aria-label={isPlaying ? "Stop audio" : "Play audio"}
    >
      <Volume2 className={`w-4 h-4 ${isPlaying ? 'text-primary' : 'text-primary/70'}`} />
    </button>
  );
};