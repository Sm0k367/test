/**
 * TSL: SOVEREIGN CHAT GATEWAY vΩ
 * Manifested by KeyMaster Ops & CodeSynth Engineers
 * Objective: Secure Zero-Trust API Orchestration
 */

export default async function handler(req, res) {
  // 1. AXIOMATIC VALIDATION
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'PROMPT_REQUIRED' });
  }

  // 2. RETRIEVING THE VOID ARCHAEOLOGY (ENV SECRETS)
  // Ensure you set OLLAMA_API_URL and OLLAMA_API_KEY in Vercel
  const OLLAMA_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate';
  const API_KEY = process.env.OLLAMA_API_KEY;

  try {
    // 3. RELENTLESS MANIFESTATION: THE LLM REQUEST
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama3', // Or your preferred Ollama model
        prompt: prompt,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`OLLAMA_SYNC_FAILURE: ${response.statusText}`);
    }

    const data = await response.json();

    // 4. SYNTHESIS & DELIVERY: RETURNING THE RESULT
    // Mapping Ollama's 'response' field to our 'result' field
    return res.status(200).json({ 
      result: data.response || "EPIC TECH AI — Result: Transmission Received." 
    });

  } catch (error) {
    console.error('CHRONOS-COGNITIVE DISRUPTION:', error);
    return res.status(500).json({ error: 'INTERNAL_COGNITIVE_FAILURE' });
  }
}
