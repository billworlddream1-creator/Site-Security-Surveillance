
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysis } from "../types";

export const performAIAnalysis = async (url: string): Promise<AIAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Analyze the website with URL: ${url}. 
  Provide a detailed report on its potential performance characteristics, security strengths, and vulnerabilities. 
  Specifically look for:
  1. Performance strengths and weaknesses.
  2. Potential security breaches or common vulnerabilities associated with such sites.
  3. Cyber crime activity detection (simulated common patterns).
  4. Specific recommendations for improvement.
  5. A structured list of 3-5 specific vulnerabilities (simulated for this URL type) with remediation steps.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          strengths: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of architectural or performance strengths."
          },
          weaknesses: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of weaknesses or performance bottlenecks."
          },
          securityConcerns: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Identified security risks or vulnerabilities."
          },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Actionable steps to improve the site."
          },
          cyberCrimeDetection: {
            type: Type.STRING,
            description: "Summary of potential cyber crime patterns or risks detected."
          },
          vulnerabilities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                severity: { type: Type.STRING, enum: ['critical', 'high', 'medium', 'low'] },
                status: { type: Type.STRING, enum: ['detected'] },
                remediation: { type: Type.STRING }
              },
              required: ["id", "title", "description", "severity", "status", "remediation"]
            }
          }
        },
        required: ["strengths", "weaknesses", "securityConcerns", "recommendations", "cyberCrimeDetection", "vulnerabilities"]
      }
    }
  });

  return JSON.parse(response.text.trim());
};
