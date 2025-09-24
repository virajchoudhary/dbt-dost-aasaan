import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher = ({ className = "" }: LanguageSwitcherProps) => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    const newLang = language === 'hi' ? 'en' : 'hi';
    setLanguage(newLang);
    
    // Update document language
    document.documentElement.lang = newLang;
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className={`flex items-center space-x-2 ${className}`}
      title={language === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}
    >
      <Globe className="w-4 h-4" />
      <span className="font-semibold">
        {language === 'hi' ? 'EN' : 'हिं'}
      </span>
    </Button>
  );
};