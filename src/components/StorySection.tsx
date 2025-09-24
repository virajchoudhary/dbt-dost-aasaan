import { AlertTriangle, ArrowRight, CheckCircle, Coins, CreditCard, Users } from "lucide-react";
import { AudioButton } from "./AudioButton";
import { useLanguage } from "@/contexts/LanguageContext";

export const StorySection = () => {
  const { t } = useLanguage();

  return (
    <section id="story" className="bg-background">
      {/* Problem Section */}
      <div className="story-section bg-gradient-to-br from-warning/10 to-destructive/10 folk-pattern">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-8 max-w-6xl mx-auto">
            <div className="space-y-4">
              <AlertTriangle className="w-16 h-16 text-warning mx-auto animate-bounce-gentle" />
              <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
                {t('story.problem.title')}
                <AudioButton text={t('story.problem.title')} />
              </h2>
            </div>

            {/* Animation showing money flowing through middlemen */}
            <div className="grid md:grid-cols-4 gap-8 items-center my-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-20 h-20 bg-chakra-blue rounded-full flex items-center justify-center shadow-medium">
                  <div className="text-3xl">🏛️</div>
                </div>
                <p className="text-center font-medium">
                  {t('story.government')}
                  <AudioButton text={t('story.government')} />
                </p>
              </div>

              <div className="flex flex-col items-center space-y-4">
                <ArrowRight className="w-8 h-8 text-muted-foreground animate-pulse" />
                <div className="w-20 h-20 bg-warning rounded-full flex items-center justify-center shadow-medium animate-story-float">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <p className="text-center font-medium text-warning">
                  {t('story.middlemen')}
                  <AudioButton text={t('story.middlemen')} />
                </p>
              </div>

              <div className="flex flex-col items-center space-y-4">
                <ArrowRight className="w-8 h-8 text-muted-foreground animate-pulse animation-delay-200" />
                <div className="w-20 h-20 bg-destructive rounded-full flex items-center justify-center shadow-medium animate-story-float animation-delay-400">
                  <Coins className="w-10 h-10 text-white" />
                </div>
                <p className="text-center font-medium text-destructive">
                  {t('story.less_money')}
                  <AudioButton text={t('story.less_money')} />
                </p>
              </div>

              <div className="flex flex-col items-center space-y-4">
                <ArrowRight className="w-8 h-8 text-muted-foreground animate-pulse animation-delay-400" />
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center shadow-medium">
                  <div className="text-3xl">👨‍🎓</div>
                </div>
                <p className="text-center font-medium">
                  {t('story.student')}
                  <AudioButton text={t('story.student')} />
                </p>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-8 shadow-medium max-w-4xl mx-auto">
              <p className="text-xl md:text-2xl text-center leading-relaxed text-muted-foreground">
                {t('story.problem.description')}
                <AudioButton text={t('story.problem.description')} />
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
                {t('story.solution.title')}
                <AudioButton text={t('story.solution.title')} />
              </h2>
            </div>

            {/* Animation showing direct transfer */}
            <div className="grid md:grid-cols-3 gap-12 items-center my-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-strong">
                  <div className="text-4xl">🏛️</div>
                </div>
                <p className="text-center font-medium text-white text-xl">
                  {t('story.government')}
                  <AudioButton text={t('story.government')} />
                </p>
              </div>

              <div className="flex flex-col items-center space-y-4">
                <ArrowRight className="w-12 h-12 text-white animate-pulse" />
                <div className="text-white text-center">
                  <p className="text-lg font-semibold">
                    {t('story.direct')}
                    <AudioButton text={t('story.direct')} />
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
                  {t('story.bank_account')}
                  <AudioButton text={t('story.bank_account')} />
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-strong max-w-4xl mx-auto border border-white/20">
              <p className="text-xl md:text-2xl text-center leading-relaxed text-white">
                {t('story.solution.description')}
                <AudioButton text={t('story.solution.description')} />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};