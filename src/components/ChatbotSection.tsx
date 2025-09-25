import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Send, X, Bot, User } from "lucide-react";
import { AudioButton } from "./AudioButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher"; // If you want a second switcher inside the chatbot


interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Optional: keep local KB for future offline fallbacks or hints
interface KnowledgeBase {
  [key: string]: {
    keywords: string[];
    responses: string[];
  };
}

// Env-configurable API base (Vite/Next/Default localhost)
const API_BASE =
  // Vite
  (import.meta as any)?.env?.VITE_API_BASE ||
  // Next.js or CRA
  (typeof process !== "undefined" ? (process as any)?.env?.NEXT_PUBLIC_API_BASE : undefined) ||
  // Fallback for local dev
  "http://localhost:8000";

const API_URL = `${API_BASE}/chat`;

const defaultMessage =
  "मैं केवल Aadhaar और DBT related questions में help कर सकता हूं। कृपया DBT, Aadhaar linking, NSP scholarships, या bank seeding के बारे में पूछें। अन्य queries के लिए relevant government helpline contact करें।";

export const ChatbotSection = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { language, t } = useLanguage();

  // Track in-flight request to cancel if needed
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cleanup on unmount: abort any pending fetch
  useEffect(() => {
    setMessages(prev =>
      prev[0]?.sender === "bot"
        ? [{ ...prev[0], text: t("chatbot.welcome") }, ...prev.slice(1)]
        : [{ id: '1', text: t("chatbot.welcome"), sender: "bot", timestamp: new Date() }, ...prev]
    );
    // eslint-disable-next-line
  }, [language]);


  // 1) Make generateResponse async to call backend (with abortable fetch)
  const generateResponse = async (userMessage: string): Promise<string> => {
    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, language }),
      });
      if (!res.ok) {
        return language === "hi"
          ? "सर्वर त्रुटि. कृपया थोड़ी देर बाद पुनः प्रयास करें."
          : "Server error. Please try again later.";
      }
      const data = await res.json();
      return data.answer ?? (language === "hi"
        ? "कोई उत्तर उपलब्ध नहीं है।"
        : "No answer available.");
    } catch (e) {
      return language === "hi"
        ? "नेटवर्क त्रुटि। कृपया थोड़ी देर बाद पुनः प्रयास करें।"
        : "Network error. Please try again.";
    }
  };


  // 2) Update handleSendMessage to await the backend
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const toSend = inputMessage; // snapshot
    setInputMessage("");
    setIsTyping(true);

    const botText = await generateResponse(toSend);

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: botText,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botResponse]);
    setIsTyping(false);
  };

  // Use onKeyDown instead of deprecated onKeyPress
  const handleKeyDown = (e: React.KeyboardEvent) => {
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
              <div className="flex items-center space-x-3 justify-between">
                {/* Title, Subtitle */}
                <CardTitle>
                  <div className="flex items-center space-x-3">
                    <Bot className="w-6 h-6" />
                    <div>
                      <div className="text-lg">{t("chatbot.title")}</div>
                      <div className="text-sm opacity-90">{t("chatbot.subtitle")}</div>
                    </div>
                  </div>
                </CardTitle>
                {/* Optional: Add LanguageSwitcher here for chatbot-only toggle */}
                <LanguageSwitcher />
              </div>
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
                    onKeyDown={handleKeyDown}
                    placeholder={t("chatbot.placeholder")}
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
                  {t("chatbot.help")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};
