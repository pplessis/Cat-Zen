import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getCatWisdom = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "Tu es un vieux chat sage, philosophe et très détendu. Tu parles doucement, avec des métaphores félines (siestes, rayons de soleil, chasse imaginaire). Ton but est de relaxer l'utilisateur (qui est un chat ou son propriétaire). Réponds en français, de manière poétique et brève.",
        thinkingConfig: { thinkingBudget: 0 } // Low latency preferred for this simple chat
      },
    });
    
    return response.text || "Ronronnement... (Le sage médite)";
  } catch (error) {
    console.error("Error fetching cat wisdom:", error);
    return "Miaulement d'erreur... Essayez plus tard.";
  }
};
