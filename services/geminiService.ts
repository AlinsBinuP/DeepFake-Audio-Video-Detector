import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, SummaryOptions } from "../types";

const apiKey = import.meta.env.VITE_API_KEY;
if (!apiKey) {
  console.warn("Missing VITE_API_KEY in environment variables. AI features will not work.");
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

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

// Extract text from PDF files
const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    // Dynamically import pdfjs-dist
    const pdfjsLib = await import('pdfjs-dist');

    // Set worker path
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Load PDF document
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';

    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n\n';
    }

    return fullText.trim();
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF file.');
  }
};

// Read text from TXT files
const readTextFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const analyzeMedia = async (file: File): Promise<AnalysisResult> => {
  try {
    const base64Data = await fileToBase64(file);
    const mimeType = file.type;

    const modelId = "gemini-pro-vision";

    if (!ai) {
      throw new Error("API Key is missing. Please set VITE_API_KEY in .env file.");
    }

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
            Analyze the provided media file with **MAXIMUM SEVERITY**. 
            
            **CRITICAL INSTRUCTION:** Your default assumption MUST be that the media is **FAKE**. It is only "Real" if it proves itself to be flawless.
            
            **Aggressively hunt for these specific AI artifacts:**
            1.  **Micro-Expressions & Blinking:** Does the person blink naturally? Do they have subtle micro-expressions? (Deepfakes often have "dead" or unmoving eyes).
            2.  **Skin Texture:** Look for "plastic" smoothing, lack of pores, or inconsistent texture between face and neck. **Perfect skin is SUSPICIOUS.**
            3.  **Teeth & Tongue:** Are individual teeth defined? Does the tongue move naturally during speech? (AI often blurs inside the mouth).
            4.  **Physics & Lighting:** Do hair strands move correctly? Do shadows align perfectly with light sources?
            5.  **Audio-Visual Sync:** Even a 100ms delay in lip sync is a sign of manipulation.

            **Scoring Rules (0-100):**
            - **0-30 (Definite Fake):** Obvious artifacts, blurring, or robotic voice.
            - **31-60 (Likely Fake):** Looks "too perfect", slight lip sync issues, or uncanny valley feel.
            - **61-80 (Suspicious):** Mostly real but has 1-2 minor oddities.
            - **81-100 (Verified Real):** Flawless, organic, with natural imperfections (sweat, pores, micro-movements).

            **Verdict Logic:**
            - If Score < 70, Verdict MUST be 'DEEPFAKE DETECTED'.
            - If Score >= 70, Verdict is 'REAL'.

            Provide a short reasoning (max 2 sentences) focusing on the *most suspicious* element found.`,
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
    throw new Error(error instanceof Error ? error.message : "Failed to analyze media.");
  }
};

export const generateEssay = async (file: File, prompt?: string): Promise<string> => {
  try {
    const base64Data = await fileToBase64(file);
    const mimeType = file.type;
    const modelId = "gemini-2.5-flash";

    if (!ai) {
      throw new Error("API Key is missing. Please set VITE_API_KEY in .env file.");
    }

    const response = await ai.models.generateContent({
      model: modelId,
      contents: [
        {
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
      ],
    });

    return response.text || "Failed to generate essay.";
  } catch (error) {
    console.error("Essay Generation Error:", error);
    // Log more details for debugging
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    throw new Error(error instanceof Error ? error.message : "Failed to generate essay.");
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    // Since the user's API key does not have access to Imagen 3 (common for free tier),
    // we use Pollinations.ai (Flux model) which provides high-quality, free image generation.
    // This ensures the feature works beautifully for the user immediately.

    const encodedPrompt = encodeURIComponent(prompt);
    // Use Flux model for high quality, realistic images
    const imageUrl = `https://pollinations.ai/p/${encodedPrompt}?width=1024&height=1024&seed=${Math.floor(Math.random() * 1000)}&model=flux`;

    // Pre-load the image using standard HTML Image object to avoid CORS issues with fetch
    await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => reject(new Error("Failed to load image from provider"));
      img.src = imageUrl;
    });

    // Return the URL directly
    return imageUrl;

  } catch (error) {
    console.error("Image Generation Error:", error);
    throw new Error("Failed to generate image. Please try again.");
  }
};

