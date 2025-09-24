import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Send, X, Bot, User } from "lucide-react";
import { AudioButton } from "./AudioButton";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface KnowledgeBase {
  [key: string]: {
    keywords: string[];
    responses: string[];
  };
}

const chatbotKnowledgeBase: KnowledgeBase = {
  dbt: {
    keywords: ["dbt", "direct benefit transfer", "benefit transfer", "subsidy", "scholarship payment", "डीबीटी", "सब्सिडी"],
    responses: [
      "Direct Benefit Transfer (DBT) एक सरकारी initiative है जो subsidies और benefits को सीधे beneficiaries के bank accounts में transfer करती है। यह intermediaries को eliminate करती है।",
      "DBT के लिए आपका Aadhaar आपके bank account से linked होना चाहिए। यह ensure करता है कि benefits सही recipient तक delay या corruption के बिना पहुंचें।",
      "DBT का use विभिन्न schemes में होता है जैसे scholarships, LPG subsidies, MGNREGA payments, और pension transfers।"
    ]
  },
  aadhaar: {
    keywords: ["aadhaar", "aadhar", "uid", "biometric", "12 digit", "uidai", "आधार", "यूआईडी"],
    responses: [
      "Aadhaar एक 12-digit unique identification number है जो UIDAI द्वारा issue किया जाता है। यह Indian residents के लिए identity और address का proof serve करता है।",
      "Aadhaar को bank accounts से link करना KYC compliance में help करता है और government schemes से direct benefit transfers को enable करता है।",
      "आप अपना Aadhaar linking status UIDAI website पर जाकर 'Bank Seeding Status' feature का use करके check कर सकते हैं।"
    ]
  },
  nsp: {
    keywords: ["nsp", "national scholarship portal", "scholarship", "student aid", "education", "छात्रवृत्ति", "स्कॉलरशिप"],
    responses: [
      "National Scholarship Portal (NSP) students के लिए एक one-stop solution है विभिन्न government scholarships के लिए apply करने के लिए।",
      "NSP से scholarship money receive करने के लिए, आपका bank account DBT-enabled और Aadhaar-linked होना चाहिए।",
      "NSP central government, state governments, और UGC की scholarships को cover करता है different categories के students के लिए।"
    ]
  },
  linking: {
    keywords: ["link", "connect", "seeding", "bank account", "how to link", "लिंक", "जोड़ना", "सीडिंग"],
    responses: [
      "Aadhaar को bank account से link करने के लिए: 1) अपनी bank branch जाएं, 2) Aadhaar linking form भरें, 3) Aadhaar card और account details submit करें, 4) confirmation SMS का wait करें।",
      "Bank seeding का मतलब है आपके Aadhaar-linked account को NPCI mapper में register करना ताकि DBT payments आप तक पहुंच सकें।",
      "आप myaadhaar.uidai.gov.in पर जाकर 'Bank Seeding Status' check करके देख सकते हैं कि आपका account linked है या नहीं।"
    ]
  },
  eligibility: {
    keywords: ["eligible", "qualify", "criteria", "requirements", "who can apply", "पात्रता", "योग्यता"],
    responses: [
      "अधिकतर government schemes including NSP scholarships के लिए आपको चाहिए: 1) Valid Aadhaar card, 2) Aadhaar-linked bank account, 3) DBT-enabled account status।",
      "Scholarship eligibility scheme के अनुसार vary करती है - NSP portal पर income criteria, educational qualifications, और category requirements check करें।",
      "SC/ST/OBC/Minority communities के students के लिए अक्सर specific scholarship schemes होती हैं relaxed criteria के साथ।"
    ]
  },
  problems: {
    keywords: ["problem", "issue", "error", "not working", "failed", "rejected", "समस्या", "परेशानी", "गलती"],
    responses: [
      "Common issues: Aadhaar bank account से linked नहीं है, bank account DBT-enabled नहीं है, application में incorrect details हैं।",
      "अगर scholarship credit नहीं हुई: 1) DBT status check करें, 2) Aadhaar linking verify करें, 3) Nodal officer से contact करें, 4) Bank details update करें अगर change हुई हैं।",
      "NSP portal की technical issues के लिए helpline contact करें या अपने institution के scholarship coordinator से बात करें।"
    ]
  }
};

const defaultMessage = "मैं केवल Aadhaar और DBT related questions में help कर सकता हूं। कृपया DBT, Aadhaar linking, NSP scholarships, या bank seeding के बारे में पूछें। अन्य queries के लिए relevant government helpline contact करें।";

export const ChatbotSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "नमस्ते! मैं आपका DBT Dost हूं। मैं Aadhaar और DBT के बारे में आपकी help कर सकता हूं। कुछ भी पूछें!",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check each knowledge base category
    for (const [category, data] of Object.entries(chatbotKnowledgeBase)) {
      for (const keyword of data.keywords) {
        if (lowerMessage.includes(keyword)) {
          const randomIndex = Math.floor(Math.random() * data.responses.length);
          return data.responses[randomIndex];
        }
      }
    }
    
    // Check for common greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || 
        lowerMessage.includes('नमस्ते') || lowerMessage.includes('हैलो')) {
      return "नमस्ते! मैं आपकी Aadhaar और DBT related questions में help कर सकता हूं। DBT, Aadhaar linking, NSP scholarships, या bank account seeding के बारे में पूछें।";
    }
    
    // Check for thanks
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks') || 
        lowerMessage.includes('धन्यवाद') || lowerMessage.includes('शुक्रिया')) {
      return "आपका स्वागत है! Aadhaar और DBT systems के बारे में और भी questions पूछ सकते हैं।";
    }
    
    return defaultMessage;
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="w-16 h-16 rounded-full shadow-glow hover:shadow-strong transition-all duration-300 animate-bounce-gentle"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[32rem] z-40 animate-slide-up">
          <Card className="h-full shadow-strong border-2">
            <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
              <CardTitle className="flex items-center space-x-3">
                <Bot className="w-6 h-6" />
                <div>
                  <div className="text-lg">DBT Dost</div>
                  <div className="text-sm opacity-90">आपका सहायक / Your Helper</div>
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex flex-col h-full p-0">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`chatbot-message ${message.sender} max-w-[80%]`}>
                      <div className="flex items-start space-x-2">
                        {message.sender === 'bot' && (
                          <Bot className="w-4 h-4 mt-1 flex-shrink-0 text-primary" />
                        )}
                        {message.sender === 'user' && (
                          <User className="w-4 h-4 mt-1 flex-shrink-0 text-primary-foreground" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed">{message.text}</p>
                          {message.sender === 'bot' && (
                            <AudioButton text={message.text} className="mt-1 w-6 h-6" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="chatbot-message bot">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4 text-primary" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse animation-delay-200"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse animation-delay-400"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="अपना सवाल पूछें... / Ask your question..."
                    className="flex-1"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    size="sm"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  DBT, Aadhaar, NSP के बारे में पूछें
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};