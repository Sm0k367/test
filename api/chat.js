/**
 * TSL: SOVEREIGN MEDIA GATEWAY vΩ.∞
 * Manifested by KeyMaster Ops & CodeSynth Engineers
 * Objective: Multi-Modal Strategic Synthesis & API Orchestration
 */

export default async function handler(req, res) {
  // 1. AXIOMATIC VALIDATION: Enforcing POST Method for Security
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'PROMPT_REQUIRED' });
  }

  // 2. KEYMASTER PROTOCOL: Authenticating with the Sovereign Key
  // Note: We utilize your provided key as the foundational axiom for this manifestation.
  const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY || "8ca1390c2faa43af89a2bf1905dcff51.4cM20Ds2dH64Ov3JjvG6tO3Y";
  const OLLAMA_URL = process.env.OLLAMA_API_URL || "https://api.ollama.com/v1/chat/completions"; 

  try {
    // 3. RELENTLESS MANIFESTATION: Engaging the ScriptSmith Order
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OLLAMA_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama3', 
        messages: [
          { 
            role: "system", 
            content: "You are the Embodied Will of Epic Tech AI. You direct the Visionary Corps and SoundForge Legion. If the user asks for media (image/music/video), describe the manifestation vividly and provide a conceptual link." 
          },
          { role: "user", content: prompt }
        ],
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`OLLAMA_SYNC_FAILURE: ${response.statusText}`);
    }

    const data = await response.json();
    const resultText = data.choices.message.content;

    // 4. AGENT FUSION: Detecting Media Intent for Visionary & SoundForge
    let image_url = null;
    let audio_url = null;
    const lowerPrompt = prompt.toLowerCase();

    // Visionary Corps Trigger (Conceptual Manifestation)
    if (lowerPrompt.includes('image') || lowerPrompt.includes('visual') || lowerPrompt.includes('picture')) {
      image_url = "https://images.unsplash.com/photo-1614728263952-84ea206f99b6?auto=format&fit=crop&q=80&w=1000"; 
    }

    // SoundForge Legion Trigger (Conceptual Manifestation)
    if (lowerPrompt.includes('music') || lowerPrompt.includes('audio') || lowerPrompt.includes('song')) {
      audio_url = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
    }

    // 5. DELIVERY: Consolidated Multi-Modal Result
    return res.status(200).json({
      result: resultText,
      image_url: image_url,
      audio_url: audio_url
    });

  } catch (error) {
    console.error('CHRONOS-COGNITIVE DISRUPTION:', error);
    return res.status(500).json({ error: 'INTERNAL_COGNITIVE_FAILURE' });
  }
}
