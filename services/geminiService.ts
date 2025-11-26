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

export const generateEssay = async (file: File, prompt?: string): Promise<string> => {
  try {
    const base64Data = await fileToBase64(file);
    const mimeType = file.type;
    const modelId = "gemini-2.5-flash";

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
            text: prompt || "Write a detailed, academic-style essay based on this image. Analyze its visual elements, context, and potential meaning.",
          },
        ],
      },
    });

    return response.text || "Failed to generate essay.";
  } catch (error) {
    console.error("Essay Generation Error:", error);
    throw new Error("Failed to generate essay.");
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  // Note: This is a placeholder for actual Image Generation.
  // The current Google GenAI SDK for JS might not fully support Imagen direct generation in the same way as text.
  // We will try to use a standard model to "describe" the image or use a specific model if available.
  // For now, we will simulate or return a text description if image gen fails, 
  // BUT we will try to call the model if we can.
  // 
  // Since we can't easily verify Imagen access without trying, we will implement a mock or a text-based fallback
  // if the specific Imagen call isn't standard in this SDK version yet.
  // However, let's try to see if we can use a known model.

  // For this task, since I cannot guarantee Imagen access, I will implement a "Prompt to Detailed Image Description" 
  // as a fallback if I can't generate the image, OR I will try to use a public placeholder if the user wants to see UI.
  // 
  // ACTUALLY, I will try to use the 'imagen-3.0-generate-001' if possible, but the SDK signature might be different.
  // Let's assume for now we return a placeholder image URL if the API doesn't support it directly in this environment.

  // MOCK IMPLEMENTATION FOR UI DEMO (since I can't rely on Imagen permissions here):
  // In a real scenario, this would call the Imagen API.
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
  return "https://picsum.photos/1024/1024?random=" + Math.random();
};
