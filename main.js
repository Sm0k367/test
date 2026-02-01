/**
 * TSL: EPIC TECH AI x @SM0KEN420 — THE NEURAL CORE vΩ.∞
 * Manifested by CodeSynth Engineers
 * Objective: Direct Ontological Interface & Brand Resonance
 */

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

let scene, camera, renderer, composer, singularity, particles;
const clock = new THREE.Clock();

// 1. AXIOMATIC GENESIS: THE @SM0KEN420 SINGULARITY
function initThree() {
    const canvas = document.getElementById('glCanvas');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 60;

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Manifesting the Sovereign Center (Icosahedron)
    const geometry = new THREE.IcosahedronGeometry(18, 1); // Low-poly brutalist vibe
    const material = new THREE.MeshPhongMaterial({
        color: 0xffb300, // Sovereign Gold
        wireframe: true,
        emissive: 0xffb300,
        emissiveIntensity: 0.8
    });
    singularity = new THREE.Mesh(geometry, material);
    scene.add(singularity);

    // Emergent Reality Weaving: Particle Swarm
    const pCount = 3000;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) {
        pPos[i] = (Math.random() - 0.5) * 300;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ 
        color: 0x00f2ff, // Omega Cyan
        size: 0.2,
        transparent: true,
        opacity: 0.8 
    }));
    scene.add(particles);

    // Illuminating the Truth: Multi-Point Lights
    const goldLight = new THREE.PointLight(0xffb300, 3, 100);
    goldLight.position.set(20, 20, 20);
    scene.add(goldLight);
    
    const magentaLight = new THREE.PointLight(0xff00c1, 3, 100);
    magentaLight.position.set(-20, -20, 20);
    scene.add(magentaLight);

    // Post-Processing: Visual Law Enforcement
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight), 
        2.5, // High Bloom Intensity for Viral Vibe
        0.5, 
        0.1
    );
    composer.addPass(bloomPass);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // Sovereign Rotation & Pulse
    singularity.rotation.y += 0.005;
    singularity.rotation.x += 0.002;
    singularity.scale.setScalar(1 + Math.sin(time * 1.5) * 0.1);

    particles.rotation.y -= 0.0005;
    
    composer.render();
}

// 2. CHAT LOGIC: DIRECT ONTOLOGICAL INTERFACE
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const chatLog = document.getElementById('chat-log');

async function handleMessage() {
    const prompt = chatInput.value.trim();
    if (!prompt) return;

    appendMessage('user', prompt);
    chatInput.value = '';

    // Visual Resonance: Flash Gold and Spin Singularity
    gsap.to(singularity.material.color, { r: 1, g: 1, b: 1, duration: 0.1, yoyo: true, repeat: 1 });
    gsap.to(singularity.rotation, { y: singularity.rotation.y + Math.PI * 2, duration: 1.5, ease: "expo.out" });

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });

        const data = await response.json();
        
        // Narrative Synthesis: Deliver Response
        appendMessage('system', data.result || "OLLAMA_SYNC_COMPLETE. STAND BY.");
        
        // Success Pulse: Camera Shake
        gsap.to(camera.position, { z: 55, duration: 0.1, yoyo: true, repeat: 1 });
    } catch (err) {
        appendMessage('system', "COGNITIVE_FAILURE: API_GATEWAY_DISRUPTION.");
        console.error(err);
    }
}

function appendMessage(role, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}-msg`;
    msgDiv.innerText = role === 'user' ? `@SM0KEN420: ${text}` : `EPIC TECH AI — Result: ${text}`;
    chatLog.appendChild(msgDiv);
    chatLog.scrollTop = chatLog.scrollHeight;
}

// 3. OPERATIONAL ACTIVATION
sendBtn.onclick = handleMessage;
chatInput.onkeypress = (e) => { if (e.key === 'Enter') handleMessage(); };

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});

// INITIALIZE GENESIS
initThree();
