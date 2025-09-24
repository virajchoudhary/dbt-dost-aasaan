import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AudioButton } from "./AudioButton";
import { useLanguage, useQuizData } from "@/contexts/LanguageContext";
import { CheckCircle, XCircle, RotateCcw, Trophy, Brain } from "lucide-react";
import raviImage from "@/assets/ravi-character.jpg";

export const QuizSection = () => {
  const { t } = useLanguage();
  const quizData = useQuizData();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(false);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = selectedAnswer;
    setUserAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
      setShowResults(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizCompleted(false);
    setShowResults(false);
  };

  const calculateScore = () => {
    return userAnswers.reduce((score, answer, index) => {
      return score + (answer === quizData[index].correct ? 1 : 0);
    }, 0);
  };

  const getScoreFeedback = (score: number) => {
    const percentage = (score / quizData.length) * 100;
    if (percentage >= 80) {
      return t('quiz.feedback.excellent');
    } else if (percentage >= 60) {
      return t('quiz.feedback.good');
    } else if (percentage >= 40) {
      return t('quiz.feedback.fair');
    } else {
      return t('quiz.feedback.poor');
    }
  };

  if (showResults) {
    const score = calculateScore();
    return (
      <section id="quiz" className="py-20 bg-accent/5">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto shadow-strong">
            <CardHeader className="text-center">
              <Trophy className="w-16 h-16 text-warning mx-auto mb-4" />
              <CardTitle className="text-3xl">
                {t('quiz.completed')}
                <AudioButton text={t('quiz.completed')} />
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="bg-gradient-success rounded-2xl p-8 text-white">
                <div className="text-6xl font-bold mb-2">{score}</div>
                <div className="text-2xl mb-4">
                  {t('quiz.score')} {quizData.length}
                </div>
                <div className="text-xl">
                  {Math.round((score / quizData.length) * 100)}% Score
                </div>
              </div>

              <div className="bg-card rounded-lg p-6 border">
                <p className="text-lg leading-relaxed">
                  {getScoreFeedback(score)}
                  <AudioButton text={getScoreFeedback(score)} />
                </p>
              </div>

              <Button onClick={restartQuiz} size="lg" className="px-8">
                <RotateCcw className="w-5 h-5 mr-2" />
                {t('quiz.restart')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="quiz" className="py-20 bg-accent/5">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <div className="flex justify-center mb-6">
            <img
              src={raviImage}
              alt="Ravi - Quiz Master"
              className="w-24 h-24 rounded-full shadow-medium border-4 border-accent"
            />
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
            {t('quiz.title')}
            <AudioButton text={t('quiz.title')} />
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('quiz.subtitle')}
            <AudioButton text={t('quiz.subtitle')} />
          </p>
        </div>

        <Card className="max-w-4xl mx-auto shadow-strong">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <CardTitle className="text-xl">
                    {t('quiz.question')} {currentQuestion + 1} / {quizData.length}
                  </CardTitle>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="w-32 bg-muted rounded-full h-2">
                <div 
                  className="bg-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / quizData.length) * 100}%` }}
                />
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold leading-relaxed">
                {quizData[currentQuestion].question}
                <AudioButton text={quizData[currentQuestion].question} />
              </h3>
            </div>

            <div className="grid gap-3">
              {quizData[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                  className={`quiz-option ${selectedAnswer === index ? 'selected' : ''} ${
                    showExplanation && index === quizData[currentQuestion].correct 
                      ? 'correct' 
                      : showExplanation && selectedAnswer === index && index !== quizData[currentQuestion].correct 
                        ? 'incorrect' 
                        : ''
                  }`}
                >
                  <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                  {option}
                  <AudioButton text={option} />
                </button>
              ))}
            </div>

            {showExplanation && (
              <div className="bg-card rounded-lg p-6 border-l-4 border-accent animate-fade-in">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-success mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-success mb-2">{t('quiz.explanation')}</h4>
                    <p className="leading-relaxed">
                      {quizData[currentQuestion].explanation}
                      <AudioButton text={quizData[currentQuestion].explanation} />
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  if (currentQuestion > 0) {
                    setCurrentQuestion(currentQuestion - 1);
                    setSelectedAnswer(userAnswers[currentQuestion - 1] || null);
                    setShowExplanation(false);
                  }
                }}
                disabled={currentQuestion === 0}
              >
                {t('quiz.previous')}
              </Button>

              {!showExplanation ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className="px-8"
                >
                  {t('quiz.submit')}
                </Button>
              ) : (
                <Button onClick={handleNextQuestion} className="px-8">
                  {currentQuestion === quizData.length - 1 ? t('quiz.results') : t('quiz.next')}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const quizData: Question[] = [
  {
    question: "DBT का मतलब क्या है? / What does DBT stand for?",
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
    question: "भारत में scholarship के लिए मुख्य पोर्टल कौन सा है? / Which portal is primarily used for scholarships in India?",
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
    question: "DBT enable करने के लिए क्या चाहिए? / What is required to enable DBT?",
    options: [
      "केवल बैंक खाता नंबर / Only bank account number",
      "केवल आधार नंबर / Only Aadhaar number",
      "आधार बैंक से linked होना चाहिए / Aadhaar linked to bank",
      "PAN card"
    ],
    correct: 2,
    explanation: "DBT के लिए आपका Aadhaar आपके bank account से linked होना जरूरी है और NPCI mapper में seeded होना चाहिए।"
  },
  {
    question: "NPCI mapper कौन maintain करता है? / Who maintains the NPCI mapper?",
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
    question: "DBT का मुख्य फायदा क्या है? / What is the primary advantage of DBT?",
    options: [
      "तेज़ processing / Faster processing",
      "बिचौलियों को हटाता है / Eliminates middlemen", 
      "कम cost / Lower costs",
      "बेहतर customer service / Better customer service"
    ],
    correct: 1,
    explanation: "DBT का सबसे बड़ा फायदा यह है कि यह middlemen को हटाकर corruption को कम करता है और पैसा सीधे beneficiary के खाते में जाता है।"
  }
];

export const QuizSection = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(false);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = selectedAnswer;
    setUserAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
      setShowResults(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizCompleted(false);
    setShowResults(false);
  };

  const calculateScore = () => {
    return userAnswers.reduce((score, answer, index) => {
      return score + (answer === quizData[index].correct ? 1 : 0);
    }, 0);
  };

  const getScoreFeedback = (score: number) => {
    const percentage = (score / quizData.length) * 100;
    if (percentage >= 80) {
      return "शानदार! आपको DBT और Aadhaar systems की बहुत अच्छी समझ है।";
    } else if (percentage >= 60) {
      return "अच्छा! आप basics समझते हैं। कुछ concepts को revise करें।";
    } else if (percentage >= 40) {
      return "ठीक है। Learning materials को पढ़कर अपनी knowledge बढ़ाएं।";
    } else {
      return "अभी भी सीखना है! Educational content को review करके फिर से try करें।";
    }
  };

  if (showResults) {
    const score = calculateScore();
    return (
      <section id="quiz" className="py-20 bg-accent/5">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto shadow-strong">
            <CardHeader className="text-center">
              <Trophy className="w-16 h-16 text-warning mx-auto mb-4" />
              <CardTitle className="text-3xl">
                Quiz पूरी हो गई!
                <AudioButton text="Quiz पूरी हो गई!" />
              </CardTitle>
              <CardDescription>
                Quiz Completed!
                <AudioButton text="Quiz Completed!" />
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="bg-gradient-success rounded-2xl p-8 text-white">
                <div className="text-6xl font-bold mb-2">{score}</div>
                <div className="text-2xl mb-4">
                  {quizData.length} में से / out of {quizData.length}
                </div>
                <div className="text-xl">
                  {Math.round((score / quizData.length) * 100)}% Score
                </div>
              </div>

              <div className="bg-card rounded-lg p-6 border">
                <p className="text-lg leading-relaxed">
                  {getScoreFeedback(score)}
                  <AudioButton text={getScoreFeedback(score)} />
                </p>
              </div>

              <Button onClick={restartQuiz} size="lg" className="px-8">
                <RotateCcw className="w-5 h-5 mr-2" />
                फिर से try करें / Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="quiz" className="py-20 bg-accent/5">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <div className="flex justify-center mb-6">
            <img
              src={raviImage}
              alt="Ravi - Quiz Master"
              className="w-24 h-24 rounded-full shadow-medium border-4 border-accent"
            />
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
            Ravi के साथ Quiz खेलें
            <AudioButton text="Ravi के साथ Quiz खेलें" />
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Play Quiz with Ravi - Test your DBT knowledge!
            <AudioButton text="Play Quiz with Ravi - Test your DBT knowledge!" />
          </p>
        </div>

        <Card className="max-w-4xl mx-auto shadow-strong">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <CardTitle className="text-xl">
                    प्रश्न {currentQuestion + 1} / {quizData.length}
                  </CardTitle>
                  <CardDescription>Question {currentQuestion + 1} of {quizData.length}</CardDescription>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="w-32 bg-muted rounded-full h-2">
                <div 
                  className="bg-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / quizData.length) * 100}%` }}
                />
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold leading-relaxed">
                {quizData[currentQuestion].question}
                <AudioButton text={quizData[currentQuestion].question} />
              </h3>
            </div>

            <div className="grid gap-3">
              {quizData[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                  className={`quiz-option ${selectedAnswer === index ? 'selected' : ''} ${
                    showExplanation && index === quizData[currentQuestion].correct 
                      ? 'correct' 
                      : showExplanation && selectedAnswer === index && index !== quizData[currentQuestion].correct 
                        ? 'incorrect' 
                        : ''
                  }`}
                >
                  <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                  {option}
                  <AudioButton text={option} />
                </button>
              ))}
            </div>

            {showExplanation && (
              <div className="bg-card rounded-lg p-6 border-l-4 border-accent animate-fade-in">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-success mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-success mb-2">व्याख्या / Explanation:</h4>
                    <p className="leading-relaxed">
                      {quizData[currentQuestion].explanation}
                      <AudioButton text={quizData[currentQuestion].explanation} />
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  if (currentQuestion > 0) {
                    setCurrentQuestion(currentQuestion - 1);
                    setSelectedAnswer(userAnswers[currentQuestion - 1] || null);
                    setShowExplanation(false);
                  }
                }}
                disabled={currentQuestion === 0}
              >
                पिछला / Previous
              </Button>

              {!showExplanation ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className="px-8"
                >
                  जवाब दें / Submit Answer
                </Button>
              ) : (
                <Button onClick={handleNextQuestion} className="px-8">
                  {currentQuestion === quizData.length - 1 ? 'परिणाम देखें / View Results' : 'अगला / Next'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};