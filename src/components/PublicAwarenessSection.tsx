import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AudioButton } from "./AudioButton";
import { Share2, Download, FileImage, MessageSquare, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const PublicAwarenessSection = () => {
  const [isGeneratingPoster, setIsGeneratingPoster] = useState(false);

  const shareToWhatsApp = () => {
    const message = `🎓 *DBT से छात्रवृत्ति पाएं!* 📱

नमस्ते! मैंने एक बहुत महत्वपूर्ण website की जानकारी पाई है जो हमारे बच्चों की scholarship के लिए बहुत उपयोगी है।

✅ *Direct Benefit Transfer* से पैसा सीधे bank account में आता है
✅ कोई बिचौलिया नहीं, कोई कमीशन नहीं  
✅ Aadhaar linking से सब कुछ automatic हो जाता है
✅ *National Scholarship Portal* पर आसानी से apply करें

अपने गांव/मोहल्ले के सभी परिवारों को बताएं! 

🔗 पूरी जानकारी यहाँ देखें: ${window.location.href}

#DBT #Scholarship #DirectBenefitTransfer #Education`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    
    toast({
      title: "WhatsApp में share करने के लिए तैयार!",
      description: "Message को edit करके अपने contacts के साथ share करें।",
    });
  };

  const generatePoster = async () => {
    setIsGeneratingPoster(true);
    
    try {
      // Create a hidden div with poster content
      const posterDiv = document.createElement('div');
      posterDiv.style.width = '800px';
      posterDiv.style.height = '1000px';
      posterDiv.style.background = 'linear-gradient(135deg, #ff7f27 0%, #ffc107 100%)';
      posterDiv.style.padding = '40px';
      posterDiv.style.fontFamily = 'Arial, sans-serif';
      posterDiv.style.color = 'white';
      posterDiv.style.position = 'absolute';
      posterDiv.style.left = '-9999px';
      posterDiv.style.boxSizing = 'border-box';
      
      posterDiv.innerHTML = `
        <div style="text-align: center; height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <h1 style="font-size: 48px; font-weight: bold; margin: 0 0 20px 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
              ग्राम पंचायत सूचना
            </h1>
            <div style="font-size: 24px; margin-bottom: 40px; background: rgba(255,255,255,0.2); padding: 20px; border-radius: 15px;">
              GRAM PANCHAYAT NOTICE
            </div>
          </div>
          
          <div style="background: rgba(255,255,255,0.9); color: #333; padding: 40px; border-radius: 20px; margin: 20px 0;">
            <h2 style="font-size: 36px; color: #ff7f27; margin: 0 0 30px 0; font-weight: bold;">
              छात्रवृत्ति की जानकारी
            </h2>
            
            <div style="text-align: left; font-size: 18px; line-height: 1.6;">
              <div style="margin-bottom: 20px;">
                <strong>✅ DBT से पैसा सीधे खाते में आएगा</strong><br>
                Direct money transfer to your account
              </div>
              
              <div style="margin-bottom: 20px;">
                <strong>✅ आधार को बैंक से जोड़ना जरूरी</strong><br>
                Link Aadhaar with bank account
              </div>
              
              <div style="margin-bottom: 20px;">
                <strong>✅ National Scholarship Portal पर apply करें</strong><br>
                Apply on scholarships.gov.in
              </div>
              
              <div style="margin-bottom: 20px;">
                <strong>✅ कोई बिचौलिया नहीं, कोई कमीशन नहीं</strong><br>
                No middlemen, no commission
              </div>
            </div>
          </div>
          
          <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px;">
            <div style="font-size: 20px; margin-bottom: 15px;">
              <strong>अधिक जानकारी के लिए / For more information:</strong>
            </div>
            <div style="font-size: 18px; background: white; color: #ff7f27; padding: 15px; border-radius: 10px; font-weight: bold;">
              📱 Online: scholarships.gov.in<br>
              🌐 Website: ${window.location.hostname}
            </div>
          </div>
          
          <div style="font-size: 16px; opacity: 0.9; margin-top: 20px;">
            सभी गांववासियों को बताएं | Share with all villagers
          </div>
        </div>
      `;
      
      document.body.appendChild(posterDiv);
      
      // Use html2canvas library (would need to be added to project)
      // For now, we'll simulate the download
      setTimeout(() => {
        document.body.removeChild(posterDiv);
        setIsGeneratingPoster(false);
        
        // Create a simple text file as fallback
        const content = `
ग्राम पंचायत सूचना - GRAM PANCHAYAT NOTICE

छात्रवृत्ति की जानकारी / Scholarship Information

✅ DBT से पैसा सीधे खाते में आएगा
   Direct money transfer to your account

✅ आधार को बैंक से जोड़ना जरूरी  
   Link Aadhaar with bank account

✅ National Scholarship Portal पर apply करें
   Apply on scholarships.gov.in

✅ कोई बिचौलिया नहीं, कोई कमीशन नहीं
   No middlemen, no commission

अधिक जानकारी के लिए:
📱 Online: scholarships.gov.in
🌐 Website: ${window.location.hostname}

सभी गांववासियों को बताएं | Share with all villagers
        `;
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'DBT-Scholarship-Notice.txt';
        a.click();
        URL.revokeObjectURL(url);
        
        toast({
          title: "Notice file download हो गई!",
          description: "इस notice को print करके अपनी Gram Panchayat में लगवाएं।",
        });
      }, 2000);
      
    } catch (error) {
      setIsGeneratingPoster(false);
      toast({
        title: "Error",
        description: "Poster generate करने में समस्या हुई। कृपया फिर से try करें।",
        variant: "destructive",
      });
    }
  };

  return (
    <section id="awareness" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
            जागरूकता फैलाएं
            <AudioButton text="जागरूकता फैलाएं" />
          </h2>
          <h3 className="text-2xl md:text-3xl font-display text-muted-foreground">
            Spread Awareness
            <AudioButton text="Spread Awareness" />
          </h3>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            अपने समुदाय में DBT की जानकारी फैलाकर सभी को मदद करें
            <AudioButton text="अपने समुदाय में DBT की जानकारी फैलाकर सभी को मदद करें" />
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* WhatsApp Share */}
          <Card className="shadow-medium hover:shadow-strong transition-all duration-300 interactive-card">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">
                WhatsApp पर Share करें
                <AudioButton text="WhatsApp पर Share करें" />
              </CardTitle>
              <CardDescription>
                Share on WhatsApp
                <AudioButton text="Share on WhatsApp" />
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green/10 rounded-lg p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green flex-shrink-0" />
                  <p className="text-sm">
                    Ready-made message in Hindi & English
                    <AudioButton text="Ready-made message in Hindi & English" />
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green flex-shrink-0" />
                  <p className="text-sm">
                    आसान language में समझाया गया
                    <AudioButton text="आसान language में समझाया गया" />
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green flex-shrink-0" />
                  <p className="text-sm">
                    Direct website link included
                    <AudioButton text="Direct website link included" />
                  </p>
                </div>
              </div>

              <Button 
                onClick={shareToWhatsApp}
                className="w-full text-lg p-4"
                size="lg"
                variant="default"
              >
                <Share2 className="w-5 h-5 mr-2" />
                WhatsApp पर भेजें / Share on WhatsApp
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                अपने family, friends और community के साथ share करें
                <AudioButton text="अपने family, friends और community के साथ share करें" />
              </p>
            </CardContent>
          </Card>

          {/* Poster Generator */}
          <Card className="shadow-medium hover:shadow-strong transition-all duration-300 interactive-card">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <FileImage className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">
                Notice Download करें
                <AudioButton text="Notice Download करें" />
              </CardTitle>
              <CardDescription>
                Download Notice Poster
                <AudioButton text="Download Notice Poster" />
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-accent/10 rounded-lg p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  <p className="text-sm">
                    Gram Panchayat के लिए ready notice
                    <AudioButton text="Gram Panchayat के लिए ready notice" />
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  <p className="text-sm">
                    Print करके notice board पर लगाएं
                    <AudioButton text="Print करके notice board पर लगाएं" />
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  <p className="text-sm">
                    Hindi & English both languages
                    <AudioButton text="Hindi & English both languages" />
                  </p>
                </div>
              </div>

              <Button 
                onClick={generatePoster}
                disabled={isGeneratingPoster}
                className="w-full text-lg p-4"
                size="lg"
                variant="secondary"
              >
                {isGeneratingPoster ? (
                  <>
                    <div className="w-5 h-5 mr-2 animate-spin rounded-full border-2 border-secondary-foreground border-t-transparent" />
                    तैयार कर रहे हैं... / Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Notice Download करें / Download Notice
                  </>
                )}
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                Village community center या school में भी लगवा सकते हैं
                <AudioButton text="Village community center या school में भी लगवा सकते हैं" />
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Impact Statistics */}
        <div className="mt-16 bg-gradient-card rounded-2xl p-8 shadow-medium max-w-4xl mx-auto">
          <h3 className="text-2xl font-display font-bold text-center mb-8">
            आपकी मदद का असर / Your Help's Impact
            <AudioButton text="आपकी मदद का असर" />
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">10+</div>
              <p className="text-sm text-muted-foreground">
                Families को जानकारी मिलेगी
                <AudioButton text="Families को जानकारी मिलेगी" />
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-secondary">50+</div>
              <p className="text-sm text-muted-foreground">
                Students की मदद होगी
                <AudioButton text="Students की मदद होगी" />
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-accent">100%</div>
              <p className="text-sm text-muted-foreground">
                पैसा सीधे account में
                <AudioButton text="पैसा सीधे account में" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};