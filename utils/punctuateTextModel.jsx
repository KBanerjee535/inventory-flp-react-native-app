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
      totalScore += keyword.length * 0.7;
    }
  });
  
  return totalScore;
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
 * Rule-based categorization of inspection notes using fuzzy string matching
 * Matches text against section/subsection titles and categorizes accordingly
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

    // If plain text, categorize using fuzzy matching
    if (typeof text === "string" || !parsedInput) {
      return categorizePlainTextFuzzy(text, categoryMap, sectionsWithSubsections);
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
    if (!result[bestMatch.title]) result[bestMatch.title] = [];
    result[bestMatch.title].push(text.trim());
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
  const roomMatch = text.match(/(bedroom|kitchen|room|bathroom)\s*(\d+)/i);
  if (roomMatch) {
    const roomType = roomMatch[1].toLowerCase();
    const roomNum = roomMatch[2];
    const roomCategory = `${roomType.charAt(0).toUpperCase() + roomType.slice(1)} ${roomNum}`;
    
    // Check if this room exists in subsections
    const roomSubsection = subsections.find(s => s.sectionTitle.toLowerCase() === roomCategory.toLowerCase());
    if (roomSubsection) {
      if (!result[roomSubsection.title]) result[roomSubsection.title] = [];
      result[roomSubsection.title].push(text.trim());
      return result;
    }
    
    // Check if this room exists as a section
    const roomSection = sections.find(s => s.title.toLowerCase() === roomCategory.toLowerCase());
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
    if (!result[firstSub.title]) result[firstSub.title] = [];
    result[firstSub.title].push(text.trim());
  } else if (sections.length > 0) {
    const firstSection = sections[0];
    if (!result[firstSection.title]) result[firstSection.title] = [];
    result[firstSection.title].push(text.trim());
  }
  
  return result;
};