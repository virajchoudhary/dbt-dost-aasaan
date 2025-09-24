import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher = ({ className = "" }: LanguageSwitcherProps) => {
  const [currentLang, setCurrentLang] = useState<'hi' | 'en'>('hi');

  const toggleLanguage = () => {
    const newLang = currentLang === 'hi' ? 'en' : 'hi';
    setCurrentLang(newLang);
    
    // In a real implementation, this would update the entire app's language
    // For now, we'll just show a visual feedback
    document.documentElement.lang = newLang;
    
    // You could dispatch a language change event here
    const event = new CustomEvent('languageChange', { detail: { language: newLang } });
    window.dispatchEvent(event);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className={`flex items-center space-x-2 ${className}`}
      title={currentLang === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}
    >
      <Globe className="w-4 h-4" />
      <span className="font-semibold">
        {currentLang === 'hi' ? 'EN' : 'हिं'}
      </span>
    </Button>
  );
};