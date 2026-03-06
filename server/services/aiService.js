import { GoogleGenAI } from "@google/genai";
import AppError from "../utilities/AppError.js";
import wrapAsync from "../utilities/wrapAsync.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = "gemini-3-flash-preview";

const cleanAndParseJSON = (text) => {
  if (!text) throw new Error("Empty response from AI");
  return JSON.parse(
    text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim(),
  );
};

const generateContent = async (contents, config = {}) => {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents,
    config,
  });
  return response.text;
};

export const parsePresentationRequest = async (userText) => {
  try {
    const text = await generateContent(
      `Role: You are an API Parameter Extractor.
       Task: Analyze the User Input and extract presentation parameters.
       User Input: "${userText}"
       Available Templates:
       - "modern_blue" (Keywords: modern, blue, corporate, clean, tech)
       - "college_classic" (Keywords: college, classic, academic, simple, university)
       Output JSON Schema:
       {
         "topic": "The main subject (String). If not specified, infer it.",
         "slideCount": "Number of slides (Integer). Default to 5 if not mentioned. Max 20.",
         "tone": "The tone e.g., Professional, Funny, Minimalist (String). Default Professional.",
         "detail": "Content depth e.g., High, Moderate, Low (String). Default Moderate.",
         "instructions": "Any specific requests like no jargon, focus on costs (String). Default ''.",
         "templateId": "One of the available template IDs based on keywords. Default modern_blue."
       }`,
      { responseMimeType: "application/json", temperature: 0.1 },
    );
    return cleanAndParseJSON(text);
  } catch {
    return {
      topic: userText,
      slideCount: 5,
      tone: "Professional",
      detail: "Moderate",
      instructions: "",
      templateId: "modern_blue",
    };
  }
};

export const generateSlideContent = async (
  topic,
  slideCount,
  detail,
  tone,
  instructions,
) => {
  try {
    const text = await generateContent(
      `You are a world-class presentation designer and subject matter expert.
       Create a ${tone} presentation on: "${topic}".
       Detail level: ${detail} | Slide count: ${slideCount} | Instructions: ${instructions}

       STRICT OUTPUT RULES:
       - Return ONLY a valid JSON array with EXACTLY ${slideCount} slide objects.
       - No markdown, no explanation, no text outside the JSON array.
       - First slide must be "Introduction", last slide must be "Conclusion".

       CONTENT QUALITY RULES:
       - Each bullet point should be 8-12 words — meaningful but scannable.
       - Write like a real PowerPoint: one clear idea per bullet, no full paragraphs.
       - Minimum 4 bullet points per slide, no hard maximum.
       - Avoid repetition across slides.
       - Make content specific to "${topic}".

       LAYOUT RULES — choose exactly one per slide:
       1. "title_center" : First and last slide only.
       2. "split_right"  : Physical object, person, or concept needing image on right.
       3. "split_left"   : Same as split_right for visual variety.
       4. "default"      : Data-heavy or complex slides needing full-width text.

       JSON Schema per slide:
       { "title": "string", "content": ["bullet1", "bullet2", "..."], "layout": "string" }`,
      {
        systemInstruction:
          "You are an expert presentation architect. Always return valid JSON array only. Never truncate.",
        temperature: 0.4,
        responseMimeType: "application/json",
      },
    );
    return cleanAndParseJSON(text);
  } catch {
    throw new AppError("AI Generation Failed", 500);
  }
};

const REWRITE_PROMPTS = {
  punchy:
    "Rewrite this presentation bullet point to be extremely punchy, energetic, and short (under 10 words).",
  expand:
    "Expand this brief thought into a complete, professional presentation bullet point (around 15-20 words).",
  default:
    "Rewrite the following presentation bullet point. Keep it concise, professional, and under 12 words.",
};

export const rewriteText = wrapAsync(async (req, res) => {
  const { text, tone } = req.body;
  console.log("📥 rewrite body:", { text, tone }); // ← add this
  console.log("📥 prompt key exists:", !!REWRITE_PROMPTS[tone]); // ← add this
  const prompt = `${REWRITE_PROMPTS[tone] || REWRITE_PROMPTS.default}\n\nOriginal text: "${text}"\n\nOnly return the rewritten text, with no quotes or introduction.`;

  try {
    const rawText = await generateContent(prompt);
    res.status(200).json({ success: true, data: rawText.trim() });
  } catch (error) {
    if (error.message?.includes("503"))
      throw new AppError(
        "AI is experiencing high demand. Please try again in a few seconds.",
        503,
      );
    throw new AppError("AI rewrite failed. Please try again.", 500);
  }
});
