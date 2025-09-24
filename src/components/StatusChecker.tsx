import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AudioButton } from "./AudioButton";
import { CheckCircle, XCircle, Loader2, ArrowRight, ExternalLink } from "lucide-react";

export const StatusChecker = () => {
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<'success' | 'failure' | null>(null);
  const [step2Unlocked, setStep2Unlocked] = useState(false);

  const formatAadhaar = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const limited = numbers.slice(0, 12);
    return limited.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAadhaar(e.target.value);
    setAadhaarNumber(formatted);
  };

  const handleCheck = () => {
    const cleanNumber = aadhaarNumber.replace(/\s/g, '');
    
    if (cleanNumber.length !== 12) {
      alert('कृपया 12 अंकों का आधार नंबर डालें / Please enter a 12-digit Aadhaar number');
      return;
    }

    setIsChecking(true);
    setCheckResult(null);

    // Simulate API call with random result
    setTimeout(() => {
      const isSuccess = Math.random() > 0.3; // 70% success rate
      setCheckResult(isSuccess ? 'success' : 'failure');
      setIsChecking(false);
      
      if (isSuccess) {
        setStep2Unlocked(true);
        // Scroll to result
        setTimeout(() => {
          document.getElementById('check-result')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }, 2500);
  };

  const openNSPPortal = () => {
    window.open('https://scholarships.gov.in/', '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="checker" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
            2-Step DBT Journey
            <AudioButton text="2-Step DBT Journey" />
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            केवल 2 कदमों में अपना DBT स्टेटस चेक करें और scholarship पोर्टल तक पहुंचें
            <AudioButton text="केवल 2 कदमों में अपना DBT स्टेटस चेक करें और scholarship पोर्टल तक पहुंचें" />
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Step 1: Bank Ready Check */}
          <Card className="shadow-medium hover:shadow-strong transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-foreground">1</span>
              </div>
              <CardTitle className="text-2xl">
                अपना बैंक तैयार है?
                <AudioButton text="अपना बैंक तैयार है?" />
              </CardTitle>
              <CardDescription>
                Check if Your Bank is Ready
                <AudioButton text="Check if Your Bank is Ready" />
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <label className="text-sm font-medium">
                  आधार नंबर डालें / Enter Aadhaar Number:
                  <AudioButton text="आधार नंबर डालें" />
                </label>
                <Input
                  type="text"
                  placeholder="1234 5678 9012"
                  value={aadhaarNumber}
                  onChange={handleInputChange}
                  className="text-lg p-4"
                  maxLength={14}
                />
                <p className="text-sm text-muted-foreground">
                  यह एक सिमुलेशन है - वास्तविक DBT चेक नहीं है
                  <AudioButton text="यह एक सिमुलेशन है - वास्तविक DBT चेक नहीं है" />
                </p>
              </div>

              <Button 
                onClick={handleCheck}
                disabled={isChecking || aadhaarNumber.replace(/\s/g, '').length !== 12}
                className="w-full text-lg p-4"
                size="lg"
              >
                {isChecking ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    जांच रहे हैं... / Checking...
                  </>
                ) : (
                  'चेक करें / Check Now'
                )}
              </Button>

              {/* Result */}
              {checkResult && (
                <div id="check-result" className="animate-fade-in">
                  {checkResult === 'success' ? (
                    <div className="bg-success/10 border border-success/20 rounded-lg p-4 text-center">
                      <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                      <p className="font-semibold text-success">
                        बधाई हो! आपका बैंक DBT के लिए तैयार है!
                        <AudioButton text="बधाई हो! आपका बैंक DBT के लिए तैयार है!" />
                      </p>
                      <p className="text-sm text-success/80 mt-1">
                        Congratulations! Your bank is ready for DBT!
                      </p>
                    </div>
                  ) : (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-center">
                      <XCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
                      <p className="font-semibold text-destructive">
                        आपको अपने बैंक में आधार लिंक करना होगा
                        <AudioButton text="आपको अपने बैंक में आधार लिंक करना होगा" />
                      </p>
                      <p className="text-sm text-destructive/80 mt-1">
                        You need to link Aadhaar to your bank account
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step 2: Visit Portal */}
          <Card className={`shadow-medium transition-all duration-300 ${step2Unlocked ? 'hover:shadow-strong' : 'opacity-50'}`}>
            <CardHeader className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${step2Unlocked ? 'bg-secondary' : 'bg-muted'}`}>
                <span className={`text-2xl font-bold ${step2Unlocked ? 'text-secondary-foreground' : 'text-muted-foreground'}`}>2</span>
              </div>
              <CardTitle className="text-2xl">
                स्कॉलरशिप पोर्टल पर जाएं
                <AudioButton text="स्कॉलरशिप पोर्टल पर जाएं" />
              </CardTitle>
              <CardDescription>
                Visit the Scholarship Portal
                <AudioButton text="Visit the Scholarship Portal" />
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!step2Unlocked ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    पहले Step 1 पूरा करें
                    <AudioButton text="पहले Step 1 पूरा करें" />
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Complete Step 1 first
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-secondary/10 rounded-lg p-6 text-center">
                    <div className="text-4xl mb-4">🎓</div>
                    <p className="font-semibold text-lg">
                      राष्ट्रीय छात्रवृत्ति पोर्टल
                      <AudioButton text="राष्ट्रीय छात्रवृत्ति पोर्टल" />
                    </p>
                    <p className="text-muted-foreground mt-1">
                      National Scholarship Portal (NSP)
                    </p>
                  </div>

                  <Button 
                    onClick={openNSPPortal}
                    className="w-full text-lg p-4"
                    size="lg"
                    variant="secondary"
                  >
                    पोर्टल पर जाएं / Visit Portal
                    <ExternalLink className="w-5 h-5 ml-2" />
                  </Button>

                  <div className="bg-card rounded-lg p-4 border">
                    <p className="text-sm text-center text-muted-foreground">
                      scholarships.gov.in पर जाकर अपनी scholarship के लिए apply करें
                      <AudioButton text="scholarships.gov.in पर जाकर अपनी scholarship के लिए apply करें" />
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mt-12">
          <div className="flex items-center space-x-4">
            <div className={`w-4 h-4 rounded-full ${checkResult === 'success' ? 'bg-primary' : 'bg-muted'}`}></div>
            <ArrowRight className={`w-6 h-6 ${step2Unlocked ? 'text-secondary' : 'text-muted-foreground'}`} />
            <div className={`w-4 h-4 rounded-full ${step2Unlocked ? 'bg-secondary' : 'bg-muted'}`}></div>
          </div>
        </div>
      </div>
    </section>
  );
};