
import type { TopicNode } from './types';

export const COURSES: TopicNode[] = [
  {
    name: 'Pre-Calculus',
    subtopics: [
      { name: 'Functions and Graphs' },
      { name: 'Rate of Change' },
      { name: 'Introduction to Limits' },
    ],
  },
  {
    name: 'Differential Calculus (Calculus I)',
    subtopics: [
      { name: 'Limits and Continuity' },
      { name: 'The Derivative' },
      { name: 'Differentiation Rules' },
      { name: 'Applications of the Derivative' },
    ],
  },
  {
    name: 'Integral Calculus (Calculus II)',
    subtopics: [
      { name: 'Integration' },
      { name: 'The Fundamental Theorem of Calculus' },
      { name: 'Techniques of Integration' },
      { name: 'Applications of Integration' },
    ],
  },
];