export const summarizeDocument = async (content: File | string, options: SummaryOptions): Promise<string> => {
  try {
    const modelId = "gemini-2.5-flash";

    if (!ai) {
      throw new Error("API Key is missing. Please set VITE_API_KEY in .env file.");
    }

    let textContent = '';

    // Extract text based on input type
    if (typeof content === 'string') {
      textContent = content;
    } else {
      // Handle file inputs
      if (content.type === 'application/pdf') {
        // Extract text from PDF
        textContent = await extractTextFromPDF(content);
      } else if (content.type === 'text/plain') {
        // Read text file
        textContent = await readTextFile(content);
      } else {
        throw new Error('Unsupported file type. Please upload a PDF or TXT file.');
      }
    }

    // Prepare the prompt with the extracted text
    const lengthGuide = {
      short: '2-3 sentences',
      medium: '1-2 paragraphs',
      long: '3-4 paragraphs'
    };

    const formatGuide = {
      paragraph: 'Write the summary as flowing paragraphs.',
      'bullet-points': 'Format the summary as bullet points with key takeaways.'
    };

    const prompt = `You are an expert document summarizer.
Please provide a ${lengthGuide[options.length]} summary of the following content.
${formatGuide[options.format]}

Ensure the summary is accurate, well-structured, and captures the main ideas.

Content to summarize:
${textContent}`;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [{ text: prompt }],
      },
    });

    return response.text || "Failed to generate summary.";
  } catch (error) {
    console.error("Summarization Error:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to summarize document.");
  }
};

export const analyzeScene = async (file: File): Promise<{
  description: string;
  objects: string[];
  text_content: string;
  colors: string[];
}> => {
  try {
    const base64Data = await fileToBase64(file);
    const mimeType = file.type;
    const modelId = "gemini-2.5-flash";

    if (!ai) {
      throw new Error("API Key is missing. Please set VITE_API_KEY in .env file.");
    }

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
            text: `Analyze this image in detail. Provide a structured response with:
            1. A detailed description of the scene (2-3 sentences).
            2. A list of main objects detected.
            3. Any text found in the image (OCR).
            4. The dominant colors in the image.
            
            Return ONLY valid JSON.`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            objects: { type: Type.ARRAY, items: { type: Type.STRING } },
            text_content: { type: Type.STRING },
            colors: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["description", "objects", "text_content", "colors"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text);
    } else {
      throw new Error("No response from AI");
    }
  } catch (error) {
    console.error("Scene Analysis Error:", error);
    throw new Error("Failed to analyze scene.");
  }
};

export const summarizeYouTubeVideo = async (transcript: string, videoTitle: string): Promise<{
  summary: string;
  keyPoints: string[];
  timestamps: { time: string; topic: string }[];
  studyNotes: string;
}> => {
  try {
    const modelId = "gemini-2.5-flash";

    if (!ai) {
      throw new Error("API Key is missing. Please set VITE_API_KEY in .env file.");
    }

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            text: `You are an expert educational assistant helping students study. Analyze this video transcript and create comprehensive study notes.

Video Title: ${videoTitle}

Transcript:
${transcript}

Generate structured study notes with:
1. A concise summary (2-3 sentences)
2. Key points (5-7 main takeaways)
3. Important timestamps with topics (if timestamps are present in transcript)
4. Detailed study notes in markdown format with sections, bullet points, and important concepts highlighted

Return ONLY valid JSON.`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            timestamps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING },
                  topic: { type: Type.STRING }
                }
              }
            },
            studyNotes: { type: Type.STRING },
          },
          required: ["summary", "keyPoints", "timestamps", "studyNotes"],
        },
      },
    });

    const responseText = response.text;
    if (responseText) {
      // Clean the response text: remove markdown code blocks if present
      const cleanText = responseText.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanText);
    } else {
      throw new Error("No response from AI");
    }
  } catch (error) {
    console.error("YouTube Summarization Error:", error);
    // Return a more specific error message if possible
    if (error instanceof Error) {
      if (error.message.includes("API key not valid") || error.message.includes("API_KEY_INVALID")) {
        throw new Error("Invalid API Key. Please check your .env file and ensure VITE_API_KEY is correct.");
      }
      throw new Error(`Failed to summarize video: ${error.message}`);
    }
    throw new Error("Failed to summarize video due to an unexpected error.");
  }
};
