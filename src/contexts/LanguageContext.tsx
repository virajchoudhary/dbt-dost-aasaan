import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'hi' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Complete translations for the entire website
const translations = {
  hi: {
    // Navigation
    'nav.story': 'कहानी',
    'nav.check': 'चेक करें',
    'nav.quiz': 'क्विज़',
    'nav.awareness': 'जागरूकता',
    
    // Hero Section
    'hero.title': 'अपना छात्रवृत्ति पैसा सीधे पाएं!',
    'hero.subtitle': 'Priya और लाखों छात्रों की तरह, आप भी DBT से अपना पैसा सुरक्षित पा सकते हैं।',
    'hero.cta.story': 'कहानी शुरू करें',
    'hero.cta.check': 'अभी जांचें',
    
    // Story Section
    'story.problem.title': 'पहले क्या होता था?',
    'story.problem.description': 'पहले छात्रवृत्ति का पैसा बीच में कई लोगों से होकर आता था। कभी-कभी पूरा पैसा नहीं मिलता था।',
    'story.solution.title': 'अब DBT से क्या होता है?',
    'story.solution.description': 'अब DBT से पैसा सीधे आपके बैंक खाते में आता है। पूरा पैसा, सही समय पर!',
    'story.government': 'सरकार',
    'story.middlemen': 'बिचौलिए',
    'story.less_money': 'कम पैसा',
    'story.student': 'छात्र',
    'story.direct': 'सीधे',
    'story.bank_account': 'आपका बैंक खाता',
    
    // Status Checker
    'checker.title': '2-Step DBT Journey',
    'checker.subtitle': 'केवल 2 कदमों में अपना DBT स्टेटस चेक करें और scholarship पोर्टल तक पहुंचें',
    'checker.step1.title': 'अपना बैंक तैयार है?',
    'checker.step1.subtitle': 'आधार नंबर डालें',
    'checker.step1.placeholder': '1234 5678 9012',
    'checker.step1.note': 'यह एक सिमुलेशन है - वास्तविक DBT चेक नहीं है',
    'checker.step1.button': 'चेक करें',
    'checker.step1.checking': 'जांच रहे हैं...',
    'checker.step1.success': 'बधाई हो! आपका बैंक DBT के लिए तैयार है!',
    'checker.step1.failure': 'आपको अपने बैंक में आधार लिंक करना होगा',
    'checker.step2.title': 'स्कॉलरशिप पोर्टल पर जाएं',
    'checker.step2.locked': 'पहले Step 1 पूरा करें',
    'checker.step2.portal': 'राष्ट्रीय छात्रवृत्ति पोर्टल',
    'checker.step2.button': 'पोर्टल पर जाएं',
    'checker.step2.note': 'scholarships.gov.in पर जाकर अपनी scholarship के लिए apply करें',
    
    // Quiz Section
    'quiz.title': 'Ravi के साथ Quiz खेलें',
    'quiz.subtitle': 'अपनी DBT knowledge को test करें!',
    'quiz.question': 'प्रश्न',
    'quiz.submit': 'जवाब दें',
    'quiz.next': 'अगला',
    'quiz.previous': 'पिछला',
    'quiz.results': 'परिणाम देखें',
    'quiz.completed': 'Quiz पूरी हो गई!',
    'quiz.score': 'में से',
    'quiz.explanation': 'व्याख्या:',
    'quiz.restart': 'फिर से try करें',
    'quiz.feedback.excellent': 'शानदार! आपको DBT और Aadhaar systems की बहुत अच्छी समझ है।',
    'quiz.feedback.good': 'अच्छा! आप basics समझते हैं। कुछ concepts को revise करें।',
    'quiz.feedback.fair': 'ठीक है। Learning materials को पढ़कर अपनी knowledge बढ़ाएं।',
    'quiz.feedback.poor': 'अभी भी सीखना है! Educational content को review करके फिर से try करें।',
    
    // Chatbot
    'chatbot.title': 'DBT Dost',
    'chatbot.subtitle': 'आपका सहायक',
    'chatbot.placeholder': 'अपना सवाल पूछें...',
    'chatbot.help': 'DBT, Aadhaar, NSP के बारे में पूछें',
    'chatbot.welcome': 'नमस्ते! मैं आपका DBT Dost हूं। मैं Aadhaar और DBT के बारे में आपकी help कर सकता हूं। कुछ भी पूछें!',
    
    // Public Awareness
    'awareness.title': 'जागरूकता फैलाएं',
    'awareness.subtitle': 'अपने समुदाय में DBT की जानकारी फैलाकर सभी को मदद करें',
    'awareness.whatsapp.title': 'WhatsApp पर Share करें',
    'awareness.whatsapp.feature1': 'Ready-made message in Hindi',
    'awareness.whatsapp.feature2': 'आसान language में समझाया गया',
    'awareness.whatsapp.feature3': 'Direct website link included',
    'awareness.whatsapp.button': 'WhatsApp पर भेजें',
    'awareness.whatsapp.note': 'अपने family, friends और community के साथ share करें',
    'awareness.poster.title': 'Notice Download करें',
    'awareness.poster.feature1': 'Gram Panchayat के लिए ready notice',
    'awareness.poster.feature2': 'Print करके notice board पर लगाएं',
    'awareness.poster.feature3': 'Hindi में तैयार किया गया',
    'awareness.poster.button': 'Notice Download करें',
    'awareness.poster.generating': 'तैयार कर रहे हैं...',
    'awareness.poster.note': 'Village community center या school में भी लगवा सकते हैं',
    'awareness.impact.title': 'आपकी मदद का असर',
    'awareness.impact.families': 'Families को जानकारी मिलेगी',
    'awareness.impact.students': 'Students की मदद होगी',
    'awareness.impact.direct': 'पैसा सीधे account में',
    
    // Footer
    'footer.about.title': 'DBT Dost के बारे में',
    'footer.about.description': 'हमारा mission है कि हर भारतीय student को DBT और scholarship की सही जानकारी मिले। यह website खासकर rural और semi-urban students के लिए बनाई गई है।',
    'footer.links.title': 'Important Links',
    'footer.help.title': 'मदद चाहिए?',
    'footer.help.note': 'यह एक educational website है। Official information के लिए government portals पर जाएं।',
    'footer.made': 'भारतीय Students के लिए प्यार से बनाया गया',
    'footer.disclaimer': 'Disclaimer: यह website educational purpose के लिए है। All official information और applications के लिए कृपया government websites पर जाएं।'
  },
  en: {
    // Navigation
    'nav.story': 'Story',
    'nav.check': 'Check',
    'nav.quiz': 'Quiz',
    'nav.awareness': 'Awareness',
    
    // Hero Section
    'hero.title': 'Get Your Scholarship Money Directly!',
    'hero.subtitle': 'Like Priya and millions of students, you can also receive your money safely through DBT.',
    'hero.cta.story': 'Start Story',
    'hero.cta.check': 'Check Now',
    
    // Story Section
    'story.problem.title': 'What Happened Before?',
    'story.problem.description': 'Earlier, scholarship money passed through many people. Sometimes students didn\'t get the full amount.',
    'story.solution.title': 'What Happens Now with DBT?',
    'story.solution.description': 'Now with DBT, money comes directly to your bank account. Full amount, on time!',
    'story.government': 'Government',
    'story.middlemen': 'Middlemen',
    'story.less_money': 'Less Money',
    'story.student': 'Student',
    'story.direct': 'Direct',
    'story.bank_account': 'Your Bank Account',
    
    // Status Checker
    'checker.title': '2-Step DBT Journey',
    'checker.subtitle': 'Check your DBT status and access scholarship portal in just 2 steps',
    'checker.step1.title': 'Is Your Bank Ready?',
    'checker.step1.subtitle': 'Enter Aadhaar Number',
    'checker.step1.placeholder': '1234 5678 9012',
    'checker.step1.note': 'This is a simulation - not actual DBT check',
    'checker.step1.button': 'Check Now',
    'checker.step1.checking': 'Checking...',
    'checker.step1.success': 'Congratulations! Your bank is ready for DBT!',
    'checker.step1.failure': 'You need to link Aadhaar to your bank account',
    'checker.step2.title': 'Visit Scholarship Portal',
    'checker.step2.locked': 'Complete Step 1 first',
    'checker.step2.portal': 'National Scholarship Portal',
    'checker.step2.button': 'Visit Portal',
    'checker.step2.note': 'Visit scholarships.gov.in to apply for your scholarship',
    
    // Quiz Section
    'quiz.title': 'Play Quiz with Ravi',
    'quiz.subtitle': 'Test your DBT knowledge!',
    'quiz.question': 'Question',
    'quiz.submit': 'Submit Answer',
    'quiz.next': 'Next',
    'quiz.previous': 'Previous',
    'quiz.results': 'View Results',
    'quiz.completed': 'Quiz Completed!',
    'quiz.score': 'out of',
    'quiz.explanation': 'Explanation:',
    'quiz.restart': 'Try Again',
    'quiz.feedback.excellent': 'Excellent! You have a great understanding of DBT and Aadhaar systems.',
    'quiz.feedback.good': 'Good job! You understand the basics. Consider reviewing some concepts.',
    'quiz.feedback.fair': 'Fair attempt. We recommend studying the learning materials for better understanding.',
    'quiz.feedback.poor': 'Keep learning! Review the educational content to better understand these important systems.',
    
    // Chatbot
    'chatbot.title': 'DBT Dost',
    'chatbot.subtitle': 'Your Helper',
    'chatbot.placeholder': 'Ask your question...',
    'chatbot.help': 'Ask about DBT, Aadhaar, NSP',
    'chatbot.welcome': 'Hello! I\'m your DBT Dost. I can help you with Aadhaar and DBT related questions. Ask me anything!',
    
    // Public Awareness
    'awareness.title': 'Spread Awareness',
    'awareness.subtitle': 'Help everyone by spreading DBT information in your community',
    'awareness.whatsapp.title': 'Share on WhatsApp',
    'awareness.whatsapp.feature1': 'Ready-made message in Hindi & English',
    'awareness.whatsapp.feature2': 'Explained in simple language',
    'awareness.whatsapp.feature3': 'Direct website link included',
    'awareness.whatsapp.button': 'Share on WhatsApp',
    'awareness.whatsapp.note': 'Share with your family, friends and community',
    'awareness.poster.title': 'Download Notice',
    'awareness.poster.feature1': 'Ready notice for Gram Panchayat',
    'awareness.poster.feature2': 'Print and put on notice board',
    'awareness.poster.feature3': 'Available in Hindi & English',
    'awareness.poster.button': 'Download Notice',
    'awareness.poster.generating': 'Generating...',
    'awareness.poster.note': 'Can also be put in village community center or school',
    'awareness.impact.title': 'Your Help\'s Impact',
    'awareness.impact.families': 'Families will get information',
    'awareness.impact.students': 'Students will be helped',
    'awareness.impact.direct': 'Money directly to account',
    
    // Footer
    'footer.about.title': 'About DBT Dost',
    'footer.about.description': 'Our mission is to ensure every Indian student gets correct information about DBT and scholarships. This website is specially created for rural and semi-urban students.',
    'footer.links.title': 'Important Links',
    'footer.help.title': 'Need Help?',
    'footer.help.note': 'This is an educational website. For official information, please visit government portals.',
    'footer.made': 'Made with love for Indian Students',
    'footer.disclaimer': 'Disclaimer: This website is for educational purposes. For all official information and applications, please visit government websites.'
  }
};

