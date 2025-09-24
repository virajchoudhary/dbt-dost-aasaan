import { AlertTriangle, ArrowRight, CheckCircle, Coins, CreditCard, Users } from "lucide-react";
import { AudioButton } from "./AudioButton";

export const StorySection = () => {
  return (
    <section id="story" className="bg-background">
      {/* Problem Section */}
      <div className="story-section bg-gradient-to-br from-warning/10 to-destructive/10 folk-pattern">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-8 max-w-6xl mx-auto">
            <div className="space-y-4">
              <AlertTriangle className="w-16 h-16 text-warning mx-auto animate-bounce-gentle" />
              <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
                पहले क्या होता था?
                <AudioButton text="पहले क्या होता था?" />
              </h2>
              <h3 className="text-2xl md:text-3xl font-display text-muted-foreground">
                What Happened Before?
                <AudioButton text="What Happened Before?" />
              </h3>
            </div>

            {/* Animation showing money flowing through middlemen */}
            <div className="grid md:grid-cols-4 gap-8 items-center my-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-20 h-20 bg-chakra-blue rounded-full flex items-center justify-center shadow-medium">
                  <div className="text-3xl">🏛️</div>
                </div>
                <p className="text-center font-medium">
                  सरकार / Government
                  <AudioButton text="सरकार" />
                </p>
              </div>

              <div className="flex flex-col items-center space-y-4">
                <ArrowRight className="w-8 h-8 text-muted-foreground animate-pulse" />
                <div className="w-20 h-20 bg-warning rounded-full flex items-center justify-center shadow-medium animate-story-float">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <p className="text-center font-medium text-warning">
                  बिचौलिए / Middlemen
                  <AudioButton text="बिचौलिए" />
                </p>
              </div>

              <div className="flex flex-col items-center space-y-4">
                <ArrowRight className="w-8 h-8 text-muted-foreground animate-pulse animation-delay-200" />
                <div className="w-20 h-20 bg-destructive rounded-full flex items-center justify-center shadow-medium animate-story-float animation-delay-400">
                  <Coins className="w-10 h-10 text-white" />
                </div>
                <p className="text-center font-medium text-destructive">
                  कम पैसा / Less Money
                  <AudioButton text="कम पैसा" />
                </p>
              </div>

              <div className="flex flex-col items-center space-y-4">
                <ArrowRight className="w-8 h-8 text-muted-foreground animate-pulse animation-delay-400" />
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center shadow-medium">
                  <div className="text-3xl">👨‍🎓</div>
                </div>
                <p className="text-center font-medium">
                  छात्र / Student
                  <AudioButton text="छात्र" />
                </p>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-8 shadow-medium max-w-4xl mx-auto">
              <p className="text-xl md:text-2xl text-center leading-relaxed text-muted-foreground">
                पहले छात्रवृत्ति का पैसा बीच में कई लोगों से होकर आता था। कभी-कभी पूरा पैसा नहीं मिलता था।
                <AudioButton text="पहले छात्रवृत्ति का पैसा बीच में कई लोगों से होकर आता था। कभी-कभी पूरा पैसा नहीं मिलता था।" />
              </p>
              <p className="text-lg md:text-xl text-center mt-4 text-muted-foreground">
                Earlier, scholarship money passed through many people. Sometimes students didn't get the full amount.
                <AudioButton text="Earlier, scholarship money passed through many people. Sometimes students didn't get the full amount." />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Solution Section */}
      <div className="story-section bg-gradient-success folk-pattern">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-8 max-w-6xl mx-auto">
            <div className="space-y-4">
              <CheckCircle className="w-16 h-16 text-white mx-auto animate-bounce-gentle" />
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white">
                अब DBT से क्या होता है?
                <AudioButton text="अब DBT से क्या होता है?" />
              </h2>
              <h3 className="text-2xl md:text-3xl font-display text-white/90">
                What Happens Now with DBT?
                <AudioButton text="What Happens Now with DBT?" />
              </h3>
            </div>

            {/* Animation showing direct transfer */}
            <div className="grid md:grid-cols-3 gap-12 items-center my-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-strong">
                  <div className="text-4xl">🏛️</div>
                </div>
                <p className="text-center font-medium text-white text-xl">
                  सरकार / Government
                  <AudioButton text="सरकार" />
                </p>
              </div>

              <div className="flex flex-col items-center space-y-4">
                <ArrowRight className="w-12 h-12 text-white animate-pulse" />
                <div className="text-white text-center">
                  <p className="text-lg font-semibold">
                    सीधे / Direct
                    <AudioButton text="सीधे" />
                  </p>
                  <p className="text-sm opacity-90">No Middlemen!</p>
                </div>
                <ArrowRight className="w-12 h-12 text-white animate-pulse animation-delay-200" />
              </div>

              <div className="flex flex-col items-center space-y-4">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-strong animate-story-float">
                  <CreditCard className="w-12 h-12 text-success" />
                </div>
                <p className="text-center font-medium text-white text-xl">
                  आपका बैंक खाता / Your Bank Account
                  <AudioButton text="आपका बैंक खाता" />
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-strong max-w-4xl mx-auto border border-white/20">
              <p className="text-xl md:text-2xl text-center leading-relaxed text-white">
                अब DBT से पैसा सीधे आपके बैंक खाते में आता है। पूरा पैसा, सही समय पर!
                <AudioButton text="अब DBT से पैसा सीधे आपके बैंक खाते में आता है। पूरा पैसा, सही समय पर!" />
              </p>
              <p className="text-lg md:text-xl text-center mt-4 text-white/90">
                Now with DBT, money comes directly to your bank account. Full amount, on time!
                <AudioButton text="Now with DBT, money comes directly to your bank account. Full amount, on time!" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};