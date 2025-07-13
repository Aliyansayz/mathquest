import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot, Label } from 'recharts';
import type { Question, Point } from '../types';

interface GraphProps {
  question: Question | null;
  isAnswered: boolean;
  userAnswer?: string;
  onSubmitAnswer: (answer: string) => void;
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow-lg text-sm">
          <p className="label">{`x : ${label.toFixed(2)}`}</p>
          <p className="intro">{`f(x) : ${payload[0].value.toFixed(2)}`}</p>
        </div>
      );
    }
  
    return null;
};

export const Graph: React.FC<GraphProps> = ({ question, isAnswered, userAnswer, onSubmitAnswer }) => {
  const data = useMemo<Point[]>(() => {
    if (!question) return [];
    const points: Point[] = [];
    const [min, max] = question.domain;
    const step = question.step;
    for (let x = min; x <= max; x += step) {
      const y = question.functionDefinition(x);
      // Check if functionBody is not "null" before pushing points
      if (y !== null && Number.isFinite(y) && question.functionBody !== 'null') {
        points.push({ x: parseFloat(x.toPrecision(10)), y: parseFloat(y.toPrecision(10)) });
      } else if (question.functionBody !== 'null') {
        // Add a point with null `y` to create a break in the line for undefined values
        points.push({ x: parseFloat(x.toPrecision(10)), y: null });
      }
    }
    return points;
  }, [question]);
  
  const handleChartClick = (e: any) => {
    if (!question || isAnswered || question.answerType !== 'click-on-graph') {
      return;
    }
    // The payload of the nearest data point to the click
    if (e?.activePayload?.[0]?.payload) {
        const clickedPoint = e.activePayload[0].payload;
        // Don't register clicks on gaps in the function
        if(clickedPoint.y !== null) {
            onSubmitAnswer(JSON.stringify(clickedPoint));
        }
    }
  }

  const userClickedPoint = useMemo(() => {
    if (question?.answerType === 'click-on-graph' && userAnswer) {
      try {
        return JSON.parse(userAnswer);
      } catch {
        return null;
      }
    }
    return null;
  }, [userAnswer, question]);

  if (!question) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200">
        <p className="text-gray-500">Select a topic to begin.</p>
      </div>
    );
  }

  const isConceptual = data.length === 0;

  return (
    <div className="flex-1 flex flex-col p-4 bg-white border border-gray-200 rounded-xl shadow-sm min-h-[400px]">
      <h2 className="text-2xl font-bold text-indigo-600 mb-2 text-center">{question.functionString}</h2>
       {isConceptual ? (
        <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">This is a conceptual question. No graph is needed for this step.</p>
        </div>
      ) : (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          onClick={handleChartClick}
          className={question.answerType === 'click-on-graph' && !isAnswered ? 'cursor-crosshair' : ''}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="x" 
            type="number" 
            stroke="#6b7280" 
            domain={question.domain}
            label={{ value: 'x-axis', position: 'insideBottom', offset: -15, fill: '#6b7280' }}
          />
          <YAxis 
            stroke="#6b7280" 
            allowDataOverflow={true}
            label={{ value: 'y-axis', angle: -90, position: 'insideLeft', offset: -5, fill: '#6b7280' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="y"
            stroke="#4f46e5"
            strokeWidth={3}
            dot={false}
            connectNulls={false}
          />
           {/* Show the correct highlighted points once answered */}
          {isAnswered && question.highlightPoints?.map(p => (
            <ReferenceDot key={`correct-${p.x}`} x={p.x} y={p.y} r={6} fill="#16a34a" stroke="white">
                <Label value={p.label} position="top" fill="#15803d" offset={10} />
            </ReferenceDot>
          ))}
          {/* Show the user's click */}
          {userClickedPoint && (
            <ReferenceDot 
                key={`user-${userClickedPoint.x}`} 
                x={userClickedPoint.x} 
                y={userClickedPoint.y} 
                r={6} 
                fill={isAnswered && question.correctAnswer === userAnswer ? "#16a34a" : "#dc2626"} 
                stroke="white"
                strokeOpacity={0.5}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
      )}
    </div>
  );
};