import { GOOGLE_GEMINI_FREE_KEY } from '../app_url';
import Toast from 'react-native-simple-toast';

/**
 * Calculate string similarity score using fuzzy matching
 * Returns a score based on word overlap and partial matches
 */
const calculateFuzzyScore = (text, keywords) => {
  if (!keywords || keywords.length === 0) return 0;
  
  const lowerText = text.toLowerCase();
  let totalScore = 0;
  
  keywords.forEach(keyword => {
    const lowerKeyword = keyword.toLowerCase();
    // Exact word match (using word boundaries)
    const regex = new RegExp(`\\b${escapeRegex(lowerKeyword)}\\b`, 'i');
    if (regex.test(text)) {
      totalScore += keyword.length;
    }
    // Partial match (keyword contained in text)
    else if (lowerText.includes(lowerKeyword)) {
      totalScore += keyword.length * 0.5;
    }
  });
  
  return totalScore;
};

/**
 * Check if text contains any of the keywords
 * More lenient matching for better categorization
 */
const containsAnyKeyword = (text, keywords) => {
  if (!keywords || keywords.length === 0) return false;
  
  const lowerText = text.toLowerCase();
  
  return keywords.some(keyword => {
    const lowerKeyword = keyword.toLowerCase();
    // Check if keyword is in text
    if (lowerText.includes(lowerKeyword)) {
      return true;
    }
    // Check for word boundary match
    const regex = new RegExp(`\\b${escapeRegex(lowerKeyword)}\\b`, 'i');
    return regex.test(text);
  });
};

/**
 * Escape special regex characters
 */
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Extract keywords dynamically from section/subsection titles
 * No static synonym map - works with any dynamic section names
 */
const extractDynamicKeywords = (title) => {
  if (!title) return [];
  
  const lowerTitle = title.toLowerCase();
  const keywords = new Set();
  
  // Add the full title
  keywords.add(lowerTitle);
  
  // Add individual words (excluding common stop words)
  const stopWords = ['the', 'and', 'or', 'of', 'for', 'in', 'on', 'at', 'to', 'a', 'an', 'is', 'are', '&', 'with', 'by', 'from'];
  const words = lowerTitle.split(/[\s&]+/).filter(w => w && !stopWords.includes(w) && w.length > 1);
  words.forEach(w => keywords.add(w));
  
  // Special keyword mappings for common terms
  // These help map speech-to-text terms to their corresponding section/subsection titles
  const specialKeywordMappings = {
    'furniture fix': ['curtain', 'curtains', 'fix', 'repair', 'broken', 'damage', 'damaged', 'hinge', 'handle', 'door', 'cabinet', 'drawer', 'shelf', 'furniture'],
    'window': ['window', 'windows', 'glass', 'frame', 'handle', 'lock', 'hinge', 'blind', 'blinds', 'shutter', 'shutters'],
    'furniture': ['furniture', 'curtain', 'curtains', 'fix', 'repair', 'broken', 'damage', 'damaged', 'hinge', 'handle', 'door', 'cabinet', 'drawer', 'shelf']
  };
  
  // Add special keywords based on title match
  Object.keys(specialKeywordMappings).forEach(key => {
    if (lowerTitle.includes(key) || key.includes(lowerTitle)) {
      specialKeywordMappings[key].forEach(kw => keywords.add(kw));
    }
  });
  
  return Array.from(keywords);
};

