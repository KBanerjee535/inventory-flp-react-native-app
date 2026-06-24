import { GOOGLE_GEMINI_FREE_KEY } from '../app_url';

export const punctuateTextWithAI = async (text, retries = 2) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GOOGLE_GEMINI_FREE_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `
You are helping a property inspector.

Rules:
1. Add punctuation and capitalization.
2. Split separate observations into sentences.
3. DO NOT change any words.
4. Return plain text only.
5. No markdown.
6. No explanation.

Text:
${text}
                    `,
                  },
                ],
              },
            ],
            generationConfig: { temperature: 0 },
          }),
        }
      );

      const data = await response.json();

      return data?.candidates?.[0]?.content?.parts?.[0]?.text || text;
    } catch (error) {
      console.log(`Gemini network error (attempt ${attempt + 1}):`, error);
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
        continue;
      }
      return text;
    }
  }
  return text;
};