import React, { useState, useEffect } from 'react';
import type { Question, AnswerType } from '../types';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';

interface QuestionPanelProps {
  question: Question | null;
  onSubmitAnswer: (answer: string) => void;
  isAnswered: boolean;
  onGetHint: () => void;
  hint: string | null;
  isHintLoading: boolean;
}

export const QuestionPanel: React.FC<QuestionPanelProps> = ({
  question,
  onSubmitAnswer,
  isAnswered,
  onGetHint,
  hint,
  isHintLoading,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question?.answerType === 'numeric' && inputValue.trim()) {
      onSubmitAnswer(inputValue.trim());
    } else if (question?.answerType === 'multiple-select' && selectedOptions.length > 0) {
      onSubmitAnswer(JSON.stringify(selectedOptions.sort()));
    }
  };

  const handleOptionClick = (option: string) => {
    onSubmitAnswer(option);
  };
  
  const handleCheckboxChange = (option: string) => {
    setSelectedOptions(prev => 
      prev.includes(option) 
        ? prev.filter(o => o !== option)
        : [...prev, option]
    );
  };

  useEffect(() => {
    if (question) {
      setInputValue('');
      setSelectedOptions([]);
    }
  }, [question]);

  if (!question) {
    return null;
  }

  const renderAnswerInput = (type: AnswerType) => {
    switch (type) {
      case 'numeric':
        return (
          <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-sm">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isAnswered}
              className="flex-grow bg-white border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              placeholder="Enter a number..."
            />
            <button
              type="submit"
              disabled={isAnswered || !inputValue}
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              Submit
            </button>
          </form>
        );
      
      case 'multiple-choice':
        return (
          <div className="flex flex-wrap gap-3">
            {question.options?.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                disabled={isAnswered}
                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                {option}
              </button>
            ))}
          </div>
        );

      case 'multiple-select':
        return (
             <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col gap-3">
                    {question.options?.map((option) => (
                        <label key={option} className={`flex items-center gap-3 p-3 rounded-lg transition-colors border ${isAnswered ? 'cursor-not-allowed bg-gray-100/50' : 'cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-200'}`}>
                            <input
                                type="checkbox"
                                value={option}
                                checked={selectedOptions.includes(option)}
                                onChange={() => handleCheckboxChange(option)}
                                disabled={isAnswered}
                                className="w-5 h-5 rounded text-indigo-600 bg-gray-100 border-gray-300 focus:ring-indigo-500 disabled:opacity-50"
                            />
                            <span className={isAnswered ? 'text-gray-500' : 'text-gray-800'}>{option}</span>
                        </label>
                    ))}
                </div>
                <button
                    type="submit"
                    disabled={isAnswered || selectedOptions.length === 0}
                    className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                >
                    Submit
                </button>
            </form>
        );

      case 'click-on-graph':
        return (
            <div className="p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-600">
                Interact with the graph above to submit your answer.
            </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
      <div className="flex justify-between items-start">
        <p className="text-xl text-gray-700 font-medium">{question.text}</p>
        <button 
          onClick={onGetHint} 
          disabled={isHintLoading || !!hint} 
          className="flex items-center gap-2 text-sm text-sky-600 hover:text-sky-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <BrainCircuitIcon className={`w-5 h-5 ${isHintLoading ? 'animate-pulse' : ''}`} />
          {isHintLoading ? 'Thinking...' : 'Get a Hint'}
        </button>
      </div>
      
      {hint && (
        <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg text-sky-800 text-sm animate-fade-in">
          <span className="font-semibold">Hint:</span> {hint}
        </div>
      )}
      
      <div className="pt-2">{renderAnswerInput(question.answerType)}</div>
    </div>
  );
};