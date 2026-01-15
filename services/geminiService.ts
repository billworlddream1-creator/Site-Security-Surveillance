
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysis } from "../types";

export const performAIAnalysis = async (url: string): Promise<AIAnalysis> => {
  // Always initialize GoogleGenAI with the API key from environment variables.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Analyze the website with URL: ${url}. 
  Provide a detailed report on its potential performance characteristics, security strengths, and vulnerabilities. 
  Specifically look for:
  1. Performance strengths and weaknesses.
  2. Potential security breaches or common vulnerabilities associated with such sites.
  3. Cyber crime activity detection (simulated common patterns).
  4. Specific recommendations for improvement.
  5. A structured list of 3-5 specific vulnerabilities (simulated for this URL type). 
     For each vulnerability, provide:
     - A clear title and description.
     - Severity (critical, high, medium, low).
     - A general remediation summary.
     - A list of at least 3-5 detailed, step-by-step technical remediation instructions.`;

  // Fix: Used gemini-3-pro-preview for complex reasoning tasks as per guidelines.
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
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
                remediation: { type: Type.STRING },
                detailedSteps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Step-by-step technical instructions to fix the vulnerability."
                }
              },
              required: ["id", "title", "description", "severity", "status", "remediation", "detailedSteps"]
            }
          }
        },
        required: ["strengths", "weaknesses", "securityConcerns", "recommendations", "cyberCrimeDetection", "vulnerabilities"]
      }
    }
  });

  // Extract text directly using the .text property from GenerateContentResponse.
  const parsed = JSON.parse(response.text.trim());
  
  // Inject detectedAt timestamp for simulation consistency
  if (parsed.vulnerabilities) {
    const now = new Date();
    parsed.vulnerabilities = parsed.vulnerabilities.map((v: any, idx: number) => ({
      ...v,
      detectedAt: new Date(now.getTime() - (idx * 1000 * 60 * 15)).toISOString()
    }));
  }

  return parsed;
};
