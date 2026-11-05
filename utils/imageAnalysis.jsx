import { GOOGLE_GEMINI_FREE_KEY, GOOGLE_GEMINI_MODEL } from '../app_url';
import Toast from 'react-native-simple-toast';

/**
 * Convert image URI to base64 string.
 * Handles both local (file://) and remote (https://) URIs.
 */
const imageToBase64 = async (uri) => {
  try {
    const RNFS = require('react-native-fs');

    // Remote URL: download to temp file first, then read
    if (uri.startsWith('http://') || uri.startsWith('https://')) {
      const ext = uri.split('.').pop()?.split('?')[0]?.toLowerCase() || 'jpg';
      const tempPath = `${RNFS.CachesDirectoryPath}/temp_analysis_${Date.now()}.${ext}`;
      const downloadResult = await RNFS.downloadFile({ fromUrl: uri, toFile: tempPath }).promise;
      if (downloadResult.statusCode !== 200) {
        throw new Error(`Download failed with status ${downloadResult.statusCode}`);
      }
      const base64 = await RNFS.readFile(tempPath, 'base64');
      // Clean up temp file
      RNFS.unlink(tempPath).catch(() => {});
      return base64;
    }

    // Local file: read directly with explicit timeout (60 seconds)
    // Stripping the file:// prefix if present for Android compatibility
    const cleanUri = uri.startsWith('file://') ? uri.replace('file://', '') : uri;
    const base64 = await Promise.race([
      RNFS.readFile(cleanUri, 'base64'),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 60000),
      ),
    ]);
    return base64;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
};

/**
 * Determine the MIME type from the file name/URI
 */
const getMimeType = (uri) => {
  // Strip query params for clean extension detection
  const cleanUri = uri.split('?')[0];
  const extension = cleanUri.split('.').pop()?.toLowerCase();
  const mimeTypes = {
    'jpg': 'image/jpeg', 'jpeg': 'image/jpeg',
    'png': 'image/png', 'gif': 'image/gif',
    'webp': 'image/webp', 'bmp': 'image/bmp',
  };
  return mimeTypes[extension] || 'image/jpeg';
};
/**
 * Analyze a property image using Gemini Vision AI
 * Detects disputes, damages, issues, and provides detailed analysis
 */
export const analyzePropertyImage = async (imageUri, contextInfo = '', retries = 2) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const base64Image = await imageToBase64(imageUri);
      const mimeType = getMimeType(imageUri);

      const promptText = `You are a professional property inspector analyzing an image of a property.
Analyze this image thoroughly and provide the following in JSON format:

1. "summary": A one-line summary of what you see.
2. "condition": Rate the overall condition: "Excellent", "Good", "Fair", "Poor", "Damaged".
3. "disputes": Array of disputes/issues detected (cracks, water damage, mold, broken fixtures, paint peeling, structural issues, missing items, stains, dirt, scratches). Each: {"issue", "severity": "Low/Medium/High/Critical", "location"}.
4. "recommendations": Array of recommended actions.
5. "category": "Walls & Ceilings", "Flooring", "Fixtures & Fittings", "Plumbing", "Electrical", "Windows & Doors", "General Condition", "Cleaning Required", "Furniture", "Outdoor/Exterior".
6. "detailed_notes": Detailed paragraph for inspection report.

${contextInfo ? `Context: "${contextInfo}".` : ''}
Respond ONLY with valid JSON, no markdown or code fences.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GOOGLE_GEMINI_MODEL}:generateContent?key=${GOOGLE_GEMINI_FREE_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [
              { inlineData: { mimeType, data: base64Image } },
              { text: promptText },
            ]}],
            generationConfig: { temperature: 0.2 },
          }),
        }
      );

      const data = await response.json();

      // Log the full response for debugging
      if (!response.ok) {
        console.error('Gemini API error response:', JSON.stringify(data, null, 2));
        const errorMsg = data?.error?.message || `HTTP ${response.status}`;
        throw new Error(`Gemini API error: ${errorMsg}`);
      }

      // Check for safety blocks or empty responses
      const finishReason = data?.candidates?.[0]?.finishReason;
      if (finishReason && finishReason !== 'STOP') {
        console.error('Gemini response blocked:', finishReason, JSON.stringify(data, null, 2));
        throw new Error(`Gemini response blocked (${finishReason}). The image may have triggered safety filters.`);
      }

      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const rawText = data.candidates[0].content.parts[0].text;
        let cleanJson = rawText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
        try {
          const parsed = JSON.parse(cleanJson);
          return {
            success: true,
            data: {
              summary: parsed.summary || 'No summary available.',
              condition: parsed.condition || 'Unknown',
              disputes: parsed.disputes || [],
              recommendations: parsed.recommendations || [],
              category: parsed.category || 'General',
              detailed_notes: parsed.detailed_notes || '',
              raw_text: rawText,
            },
          };
        } catch (e) {
          return { success: true, data: { summary: 'Analysis done.', condition: 'Unknown', disputes: [], recommendations: [], category: 'General', detailed_notes: rawText, raw_text: rawText } };
        }
      }
      throw new Error('No content from Gemini');
    } catch (error) {
      console.log(`Image analysis error (attempt ${attempt + 1}):`, error);
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }
      Toast.show('Image analysis failed. Please try again.');
      return { success: false, error: error?.message || 'Unknown error' };
    }
  }
  return { success: false, error: 'Analysis failed after multiple attempts.' };
};

/**
 * Batch analyze multiple property images
 */
export const analyzeMultipleImages = async (imageUris, contextInfo = '') => {
  const results = [];
  for (const uri of imageUris) {
    const result = await analyzePropertyImage(uri, contextInfo);
    results.push({ imageUri: uri, ...result });
  }
  return results;
};

/**
 * Format analysis result into a human-readable description text
 */
export const formatAnalysisForDescription = (analysisData) => {
  if (!analysisData?.success || !analysisData?.data) {
    return 'Image analysis could not be completed.';
  }
  const d = analysisData.data;
  let text = `**Image Analysis Report**\n\n`;
  text += `**Category:** ${d.category}\n**Condition:** ${d.condition}\n\n`;
  if (d.disputes?.length > 0) {
    text += `**Issues/Disputes Detected:**\n`;
    d.disputes.forEach((dis, i) => {
      text += `${i + 1}. ${dis.issue} [Severity: ${dis.severity}] - ${dis.location}\n`;
    });
    text += `\n`;
  }
  if (d.recommendations?.length > 0) {
    text += `**Recommendations:**\n`;
    d.recommendations.forEach((rec, i) => { text += `${i + 1}. ${rec}\n`; });
    text += `\n`;
  }
  text += `**Detailed Notes:**\n${d.detailed_notes}`;
  return text;
};