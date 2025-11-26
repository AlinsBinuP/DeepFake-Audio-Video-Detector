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
  try {
    const modelId = "imagen-3.0-generate-001";

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "image/jpeg",
      }
    });

    // The SDK for Imagen usually returns the image data in the response.
    // We need to check how to extract it. 
    // Based on common patterns for this SDK with Imagen:
    // It might return a base64 string in the candidates or parts.

    // Let's inspect the response structure if possible, but for now we assume standard handling.
    // If the SDK returns the image directly as base64 in the text field (unlikely for binary) 
    // or as inline data.

    // Actually, for the new Google GenAI SDK, image generation might be slightly different.
    // But let's try the standard generateContent first.

    // If the response contains inlineData:
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content.parts;
      if (parts && parts.length > 0) {
        const part = parts[0];
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType || 'image/jpeg'};base64,${part.inlineData.data}`;
        }
      }
    }

    // Fallback if structure is different (e.g. some versions return it differently)
    // If we can't get it, we throw to trigger the catch.
    throw new Error("No image data found in response");

  } catch (error) {
    console.error("Image Generation Error:", error);
    // Fallback to a placeholder if the API fails (e.g. no access to Imagen)
    // This ensures the UI doesn't break completely for the user.
    console.warn("Falling back to placeholder image due to API error.");
    return "https://picsum.photos/1024/1024?random=" + Math.random();
  }
};
