
export type Topic = string;

export interface TopicNode {
  name: Topic;
  subtopics?: TopicNode[];
}

export interface Point {
  x: number;
  y: number;
}

// Added 'multiple-select' for checkbox-style questions and 'click-on-graph' for interactive graph questions.
export type AnswerType = 'multiple-choice' | 'numeric' | 'multiple-select' | 'click-on-graph';

export interface Question {
  id: number;
  topic: Topic;
  text: string;
  // A string representation of the function for display
  functionString: string; 
  // The string body of the function from the data source, e.g. "x*x" or "null" for conceptual questions
  functionBody: string;
  // The actual JS function to generate data points
  functionDefinition: (x: number) => number | null; 
  answerType: AnswerType;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  // The domain [min, max] and step for generating graph points
  domain: [number, number]; 
  step: number;
  // Optional points to highlight on the graph for 'click-on-graph' questions
  highlightPoints?: {x: number; y: number; label: string}[];
}
