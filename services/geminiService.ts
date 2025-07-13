
import { GoogleGenAI } from "@google/genai";
import type { Question } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getHintFromGemini = async (question: Question): Promise<string> => {
  const prompt = `
    You are a friendly and encouraging math tutor for high school students.
    A student is working on a problem about the function ${question.functionString}.
    The question is: "${question.text}".
    
    Provide a short, single-sentence hint to guide the student towards the correct concept or approach. 
    Do NOT give away the answer or perform the calculation. The hint should be conceptual.
    
    Example:
    If the question is "What is the limit of f(x) as x approaches 2?", a good hint would be "Think about what value the function gets closer and closer to as x gets infinitely near 2 from both sides."
    A bad hint would be: "The answer is 4."
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.5,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating hint from Gemini:", error);
    return "I'm having trouble thinking of a hint right now. Try to think about the core definition of the topic!";
  }
};
