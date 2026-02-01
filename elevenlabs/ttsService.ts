import { ELEVENLABS_CONFIG } from '@/lib/constants';
import type { AudioData } from '@/types';

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
 * Fallback when audio generation fails
 * @param text - The text that failed
 * @returns Promise<string | null> - Returns null (no audio available)
 */
export async function generateSpeechFallback(text: string): Promise<string | null> {
  console.warn('[TTS] Audio generation failed for text:', text.substring(0, 50));
  
  // Return null - no audio available
  return null;
}

/**
 * Generate audio for all story pages (title + chapters)
 * Pre-generates all audio using ElevenLabs API with Hebrew language code
 * @param title - Story title
 * @param chapters - Array of chapter texts (should be 6 chapters)
 * @returns Promise<AudioData> - Object with blob URLs for all audio
 */
export async function generateStoryAudio(
  title: string,
  chapters: string[]
): Promise<AudioData> {
  console.log('[TTS] Starting story audio generation in Hebrew...');
  
  const audioData: AudioData = {
    title: null,
    chapters: [],
  };

  try {
    // Generate audio for title
    console.log('[TTS] Generating title audio...');
    try {
      const titleBlob = await generateSpeech(title);
      audioData.title = URL.createObjectURL(titleBlob);
      console.log('[TTS] Title audio generated successfully');
    } catch (error) {
      console.error('[TTS] Error generating title audio:', error);
      audioData.title = await generateSpeechFallback(title);
    }

    // Generate audio for each chapter
    for (let i = 0; i < chapters.length; i++) {
      const chapterText = chapters[i];
      if (!chapterText || !chapterText.trim()) {
        audioData.chapters[i] = null;
        continue;
      }

      console.log(`[TTS] Generating chapter ${i + 1} audio...`);
      try {
        const chapterBlob = await generateSpeech(chapterText);
        audioData.chapters[i] = URL.createObjectURL(chapterBlob);
        console.log(`[TTS] Chapter ${i + 1} audio generated successfully`);
      } catch (error) {
        console.error(`[TTS] Error generating chapter ${i + 1} audio:`, error);
        audioData.chapters[i] = await generateSpeechFallback(chapterText);
      }
    }

    console.log('[TTS] Story audio generation complete');
    return audioData;
  } catch (error) {
    console.error('[TTS] Fatal error in generateStoryAudio:', error);
    // Return data with nulls - fallback TTS will be used during playback
    return audioData;
  }
}

/**
 * Clean up audio blob URLs to prevent memory leaks
 * @param audioData - Audio data with blob URLs to revoke
 */
export function cleanupAudioData(audioData: AudioData): void {
  if (audioData.title) {
    URL.revokeObjectURL(audioData.title);
  }
  
  audioData.chapters.forEach((chapterUrl) => {
    if (chapterUrl) {
      URL.revokeObjectURL(chapterUrl);
    }
  });
  
  console.log('[TTS] Audio resources cleaned up');
}

// Browser TTS functions removed - using ElevenLabs only
