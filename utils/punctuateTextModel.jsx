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

export const categorizeInspectionNotes = async (
  text,
  sectionDetails = []
) => {
  try {
    const structure = JSON.stringify(
      sectionDetails.map(room => ({
        room: room.title,
        subsections: room.subsubSection.map(
          sub => sub.title
        ),
      })),
      null,
      2
    );

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GOOGLE_GEMINI_FREE_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
You are helping a property inspector.

Available inspection structure:

${structure}

Rules:
- Use ONLY the room names from the structure.
- Use ONLY the subsection names from the structure.
- Categorize every observation under the correct room and subsection.
- If an observation refers to the room generally, use "Room Items".
- Return VALID JSON ONLY.
- No markdown.
- No explanation.
- Do not wrap JSON in \`\`\`json.

Example:

{
  "Bedroom 1": {
    "Room Items": [
      "The room is dirty."
    ]
  },
  "Bedroom 2": {
    "Windows": [
      "The window handle is broken."
    ]
  }
}

Inspection Notes:

${text}
                  `,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0,
          },
        }),
      }
    );

    const data = await response.json();

    let result =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    // Gemini sometimes returns ```json ... ```
    result = result
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    return JSON.parse(result);
  } catch (error) {
    console.log('Categorization error:', error);
    return {};
  }
};