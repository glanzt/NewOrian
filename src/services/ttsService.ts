/**
 * ElevenLabs Text-to-Speech Service
 * Generates Hebrew speech audio using ElevenLabs API
 */

// ElevenLabs TTS configuration from environment variables
const ELEVENLABS_CONFIG = {
  apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY as string,
  voiceId: import.meta.env.VITE_ELEVENLABS_VOICE_ID as string,
  modelId: (import.meta.env.VITE_ELEVENLABS_MODEL_ID as string) || 'eleven_v3',
};

/**
 * Generate speech audio from text using ElevenLabs API
 * Note: Uses configured model (eleven_v3 by default) with Hebrew language code
 * @param text - The text to convert to speech
 * @returns Promise<Blob> - Audio blob (MP3 format)
 */
export async function generateSpeech(text: string): Promise<Blob> {
  const { apiKey, voiceId, modelId } = ELEVENLABS_CONFIG;

  console.log('[TTS] Generating speech with config:', { 
    hasApiKey: !!apiKey, 
    voiceId, 
    modelId,
    textLength: text?.length 
  });

  if (!apiKey || !voiceId) {
    const error = `ElevenLabs API key or voice ID not configured (apiKey: ${!!apiKey}, voiceId: ${!!voiceId})`;
    console.error('[TTS] Configuration error:', error);
    throw new Error(error);
  }

  if (!text || !text.trim()) {
    const error = 'Text is empty or invalid';
    console.error('[TTS] Text validation error:', error);
    throw new Error(error);
  }

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
  const requestBody = {
    text,
    model_id: modelId,
    language_code: 'he', // Hebrew language code for better pronunciation
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.5,
      use_speaker_boost: true,
    },
  };

  console.log('[TTS] Making API request to:', url);
  console.log('[TTS] Request body:', { ...requestBody, text: `${text.substring(0, 50)}...` });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify(requestBody),
    });

    console.log('[TTS] API response status:', response.status, response.statusText);
    
    // Check content-type header
    const contentType = response.headers.get('content-type');
    console.log('[TTS] Response content-type:', contentType);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('[TTS] API error response:', errorText);
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
    }
    
    // Validate content-type before converting to blob
    if (contentType && !contentType.startsWith('audio/')) {
      const text = await response.text();
      console.error('[TTS] Received non-audio content-type:', contentType);
      console.error('[TTS] Response body:', text);
      throw new Error(`Invalid content-type: expected audio/*, got ${contentType}`);
    }

    const blob = await response.blob();
    console.log('[TTS] Generated audio blob:', blob.size, 'bytes, type:', blob.type);
    
    // Validate blob size is reasonable
    if (blob.size < 100) {
      throw new Error(`Invalid audio blob: size too small (${blob.size} bytes)`);
    }
    
    // Additional validation: check blob type if available
    if (blob.type && !blob.type.startsWith('audio/') && !blob.type.includes('mpeg')) {
      const text = await blob.text();
      console.error('[TTS] Invalid blob type:', blob.type);
      console.error('[TTS] Blob content:', text.substring(0, 500));
      throw new Error(`Invalid audio format: blob type is ${blob.type}`);
    }
    
    return blob;
  } catch (error) {
    console.error('[TTS] Fetch error:', error);
    throw error;
  }
}

/**
 * Check if TTS is configured and available
 * @returns boolean - true if TTS can be used
 */
export function isTTSAvailable(): boolean {
  const { apiKey, voiceId } = ELEVENLABS_CONFIG;
  return !!apiKey && !!voiceId;
}
