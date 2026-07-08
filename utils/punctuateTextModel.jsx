import { GOOGLE_GEMINI_FREE_KEY } from '../app_url';
import Toast from 'react-native-simple-toast';

export const punctuateTextWithAI = async (text, retries = 2) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_GEMINI_FREE_KEY}`,
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
      Toast.show({
        type: 'error',
        text1: `Gemini network error (attempt ${attempt + 1}):`, error,
      });
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_GEMINI_FREE_KEY}`,
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

Available inspection sections:

${structure}

Rules:

- Use ONLY section names provided.
- Use ONLY subsection names provided.
- Never invent a section.
- Never invent a subsection.
- Every observation must belong to exactly one section.
- If a section has subsections, select the best matching subsection.
- If a section has no subsections, place the note directly under that section.
- If the inspection note contains multiple observations,
- split them into separate notes before categorization.

Example:

Input:
"The curtains are torn and one leg of the bed is broken in bedroom 1"

Output:
{
  "Bedroom 1": {
    "Furniture & Furnishing": [
      "The curtains are torn.",
      "One leg of the bed is broken."
    ]
  }
}

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
  "Bedroom 2": {
    "Furniture & Furnishing": [
      "Check all furniture and furnishings and note their condition."
    ]
  }
}

Input:
"The oven is not heating"

Output:
{
  "Kitchen": {
    "Appliances": [
      "The oven is not heating."
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
    data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!result) {
        throw new Error(
          'Gemini returned empty response'
        );
      }


    // Gemini sometimes returns ```json ... ```
    result = result
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    return JSON.parse(result);
  } catch (error) {
    console.log('Categorization error:', error);
    Toast.show({
      type: 'error',
      text1: 'Categorization error:',
      text2: error.message || String(error),
    });
    return {};
  }
};