const quizTranslations = {
  hi: [
    {
      question: "DBT का मतलब क्या है?",
      options: [
        "Direct Bank Transfer",
        "Digital Banking Technology", 
        "Direct Benefit Transfer",
        "Data Base Technology"
      ],
      correct: 2,
      explanation: "DBT का मतलब है Direct Benefit Transfer - यह सरकारी लाभ सीधे लाभार्थियों के खाते में भेजने की व्यवस्था है।"
    },
    {
      question: "भारत में scholarship के लिए मुख्य पोर्टल कौन सा है?",
      options: [
        "UIDAI Portal",
        "National Scholarship Portal (NSP)",
        "PMJDY Portal", 
        "MyGov Portal"
      ],
      correct: 1,
      explanation: "National Scholarship Portal (NSP) एकमात्र platform है जहाँ students विभिन्न सरकारी scholarships के लिए apply कर सकते हैं।"
    },
    {
      question: "DBT enable करने के लिए क्या चाहिए?",
      options: [
        "केवल बैंक खाता नंबर",
        "केवल आधार नंबर",
        "आधार बैंक से linked होना चाहिए",
        "PAN card"
      ],
      correct: 2,
      explanation: "DBT के लिए आपका Aadhaar आपके bank account से linked होना जरूरी है और NPCI mapper में seeded होना चाहिए।"
    },
    {
      question: "NPCI mapper कौन maintain करता है?",
      options: [
        "UIDAI",
        "Reserve Bank of India",
        "National Payments Corporation of India",
        "State Bank of India"
      ],
      correct: 2,
      explanation: "NPCI (National Payments Corporation of India) mapper को maintain करता है जो DBT transactions को सही bank तक पहुँचाता है।"
    },
    {
      question: "DBT का मुख्य फायदा क्या है?",
      options: [
        "तेज़ processing",
        "बिचौलियों को हटाता है", 
        "कम cost",
        "बेहतर customer service"
      ],
      correct: 1,
      explanation: "DBT का सबसे बड़ा फायदा यह है कि यह middlemen को हटाकर corruption को कम करता है और पैसा सीधे beneficiary के खाते में जाता है।"
    }
  ],
  en: [
    {
      question: "What does DBT stand for?",
      options: [
        "Direct Bank Transfer",
        "Digital Banking Technology", 
        "Direct Benefit Transfer",
        "Data Base Technology"
      ],
      correct: 2,
      explanation: "DBT stands for Direct Benefit Transfer - a system to transfer government benefits directly to beneficiaries' accounts."
    },
    {
      question: "Which portal is primarily used for scholarships in India?",
      options: [
        "UIDAI Portal",
        "National Scholarship Portal (NSP)",
        "PMJDY Portal", 
        "MyGov Portal"
      ],
      correct: 1,
      explanation: "The National Scholarship Portal (NSP) is the single platform for students to apply for various government scholarships."
    },
    {
      question: "What is required to enable DBT?",
      options: [
        "Only bank account number",
        "Only Aadhaar number",
        "Aadhaar linked to bank account",
        "PAN card"
      ],
      correct: 2,
      explanation: "DBT requires your Aadhaar to be linked to your bank account and seeded in the NPCI mapper."
    },
    {
      question: "Who maintains the NPCI mapper?",
      options: [
        "UIDAI",
        "Reserve Bank of India",
        "National Payments Corporation of India",
        "State Bank of India"
      ],
      correct: 2,
      explanation: "NPCI (National Payments Corporation of India) maintains the mapper that routes DBT transactions to destination banks."
    },
    {
      question: "What is the primary advantage of DBT?",
      options: [
        "Faster processing",
        "Eliminates middlemen", 
        "Lower costs",
        "Better customer service"
      ],
      correct: 1,
      explanation: "DBT eliminates middlemen and reduces leakages by transferring benefits directly to beneficiaries' accounts."
    }
  ]
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('hi'); // Default to Hindi

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['hi']] || key;
  };

  const value = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const useQuizData = () => {
  const { language } = useLanguage();
  return quizTranslations[language];
};

export { translations, quizTranslations };