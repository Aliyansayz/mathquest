import { Topic, Question } from '../types';

// This is the shape of the data we get from our JSON file.
// It includes a `functionBody` string instead of a callable function.
type ApiQuestion = Omit<Question, 'functionDefinition'> & {
  functionBody: string;
};

/**
 * Creates a JavaScript function from a string representation of its body.
 * This is safer than `eval()` because the code is executed in a restricted scope.
 * @param body - The string body of the function, e.g., "x * x".
 * @returns A callable JavaScript function `(x: number) => number | null`.
 */
const createFunctionFromString = (body: string): ((x: number) => number | null) => {
  try {
    // We create a new function that takes 'x' as an argument.
    // It calculates the result and returns null for non-finite values (like NaN from 0/0 or Infinity),
    // which the graphing library uses to represent gaps in the function's plot.
    return new Function('x', `
      try {
        const result = ${body};
        if (Number.isNaN(result) || !Number.isFinite(result)) {
          return null;
        }
        return result;
      } catch (e) {
        return null; // Return null if any math error occurs (e.g., log of negative)
      }
    `) as (x: number) => number | null;
  } catch (e) {
    console.error(`Failed to create function from string: "${body}"`, e);
    // Return a function that always returns null if creation fails.
    return () => null;
  }
};


export const getQuestionsByTopic = async (topic: Topic): Promise<Question[]> => {
  try {
    const response = await fetch('/questions.json');
    if (!response.ok) {
      throw new Error(`Network response was not ok. Status: ${response.status}`);
    }
    const allQuestions: Record<Topic, ApiQuestion[]> = await response.json();
    const apiQuestions = allQuestions[topic] || [];

    if (apiQuestions.length === 0) {
      console.warn(`No questions found for topic: ${topic}`);
    }

    // The backend sends data that's almost a Question, but `functionDefinition` is missing.
    // We map over the raw API data and transform it into the `Question` type our app uses.
    const questions: Question[] = apiQuestions.map((apiQuestion) => ({
      ...apiQuestion,
      // Here we create the real JavaScript function from the string body.
      functionDefinition: createFunctionFromString(apiQuestion.functionBody),
    }));

    return questions;
  } catch (error) {
    console.error("Could not fetch or process questions:", error);
    // Inform the user that something went wrong.
    // The UI should handle an empty array gracefully.
    alert("Failed to load questions for the topic. Please check the console for errors.");
    return [];
  }
};