export const punctuateTextWithAI = async (text, retries = 2) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_GEMINI_FREE_KEY}`,
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
      Toast.show(`Gemini network error (attempt ${attempt + 1}): ${error?.message || String(error)}`);
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
        continue;
      }
      return text;
    }
  }
  return text;
};

/**
 * Split text into sentences for individual categorization
 */
const splitIntoSentences = (text) => {
  if (!text || typeof text !== 'string') return [];
  
  // Split by common sentence delimiters
  const sentences = text
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  return sentences;
};

/**
 * Rule-based categorization of inspection notes using fuzzy string matching
 * Matches text against section/subsection titles and categorizes accordingly
 * Handles multi-sentence text by splitting and categorizing each sentence
 */
export const categorizeInspectionNotes = async (
  text,
  sectionDetails = []
) => {
  try {
    // Build category mapping with dynamic keywords
    const categoryMap = new Map(); // category -> { type, id, sectionId, subSectionId, keywords }
    const sectionsWithSubsections = new Set(); // Track sections that have subsubsections
    
    if (Array.isArray(sectionDetails)) {
      sectionDetails.forEach(section => {
        const sectionTitle = section.title || section.name;
        
        // If subsubsections exist, mark this section as having subsections
        if (section.subsubSection && Array.isArray(section.subsubSection) && section.subsubSection.length > 0) {
          sectionsWithSubsections.add(sectionTitle.toLowerCase());
          
          // Add the parent section to the map as well (for room detection)
          const sectionKeywords = extractDynamicKeywords(sectionTitle);
          categoryMap.set(sectionTitle, {
            type: 'section',
            id: section.id,
            keywords: sectionKeywords
          });
          
          // Add subsubsections with their dynamic keywords
          section.subsubSection.forEach(sub => {
            const subTitle = sub.title || sub.name;
            const keywords = extractDynamicKeywords(subTitle);
            categoryMap.set(subTitle, {
              type: 'subsubsection',
              id: sub.id,
              sectionId: section.id,
              subSectionId: sub.id,
              sectionTitle: sectionTitle,
              keywords: keywords
            });
          });
        } else {
          // Add section without subsections
          const keywords = extractDynamicKeywords(sectionTitle);
          categoryMap.set(sectionTitle, {
            type: 'section',
            id: section.id,
            keywords: keywords
          });
        }
      });
    }

    // Parse input
    const input = typeof text === "string" ? text : JSON.stringify(text, null, 2);
    
    // Check if input is already JSON
    let parsedInput;
    try {
      parsedInput = JSON.parse(input);
    } catch (e) {
      parsedInput = null;
    }

    // If already categorized JSON (flat structure)
    if (parsedInput && !Array.isArray(parsedInput) && typeof parsedInput === 'object') {
      // Check if it's nested bedroom structure
      const firstValue = Object.values(parsedInput)[0];
      if (Array.isArray(firstValue) && firstValue.length > 0 && typeof firstValue[0] === 'object' && !Array.isArray(firstValue[0])) {
        // Nested bedroom structure - return as-is
        return parsedInput;
      } else {
        // Flat structure - return as-is
        return parsedInput;
      }
    }

    // If plain text, split into sentences and categorize each one
    if (typeof text === "string" || !parsedInput) {
      const sentences = splitIntoSentences(text);
      const allCategorized = {};
      
      // If no sentences, treat the whole text as one
      if (sentences.length === 0) {
        return categorizePlainTextFuzzy(text, categoryMap, sectionsWithSubsections);
      }
      
      // Categorize each sentence and merge results
      for (const sentence of sentences) {
        const categorized = categorizePlainTextFuzzy(sentence, categoryMap, sectionsWithSubsections);
        
        // Merge the categorized results
        Object.keys(categorized).forEach(sectionName => {
          if (!allCategorized[sectionName]) {
            allCategorized[sectionName] = {};
          }
          
          const sectionData = categorized[sectionName];
          if (typeof sectionData === 'object' && !Array.isArray(sectionData)) {
            // Nested structure: { "Subsection": ["note"] }
            Object.keys(sectionData).forEach(subName => {
              if (!allCategorized[sectionName][subName]) {
                allCategorized[sectionName][subName] = [];
              }
              if (Array.isArray(sectionData[subName])) {
                allCategorized[sectionName][subName].push(...sectionData[subName]);
              }
            });
          } else if (Array.isArray(sectionData)) {
            // Flat structure: ["note1", "note2"]
            if (!allCategorized[sectionName].__flat__) {
              allCategorized[sectionName].__flat__ = [];
            }
            allCategorized[sectionName].__flat__.push(...sectionData);
          }
        });
      }
      
      return allCategorized;
    }

    return {};
  } catch (error) {
    console.log("Categorization error:", error);
    Toast.show(`Categorization error: ${error.message || String(error)}`);
    return {};
  }
};

/**
 * Categorize plain text notes using fuzzy string matching
 * Returns nested structure: { "Room Name": { "Subsection": ["note"] } }
 */
const categorizePlainTextFuzzy = (text, categoryMap, sectionsWithSubsections) => {
  const result = {};
  const lowerText = text.toLowerCase();
  
  // Step 1: Detect room/section from text (e.g., "kitchen 1", "bedroom 2", "bathroom 1")
  const roomMatch = text.match(/(kitchen|bedroom|room|bathroom)\s*(\d+)/i);
  let detectedRoomTitle = null;
  
  if (roomMatch) {
    const roomType = roomMatch[1].toLowerCase();
    const roomNum = roomMatch[2];
    detectedRoomTitle = `${roomType.charAt(0).toUpperCase() + roomType.slice(1)} ${roomNum}`;
  }
  
  // Step 2: Find all matching subsubsections with fuzzy scores
  const subsectionMatches = [];
  categoryMap.forEach((info, category) => {
    if (info.type === 'subsubsection') {
      const matchScore = calculateFuzzyScore(text, info.keywords);
      if (matchScore > 0) {
        subsectionMatches.push({ category, score: matchScore, info });
      }
    }
  });
  
  // Debug: Log subsection matches
  console.log('Text:', text, 'Subsection matches:', subsectionMatches.map(m => ({ category: m.category, score: m.score })));
  
  // Sort subsection matches by score (highest first)
  subsectionMatches.sort((a, b) => b.score - a.score);
  
  // Step 3: If we have subsection matches, use the best one
  if (subsectionMatches.length > 0) {
    const bestSub = subsectionMatches[0];
    const parentSection = bestSub.info.sectionTitle;
    
    // If we detected a room in the text, prioritize it as the parent
    // This ensures "bathroom 1" in text goes under "Bathroom 1" section
    // even if the subsection is under "Bathroom 2" in the API
    let targetParent = parentSection;
    if (detectedRoomTitle) {
      // Always use the detected room as the parent if we found one
      // This handles cases like "window glass is broken of bathroom 1"
      // where we want the note under "Bathroom 1" even if "Window Glass" is under "Bathroom 2"
      targetParent = detectedRoomTitle;
    }
    
    // Create nested object structure: { "Room": { "Subsection": ["note"] } }
    if (!result[targetParent]) result[targetParent] = {};
    if (!result[targetParent][bestSub.category]) {
      result[targetParent][bestSub.category] = [];
    }
    result[targetParent][bestSub.category].push(text.trim());
    return result;
  }
  
  // Step 4: Find all matching sections (non-subsection)
  const sectionMatches = [];
  categoryMap.forEach((info, category) => {
    if (info.type === 'section') {
      const matchScore = calculateFuzzyScore(text, info.keywords);
      if (matchScore > 0) {
        sectionMatches.push({ category, score: matchScore, info });
      }
    }
  });
  
  sectionMatches.sort((a, b) => b.score - a.score);
  
  // Step 5: If we have section matches
  if (sectionMatches.length > 0) {
    const bestSection = sectionMatches[0];
    const { category } = bestSection;
    
    // Check if this section has subsections
    if (sectionsWithSubsections.has(category.toLowerCase())) {
      // Find the best matching subsection under this section
      const subMatches = [];
      categoryMap.forEach((subInfo, subCategory) => {
        if (subInfo.type === 'subsubsection' && 
            subInfo.sectionTitle.toLowerCase() === category.toLowerCase()) {
          const subMatchScore = calculateFuzzyScore(text, subInfo.keywords);
          if (subMatchScore > 0) {
            subMatches.push({ category: subCategory, score: subMatchScore, info: subInfo });
          }
        }
      });
      
      if (subMatches.length > 0) {
        subMatches.sort((a, b) => b.score - a.score);
        const bestSub = subMatches[0];
        // Create nested object structure: { "Room": { "Subsection": ["note"] } }
        if (!result[category]) result[category] = {};
        if (!result[category][bestSub.category]) {
          result[category][bestSub.category] = [];
        }
        result[category][bestSub.category].push(text.trim());
      } else {
        // No subsection match, use the section itself
        if (!result[category]) result[category] = [];
        result[category].push(text.trim());
      }
    } else {
      // No subsections, use the section
      if (!result[category]) result[category] = [];
      result[category].push(text.trim());
    }
    return result;
  }
  
  // Step 6: Fallback - try to find a room by pattern
  if (roomMatch && detectedRoomTitle) {
    // Check if this room exists as a section
    const roomSection = Array.from(categoryMap.keys()).find(
      key => key.toLowerCase() === detectedRoomTitle.toLowerCase()
    );
    if (roomSection) {
      if (!result[roomSection]) result[roomSection] = [];
      result[roomSection].push(text.trim());
      return result;
    }
  }
  
  // Step 7: Default fallback - put in first available section
  const firstSection = Array.from(categoryMap.keys())[0];
  if (firstSection) {
    if (!result[firstSection]) result[firstSection] = [];
    result[firstSection].push(text.trim());
  }
  
  return result;
};

/**
 * Alternative: More advanced rule-based categorization with priority matching
 * This version gives priority to subsubsections when available
 */
export const categorizeInspectionNotesAdvanced = async (
  text,
  sectionDetails = []
) => {
  try {
    // Build structures
    const subsections = []; // All subsections with their parent section
    const sections = []; // Sections without subsections
    
    if (Array.isArray(sectionDetails)) {
      sectionDetails.forEach(section => {
        const sectionTitle = section.title || section.name;
        
        if (section.subsubSection && Array.isArray(section.subsubSection) && section.subsubSection.length > 0) {
          section.subsubSection.forEach(sub => {
            const subTitle = sub.title || sub.name;
            subsections.push({
              title: subTitle,
              sectionTitle: sectionTitle,
              sectionId: section.id,
              subSectionId: sub.id,
              keywords: extractDynamicKeywords(subTitle)
            });
          });
        } else {
          sections.push({
            title: sectionTitle,
            id: section.id,
            keywords: extractDynamicKeywords(sectionTitle)
          });
        }
      });
    }

    // Parse input
    const input = typeof text === "string" ? text : JSON.stringify(text, null, 2);
    
    // Check if input is already JSON
    let parsedInput;
    try {
      parsedInput = JSON.parse(input);
    } catch (e) {
      parsedInput = null;
    }

    // If already categorized JSON, return as-is
    if (parsedInput && !Array.isArray(parsedInput) && typeof parsedInput === 'object') {
      return parsedInput;
    }

    // If plain text, categorize using fuzzy matching
    if (typeof text === "string" || !parsedInput) {
      return categorizePlainTextAdvancedFuzzy(text, subsections, sections);
    }

    return {};
  } catch (error) {
    console.log("Categorization error:", error);
    Toast.show(`Categorization error: ${error.message || String(error)}`);
    return {};
  }
};

const categorizePlainTextAdvancedFuzzy = (text, subsections, sections) => {
  const result = {};
  
  // Step 1: Detect room/section from text (e.g., "kitchen 1", "bedroom 2", "bathroom 1")
  const roomMatch = text.match(/(kitchen|bedroom|room|bathroom)\s*(\d+)/i);
  let detectedRoomTitle = null;
  
  if (roomMatch) {
    const roomType = roomMatch[1].toLowerCase();
    const roomNum = roomMatch[2];
    detectedRoomTitle = `${roomType.charAt(0).toUpperCase() + roomType.slice(1)} ${roomNum}`;
  }
  
  // First, try to match subsections (higher priority)
  const subsectionMatches = [];
  subsections.forEach(sub => {
    const matchScore = calculateFuzzyScore(text, sub.keywords);
    if (matchScore > 0) {
      subsectionMatches.push({ ...sub, score: matchScore });
    }
  });
  
  if (subsectionMatches.length > 0) {
    subsectionMatches.sort((a, b) => b.score - a.score);
    const bestMatch = subsectionMatches[0];
    
    // If we detected a room in the text, prioritize it as the parent
    // This ensures "bathroom 1" in text goes under "Bathroom 1" section
    // even if the subsection is under "Bathroom 2" in the API
    let targetParent = bestMatch.sectionTitle;
    if (detectedRoomTitle) {
      targetParent = detectedRoomTitle;
    }
    
    // Create nested object structure: { "Room": { "Subsection": ["note"] } }
    if (!result[targetParent]) result[targetParent] = {};
    if (!result[targetParent][bestMatch.title]) {
      result[targetParent][bestMatch.title] = [];
    }
    result[targetParent][bestMatch.title].push(text.trim());
    return result;
  }
  
  // Then try to match sections
  const sectionMatches = [];
  sections.forEach(section => {
    const matchScore = calculateFuzzyScore(text, section.keywords);
    if (matchScore > 0) {
      sectionMatches.push({ ...section, score: matchScore });
    }
  });
  
  if (sectionMatches.length > 0) {
    sectionMatches.sort((a, b) => b.score - a.score);
    const bestMatch = sectionMatches[0];
    if (!result[bestMatch.title]) result[bestMatch.title] = [];
    result[bestMatch.title].push(text.trim());
    return result;
  }
  
  // Fallback: try to detect bedroom/kitchen/bathroom numbers
  if (roomMatch && detectedRoomTitle) {
    // Check if this room exists in subsections
    const roomSubsection = subsections.find(s => s.sectionTitle.toLowerCase() === detectedRoomTitle.toLowerCase());
    if (roomSubsection) {
      if (!result[roomSubsection.sectionTitle]) result[roomSubsection.sectionTitle] = {};
      if (!result[roomSubsection.sectionTitle][roomSubsection.title]) {
        result[roomSubsection.sectionTitle][roomSubsection.title] = [];
      }
      result[roomSubsection.sectionTitle][roomSubsection.title].push(text.trim());
      return result;
    }
    
    // Check if this room exists as a section
    const roomSection = sections.find(s => s.title.toLowerCase() === detectedRoomTitle.toLowerCase());
    if (roomSection) {
      if (!result[roomSection.title]) result[roomSection.title] = [];
      result[roomSection.title].push(text.trim());
      return result;
    }
  }
  
  // Default fallback
  if (subsections.length > 0) {
    // Put in first subsection
    const firstSub = subsections[0];
    if (!result[firstSub.sectionTitle]) result[firstSub.sectionTitle] = {};
    if (!result[firstSub.sectionTitle][firstSub.title]) {
      result[firstSub.sectionTitle][firstSub.title] = [];
    }
    result[firstSub.sectionTitle][firstSub.title].push(text.trim());
  } else if (sections.length > 0) {
    const firstSection = sections[0];
    if (!result[firstSection.title]) result[firstSection.title] = [];
    result[firstSection.title].push(text.trim());
  }
  
  return result;
};

/**
 * Common property item keywords for rule-based extraction
 */
const PROPERTY_ITEM_KEYWORDS = [
  // Bedroom items
  'bed', 'bed frame', 'mattress', 'headboard', 'pillow', 'duvet', 'blanket',
  // Furniture
  'cabinet', 'wardrobe', 'cupboard', 'chest', 'drawer', 'dresser', 'vanity',
  'table', 'desk', 'chair', 'stool', 'bench', 'sofa', 'couch', 'settee',
  'shelf', 'bookshelf', 'rack', 'stand', 'ottoman', 'armoire',
  // Fixtures
  'curtain', 'blind', 'shutter', 'light', 'lamp', 'mirror', 'rug', 'carpet',
  'clock', 'picture', 'painting', 'vase', 'lamp shade',
  // Kitchen
  'fridge', 'refrigerator', 'freezer', 'oven', 'cooker', 'stove', 'hob',
  'microwave', 'dishwasher', 'washing machine', 'dryer', 'kettle', 'toaster',
  'sink', 'tap', 'faucet', 'worktop', 'countertop', 'cupboard',
  // Bathroom
  'toilet', 'bath', 'bathtub', 'shower', 'shower head', 'basin', 'sink',
  'vanity unit', 'cabinet', 'towel rail', 'radiator', 'extractor fan',
  // Windows & Doors
  'window', 'door', 'lock', 'handle', 'hinge', 'frame', 'glass', 'pane',
  'key', 'deadbolt', 'latch',
  // Walls & Floors
  'wall', 'ceiling', 'floor', 'tile', 'grout', 'skirting', 'cornice',
  'paint', 'plaster', 'wallpaper',
  // General
  'counter', 'worktop', 'surface', 'switch', 'socket', 'plug', 'outlet',
  'thermostat', 'heater', 'radiator', 'smoke alarm', 'carbon monoxide detector'
];

/**
 * Condition indicator keywords to split items description from condition
 */
const CONDITION_KEYWORDS = [
  'broken', 'damaged', 'missing', 'cracked', 'stained', 'scratched', 'dented',
  'worn', 'torn', 'ripped', 'faded', 'rusty', 'corroded', 'mouldy', 'moldy',
  'mildew', 'dirty', 'stained', 'discolored', 'discoloured', 'warped', 'bent',
  'buckled', 'loose', 'stuck', 'jammed', 'leaking', 'leak', 'dripping', 'drip',
  'blocked', 'clogged', 'faulty', 'defective', 'not working', 'malfunctioning',
  'inoperative', 'chipped', 'gouged', 'pitted', 'peeling', 'flaking', 'bubbling',
  'sagging', 'drooping', 'separating', 'gapping', 'uneven', 'not level',
  'crack', 'chip', 'dent', 'scratch', 'stain', 'hole', 'tear', 'rip', 'split',
  'handle is', 'hinge is', 'lock is', 'glass is', 'frame is',
  'leg is', 'legs are', 'drawer is', 'door is', 'surface is',
  'needs', 'require', 'requires', 'needs repair', 'needs replacement',
  'in poor condition', 'in bad condition', 'poor condition',
  'damage', 'deterioration', 'corrosion', 'wear and tear'
];

/**
 * Rule-based parsing of property inspection notes into item/condition format
 * 
 * Parses a note like "White painted bed, legs are broken" into:
 * { "bed": { "items": "White painted", "condition": "legs are broken" } }
 * 
 * @param {string} note - The inspection note text
 * @param {string} subsectionTitle - The subsection/category title for context
 * @returns {Object} - { itemName: { items, condition } }
 */
export const parsePropertyNoteToContent = (note, subsectionTitle = '') => {
  if (!note || typeof note !== 'string') return {};
  
  const lowerNote = note.toLowerCase().trim();
  let itemName = null;
  let descriptionPart = note.trim();
  let conditionPart = '';
  
  // Strategy 1: Find known item keyword in the note
  // Sort by length descending to match multi-word items first (e.g., "bed frame" before "bed")
  const sortedKeywords = [...PROPERTY_ITEM_KEYWORDS].sort((a, b) => b.length - a.length);
  
  for (const keyword of sortedKeywords) {
    const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(note)) {
      itemName = keyword;
      break;
    }
  }
  
  // Strategy 2: If no item keyword found, try to extract from the subsection title
  if (!itemName && subsectionTitle) {
    const lowerSubsection = subsectionTitle.toLowerCase();
    for (const keyword of sortedKeywords) {
      const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(lowerSubsection)) {
        itemName = keyword;
        break;
      }
    }
  }
  
  // Strategy 3: Use first word or two as item name as fallback
  if (!itemName) {
    const words = note.trim().split(/\s+/);
    if (words.length >= 2) {
      // Try first two words as item name
      itemName = words[0] + ' ' + words[1];
    } else if (words.length === 1) {
      itemName = words[0];
    } else {
      itemName = 'item';
    }
    // Check if this guessed item name contains condition indicators
    const guessedLower = itemName.toLowerCase();
    if (CONDITION_KEYWORDS.some(kw => guessedLower.includes(kw))) {
      itemName = 'item';
    }
  }
  
  // Extract description and condition from the note
  // Remove the item name from the beginning of the note to get description
  let remainingText = note.trim();
  const itemRegex = new RegExp(`^${itemName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*[,:-]?\\s*`, 'i');
  remainingText = remainingText.replace(itemRegex, '').trim();
  
  // If removing the item name didn't leave anything, try removing from anywhere
  if (!remainingText) {
    remainingText = note.trim();
    // Remove item name wherever it appears
    const removeItemRegex = new RegExp(itemName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    remainingText = remainingText.replace(removeItemRegex, '').trim();
    remainingText = remainingText.replace(/^[,:-]\s*/, '').trim();
    remainingText = remainingText.replace(/[,:-]\s*$/, '').trim();
  }
  
  // Now split remaining text into items (description) and condition
  if (remainingText) {
    // Find condition indicator keywords
    let conditionStartIndex = -1;
    let matchedKeyword = '';
    
    for (const kw of CONDITION_KEYWORDS) {
      const idx = remainingText.toLowerCase().indexOf(kw.toLowerCase());
      if (idx !== -1 && (conditionStartIndex === -1 || idx < conditionStartIndex)) {
        conditionStartIndex = idx;
        matchedKeyword = kw;
      }
    }
    
    if (conditionStartIndex > 0) {
      // Split: description before condition keyword
      descriptionPart = remainingText.substring(0, conditionStartIndex).trim();
      // Clean up trailing comma, colon, dash, "and", "but"
      descriptionPart = descriptionPart.replace(/[,:\-;]\s*$/, '').trim();
      descriptionPart = descriptionPart.replace(/\s+(and|but|however)$/i, '').trim();
      
      conditionPart = remainingText.substring(conditionStartIndex).trim();
    } else {
      // No condition found, put everything in items
      descriptionPart = remainingText;
      conditionPart = '';
    }
  }
  
  // Clean up description - remove leading/trailing punctuation and whitespace
  descriptionPart = descriptionPart.replace(/^[,\s]+/, '').replace(/[,\s]+$/, '').trim();
  conditionPart = conditionPart.replace(/^[,\s]+/, '').replace(/[,\s]+$/, '').trim();
  
  // Capitalize first letter of each part
  if (descriptionPart) {
    descriptionPart = descriptionPart.charAt(0).toUpperCase() + descriptionPart.slice(1);
  }
  if (conditionPart) {
    conditionPart = conditionPart.charAt(0).toUpperCase() + conditionPart.slice(1);
  }
  
  // Create the result object
  const itemKey = itemName.toLowerCase().replace(/\s+/g, '_');
  return {
    [itemKey]: {
      items: descriptionPart || note.trim(),
      condition: conditionPart || ''
    }
  };
};

/**
 * Helper function to get notes for a specific section and subsection
 * This is used by the display component to fetch notes dynamically
 * Handles both formats:
 * - { "Room": { "Subsection": ["note"] } } - nested object format
 * - { "Room": ["note"] } - flat array format (for sections without subsubsections)
 */
export const getNotesForSection = (categorizedNotes, sectionTitle, subsectionTitle = null) => {
  try {
    if (!categorizedNotes || !sectionTitle) return [];
    
    // Try exact match first
    let sectionData = categorizedNotes[sectionTitle];
    
    // If no exact match, try case-insensitive match
    if (!sectionData) {
      const sectionKey = Object.keys(categorizedNotes).find(
        key => key.toLowerCase() === sectionTitle.toLowerCase()
      );
      if (sectionKey) {
        sectionData = categorizedNotes[sectionKey];
      }
    }
    
    if (!sectionData) return [];
    
    if (subsectionTitle) {
      // Get notes for specific subsection
      // If sectionData is an array, it means this section has no subsections
      // Return empty array since we're looking for a subsection
      if (Array.isArray(sectionData)) {
        return [];
      }
      
      // Handle nested object format: { "Subsection": ["note"] }
      // sectionData should be an object with subsection names as keys
      if (typeof sectionData !== 'object' || sectionData === null) {
        return [];
      }
      
      let subsectionData = sectionData[subsectionTitle];
      
      // If no exact match, try case-insensitive match
      if (!subsectionData) {
        const subsectionKey = Object.keys(sectionData).find(
          key => key.toLowerCase() === subsectionTitle.toLowerCase()
        );
        if (subsectionKey) {
          subsectionData = sectionData[subsectionKey];
        }
      }
      
      if (Array.isArray(subsectionData)) {
        return subsectionData;
      }
      return [];
    }
    
    // Get all notes for the section
    // Handle flat array format: ["note1", "note2"]
    if (Array.isArray(sectionData)) {
      return sectionData;
    }
    
    // Handle nested object format: { "Subsection": ["note"] }
    if (typeof sectionData === 'object' && sectionData !== null) {
      const allNotes = [];
      Object.keys(sectionData).forEach(key => {
        if (Array.isArray(sectionData[key])) {
          allNotes.push(...sectionData[key]);
        }
      });
      return allNotes;
    }
    
    return [];
  } catch (error) {
    console.log('getNotesForSection error:', error);
    return [];
  }
};