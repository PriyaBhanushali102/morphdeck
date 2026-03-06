import dotenv from "dotenv";
dotenv.config();

import generateSlideContent from "./services/aiService.js";
console.log("GEMINI KEY:", process.env.GEMINI_API_KEY?.slice(0, 10));

const test = async () => {
  const result = await generateSlideContent(
    "global warming",
    5,
    "",
    "professional",
    "",
  );

  console.log("RAW AI RESPONSE:\n", result);
};

test();
