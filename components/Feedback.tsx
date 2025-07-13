import React from 'react';

interface FeedbackProps {
  isCorrect: boolean;
  explanation: string;
}

export const Feedback: React.FC<FeedbackProps> = ({ isCorrect, explanation }) => {
  const bgColor = isCorrect ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400';
  const textColor = isCorrect ? 'text-green-800' : 'text-red-800';
  const title = isCorrect ? 'Correct!' : 'Not Quite!';

  return (
    <div className={`p-4 border rounded-lg ${bgColor} animate-fade-in space-y-3`}>
      <h3 className={`text-2xl font-bold ${textColor}`}>{title}</h3>
      <p className="text-gray-700">{explanation}</p>
    </div>
  );
};