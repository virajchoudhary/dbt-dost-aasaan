import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AudioButton } from "./AudioButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { CheckCircle, XCircle, Loader2, ArrowRight, ExternalLink } from "lucide-react";

export const StatusChecker = () => {
  const { t } = useLanguage();
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
      alert(t('checker.step1.note'));
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
            {t('checker.title')}
            <AudioButton text={t('checker.title')} />
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('checker.subtitle')}
            <AudioButton text={t('checker.subtitle')} />
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
                {t('checker.step1.title')}
                <AudioButton text={t('checker.step1.title')} />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <label className="text-sm font-medium">
                  {t('checker.step1.subtitle')}:
                  <AudioButton text={t('checker.step1.subtitle')} />
                </label>
                <Input
                  type="text"
                  placeholder={t('checker.step1.placeholder')}
                  value={aadhaarNumber}
                  onChange={handleInputChange}
                  className="text-lg p-4"
                  maxLength={14}
                />
                <p className="text-sm text-muted-foreground">
                  {t('checker.step1.note')}
                  <AudioButton text={t('checker.step1.note')} />
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
                    {t('checker.step1.checking')}
                  </>
                ) : (
                  t('checker.step1.button')
                )}
              </Button>

              {/* Result */}
              {checkResult && (
                <div id="check-result" className="animate-fade-in">
                  {checkResult === 'success' ? (
                    <div className="bg-success/10 border border-success/20 rounded-lg p-4 text-center">
                      <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                      <p className="font-semibold text-success">
                        {t('checker.step1.success')}
                        <AudioButton text={t('checker.step1.success')} />
                      </p>
                    </div>
                  ) : (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-center">
                      <XCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
                      <p className="font-semibold text-destructive">
                        {t('checker.step1.failure')}
                        <AudioButton text={t('checker.step1.failure')} />
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
                {t('checker.step2.title')}
                <AudioButton text={t('checker.step2.title')} />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!step2Unlocked ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {t('checker.step2.locked')}
                    <AudioButton text={t('checker.step2.locked')} />
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-secondary/10 rounded-lg p-6 text-center">
                    <div className="text-4xl mb-4">🎓</div>
                    <p className="font-semibold text-lg">
                      {t('checker.step2.portal')}
                      <AudioButton text={t('checker.step2.portal')} />
                    </p>
                  </div>

                  <Button 
                    onClick={openNSPPortal}
                    className="w-full text-lg p-4"
                    size="lg"
                    variant="secondary"
                  >
                    {t('checker.step2.button')}
                    <ExternalLink className="w-5 h-5 ml-2" />
                  </Button>

                  <div className="bg-card rounded-lg p-4 border">
                    <p className="text-sm text-center text-muted-foreground">
                      {t('checker.step2.note')}
                      <AudioButton text={t('checker.step2.note')} />
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