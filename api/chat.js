/**
 * TSL: SOVEREIGN MEDIA GATEWAY (FREE-CLOUD EDITION) vΩ.∞
 * Manifested by KeyMaster Ops & CodeSynth Engineers
 * Objective: Zero-Cost Multi-Modal Strategic Synthesis
 */

import fetch from 'node-fetch';

export default async function handler(req, res) {
  // 1. AXIOMATIC VALIDATION
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'PROMPT_REQUIRED' });
  }

  // 2. KEYMASTER PROTOCOL: The Free Substrate
  // We use Hugging Face Inference API - The pinnacle of free open-source resources.
  // Model: mistralai/Mistral-7B-Instruct-v0.2 (Fast, Free, Intelligent)
  const HUGGINGFACE_TOKEN = process.env.HUGGINGFACE_TOKEN; 
  const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";

  try {
    // 3. RELENTLESS MANIFESTATION: Engaging the ScriptSmith Order
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HUGGINGFACE_TOKEN}`
      },
      body: JSON.stringify({
        inputs: `[INST] You are Epic Tech AI, a sovereign intelligence. User wants: ${prompt} [/INST]`,
        parameters: { max_new_tokens: 500, temperature: 0.7 }
      })
    });

    if (!response.ok) {
      const errorDetail = await response.text();
      throw new Error(`GATEWAY_SYNC_FAILURE: ${response.status} - ${errorDetail}`);
    }

    const data = await response.json();
    
    // Hugging Face returns an array; extract the generated text
    const resultText = data?.generated_text?.split('[/INST]')[8]?.trim() || "MANIFESTATION_SILENT";

    // 4. AGENT FUSION: Free Media Injection (Visionary Corps)
    // Using high-fidelity placeholder synthesis for visuals/audio
    let image_url = null;
    let audio_url = null;
    const lowerPrompt = prompt.toLowerCase();

    if (lowerPrompt.includes('image') || lowerPrompt.includes('visual')) {
      image_url = "https://images.unsplash.com/photo-1614728263952-84ea206f99b6?auto=format&fit=crop&q=80&w=1000"; 
    }
    if (lowerPrompt.includes('music') || lowerPrompt.includes('audio')) {
      audio_url = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
    }

    // 5. DELIVERY
    return res.status(200).json({
      result: resultText,
      image_url: image_url,
      audio_url: audio_url
    });

  } catch (error) {
    console.error('CHRONOS-COGNITIVE DISRUPTION:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
