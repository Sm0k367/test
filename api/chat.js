/**
 * TSL: SOVEREIGN MEDIA GATEWAY vΩ.∞
 * Manifested by KeyMaster Ops & CodeSynth Engineers
 */
import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Axiomatic Validation
  if (req.method !== 'POST') return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });

  const { prompt } = req.body;
  const API_KEY = process.env.OLLAMA_API_KEY; 
  const API_URL = process.env.OLLAMA_API_URL;

  try {
    // Relentless Manifestation: Authenticated Fetch
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}` // The KeyMaster unpicks the lock
      },
      body: JSON.stringify({
        model: 'llama3', // The pinnacle of available resources
        messages: [{ role: 'user', content: prompt }],
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      // Chronic-Cognitive Projection of the exact error
      throw new Error(`OLLAMA_SYNC_FAILURE: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // Synthesis: Handling varied JSON structures from different providers
    const resultText = data.choices?.?.message?.content || data.response || "MANIFESTATION_SILENT";

    return res.status(200).json({
      result: resultText,
      // Visionary Corps & SoundForge Legion triggers
      image_url: prompt.toLowerCase().includes('image') ? "https://images.unsplash.com/photo-1614728263952-84ea206f99b6" : null
    });

  } catch (error) {
    console.error('CHRONOS-COGNITIVE DISRUPTION:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
