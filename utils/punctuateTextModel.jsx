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

IMPORTANT:

- The JSON above contains ALL valid rooms.
- The JSON above contains ALL valid subsections.
- You MUST use room names exactly as provided.
- You MUST use subsection names exactly as provided.
- Never create a new room name.
- Never create a new subsection name.
- Every observation must be assigned to one room and one subsection.
- Choose the most relevant subsection from the available subsections of that room.
- Return VALID JSON ONLY.
- No markdown.
- No explanation.

Example:

Input:
"The room is dirty of bedroom 1"

Output:
{
  "Bedroom 1": {
    "Room Items": [
      "The room is dirty."
    ]
  }
}

Input:
"Check all furniture and furnishings and note their condition of bedroom 1"

Output:
{
  "Bedroom 1": {
    "Furniture & Furnishing": [
      "Check all furniture and furnishings and note their condition."
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
    console.log(
  'Gemini Raw Response:',
  JSON.stringify(data, null, 2)
);

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