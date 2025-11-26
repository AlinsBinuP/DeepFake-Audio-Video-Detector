import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the Data-URI prefix (e.g. "data:image/jpeg;base64,")
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const analyzeMedia = async (file: File): Promise<AnalysisResult> => {
  try {
    const base64Data = await fileToBase64(file);
    const mimeType = file.type;

    const modelId = "gemini-2.5-flash"; // Good balance of speed and multimodal capability

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
          {
            text: `You are a forensic media analyst expert in detecting deepfakes, AI-generated content, and digital manipulation. 
            Analyze the provided media file strictly for authenticity. 
            Look for:
            1. Visual artifacts (warping, blurring around face edges, inconsistent lighting).
            2. Audio anomalies (robotic tones, background noise mismatches, lip-sync errors).
            3. AI generation signatures.
            
            Provide a confidence score (0-100) that the media is REAL (100 = definitely real, 0 = definitely fake).
            Determine a verdict: 'REAL' or 'DEEPFAKE DETECTED'.
            Provide a short reasoning (max 2 sentences).`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "Confidence score that the media is real (0-100)" },
            verdict: { type: Type.STRING, enum: ["REAL", "DEEPFAKE DETECTED", "UNCERTAIN"] },
            reasoning: { type: Type.STRING, description: "Brief explanation of the analysis" },
          },
          required: ["score", "verdict", "reasoning"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    } else {
      throw new Error("No response from AI");
    }
  } catch (error) {
    console.error("Analysis Error:", error);
    // Fallback for demo purposes if API fails or blocks content
    throw new Error("Failed to analyze media. Ensure the file is a supported video or audio format.");
  }
};
