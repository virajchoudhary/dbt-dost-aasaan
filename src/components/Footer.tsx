import { AudioButton } from "./AudioButton";
import { ExternalLink, Heart, Mail, Phone } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-display font-bold text-primary">
              DBT Dost के बारे में
              <AudioButton text="DBT Dost के बारे में" />
            </h3>
            <p className="text-background/80 leading-relaxed">
              हमारा mission है कि हर भारतीय student को DBT और scholarship की सही जानकारी मिले। 
              यह website खासकर rural और semi-urban students के लिए बनाई गई है।
              <AudioButton text="हमारा mission है कि हर भारतीय student को DBT और scholarship की सही जानकारी मिले। यह website खासकर rural और semi-urban students के लिए बनाई गई है।" />
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-2xl font-display font-bold text-secondary">
              Important Links
              <AudioButton text="Important Links" />
            </h3>
            <div className="space-y-3">
              <a
                href="https://scholarships.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-background/80 hover:text-primary transition-colors duration-200"
              >
                <ExternalLink className="w-4 h-4" />
                <span>National Scholarship Portal</span>
              </a>
              <a
                href="https://uidai.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-background/80 hover:text-primary transition-colors duration-200"
              >
                <ExternalLink className="w-4 h-4" />
                <span>UIDAI - Aadhaar</span>
              </a>
              <a
                href="https://dbtbharat.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-background/80 hover:text-primary transition-colors duration-200"
              >
                <ExternalLink className="w-4 h-4" />
                <span>DBT Mission</span>
              </a>
            </div>
          </div>

          {/* Help & Support */}
          <div className="space-y-4">
            <h3 className="text-2xl font-display font-bold text-accent">
              मदद चाहिए? / Need Help?
              <AudioButton text="मदद चाहिए?" />
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-background/80">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>NSP Helpline: 0120-6619540</span>
              </div>
              <div className="flex items-center space-x-2 text-background/80">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>Email: helpdesk@nsp.gov.in</span>
              </div>
              <div className="bg-warning/20 rounded-lg p-4 mt-4">
                <p className="text-sm text-background/90">
                  यह एक educational website है। Official information के लिए government portals पर जाएं।
                  <AudioButton text="यह एक educational website है। Official information के लिए government portals पर जाएं।" />
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-background/60">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-primary" />
              <span>for Indian Students</span>
            </div>
            
            <div className="text-background/60 text-sm">
              © 2024 DBT Dost - Education & Awareness Initiative
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 p-4 bg-background/5 rounded-lg">
            <p className="text-xs text-background/70 text-center leading-relaxed">
              <strong>Disclaimer:</strong> यह website educational purpose के लिए है। 
              All official information और applications के लिए कृपया government websites (scholarships.gov.in, uidai.gov.in) पर जाएं। 
              हम किसी भी financial transaction की guarantee नहीं देते।
              <AudioButton text="Disclaimer: यह website educational purpose के लिए है। All official information और applications के लिए कृपया government websites पर जाएं।" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};