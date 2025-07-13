import React, { useState, useEffect, useCallback } from 'react';
import { SideMenu } from './components/SideMenu';
import { Graph } from './components/Graph';
import { QuestionPanel } from './components/QuestionPanel';
import { Feedback } from './components/Feedback';
import { getQuestionsByTopic } from './services/mathService';
import { getHintFromGemini } from './services/geminiService';
import type { Topic, Question } from './types';

const checkAnswer = (question: Question, answer: string): boolean => {
  if (!answer) return false;

  if (question.answerType === 'multiple-select') {
    try {
      // For multiple-select, we compare the sorted JSON string arrays
      const submitted = JSON.parse(answer).sort();
      const correct = JSON.parse(question.correctAnswer).sort();
      return JSON.stringify(submitted) === JSON.stringify(correct);
    } catch {
      return false; // Invalid JSON in answer or correctAnswer
    }
  }

  // Default comparison for numeric, multiple-choice, and click-on-graph (which submits a stringified point)
  return answer === question.correctAnswer;
};

export default function App() {
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [isHintLoading, setIsHintLoading] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const userAnswer = currentQuestion ? userAnswers[currentQuestion.id] : undefined;
  const isAnswered = userAnswer !== undefined;
  
  const isCorrect = isAnswered && currentQuestion && checkAnswer(currentQuestion, userAnswer);

  const fetchQuestions = useCallback(async (topic: Topic) => {
    setIsLoading(true);
    setActiveTopic(topic);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setScore(0);
    setHint(null);
    
    const fetchedQuestions = await getQuestionsByTopic(topic);
    setQuestions(fetchedQuestions);
    setIsLoading(false);
  }, []);

  const handleSelectTopic = (topic: Topic) => {
    fetchQuestions(topic);
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setHint(null);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setHint(null);
    }
  };

  const handleSubmitAnswer = (answer: string) => {
    if (!currentQuestion || isAnswered) return;

    setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));

    if (checkAnswer(currentQuestion, answer)) {
      setScore(s => s + 1);
    }
  };

  const handleGetHint = async () => {
    if(!currentQuestion || hint) return;
    setIsHintLoading(true);
    const geminiHint = await getHintFromGemini(currentQuestion);
    setHint(geminiHint);
    setIsHintLoading(false);
  };
  
  const WelcomeScreen = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to MathQuest!</h2>
        <p className="text-lg text-gray-600 max-w-2xl">
            Select a topic from the sidebar to begin your journey. You'll face challenges that bring math concepts to life through interactive graphs.
        </p>
    </div>
  );

  const TopicCompleteScreen = () => (
     <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white border border-gray-200 rounded-xl">
        <h2 className="text-4xl font-bold text-indigo-600 mb-4">Topic Complete!</h2>
        <p className="text-xl text-gray-700 mb-6">
            You scored {score} out of {questions.length}.
        </p>
        <button
          onClick={() => {
            setActiveTopic(null);
            setQuestions([]);
          }}
          className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition"
        >
          Choose another topic
        </button>
    </div>
  );
  
  const NavigationControls = () => (
    <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-100 disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed transition"
        >
          &larr; Previous
        </button>
        <div className="text-gray-500 font-medium">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        {currentQuestionIndex < questions.length - 1 ? (
           <button
             onClick={handleNextQuestion}
             className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-100 transition"
           >
             Next &rarr;
           </button>
        ) : (
          <button
             onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)} // Go to "complete" screen
             className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition"
           >
             Finish Topic
           </button>
        )}
    </div>
  )

  return (
    <div className="flex h-screen font-sans">
      <SideMenu activeTopic={activeTopic} onSelectTopic={handleSelectTopic} />
      <main className="flex-1 p-8 overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto h-full flex flex-col gap-8">
          {!activeTopic ? (
             <WelcomeScreen />
          ) : isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-2xl text-gray-500 animate-pulse">Loading {activeTopic}...</p>
            </div>
          ) : !currentQuestion ? (
             <TopicCompleteScreen />
          ) : (
            <>
              <Graph 
                question={currentQuestion} 
                isAnswered={isAnswered}
                userAnswer={userAnswer}
                onSubmitAnswer={handleSubmitAnswer}
              />
              <div className="space-y-4">
                  <QuestionPanel 
                    question={currentQuestion}
                    onSubmitAnswer={handleSubmitAnswer}
                    isAnswered={isAnswered}
                    onGetHint={handleGetHint}
                    hint={hint}
                    isHintLoading={isHintLoading}
                  />
                  {isAnswered && (
                    <Feedback
                      isCorrect={!!isCorrect}
                      explanation={currentQuestion.explanation}
                    />
                  )}
              </div>
              <NavigationControls />
            </>
          )}
        </div>
      </main>
    </div>
  );
}