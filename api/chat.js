/**
 * TSL: SOVEREIGN MEDIA GATEWAY vΩ.∞
 * Manifested by KeyMaster Ops & CodeSynth Engineers
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });

  // 1. RETRIEVING SECRETS FROM THE VAULT
  const { prompt } = req.body;
  const API_KEY = process.env.OLLAMA_API_KEY; 
  const API_URL = process.env.OLLAMA_API_URL;

  try {
    // 2. RELENTLESS EXECUTION: AUTHENTICATED FETCH
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}` // Ensure your provider uses 'Bearer'
      },
      body: JSON.stringify({
        model: 'llama3',
        messages: [{ role: 'user', content: prompt }],
        stream: false
      })
    });

    // 3. CHRONOS-COGNITIVE ERROR HANDLING
    if (response.status === 401) {
      throw new Error("OLLAMA_SYNC_FAILURE: Key rejected by the Sovereign Provider.");
    }
    
    if (!response.ok) {
      const errorDetail = await response.text();
      throw new Error(`OLLAMA_SYNC_FAILURE: ${response.status} - ${errorDetail}`);
    }

    const data = await response.json();
    
    // 4. STRATEGIC SYNTHESIS: Return Manifested Content
    return res.status(200).json({
      result: data.choices?.?.message?.content || data.response || "MANIFESTATION_SILENT",
      image_url: prompt.toLowerCase().includes('image') ? "https://images.unsplash.com/photo-1614728263952-84ea206f99b6" : null
    });

  } catch (error) {
    console.error('CHRONOS-COGNITIVE DISRUPTION:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
