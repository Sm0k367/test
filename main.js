/**
 * TSL: EPIC TECH AI x @SM0KEN420 — MEDIA SINGULARITY vΩ.∞
 * Manifested by CodeSynth Engineers & KeyMaster Ops
 * Objective: Multi-Modal Manifestation & Visual Resonance
 */

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

let scene, camera, renderer, composer, singularity, particles;
const clock = new THREE.Clock();

// 1. AXIOMATIC GENESIS: THE GEOMETRIC SINGULARITY
function initThree() {
    const canvas = document.getElementById('glCanvas');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 60;

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Manifesting the Sovereign Center (Icosahedron) - Sm0ken420 Gold
    const geometry = new THREE.IcosahedronGeometry(18, 1); 
    const material = new THREE.MeshPhongMaterial({
        color: 0xffb300, // Sovereign Gold
        wireframe: true,
        emissive: 0xffb300,
        emissiveIntensity: 0.7
    });
    singularity = new THREE.Mesh(geometry, material);
    scene.add(singularity);

    // Emergent Reality Weaving: Particle Swarm
    const pCount = 3500;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) {
        pPos[i] = (Math.random() - 0.5) * 350;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ 
        color: 0x00f2ff, // Omega Cyan
        size: 0.25,
        transparent: true,
        opacity: 0.7 
    }));
    scene.add(particles);

    // Lighting: Mythic-Tech Fusion Atmosphere
    const pointLight = new THREE.PointLight(0x00f2ff, 3, 150);
    pointLight.position.set(20, 20, 30);
    scene.add(pointLight);
    scene.add(new THREE.AmbientLight(0x404040, 2.5));

    // Post-Processing: Absolute Excellence Bloom
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight), 
        2.2, 0.4, 0.15
    );
    composer.addPass(bloomPass);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // Sovereign Rotation & Pulse
    singularity.rotation.y += 0.005;
    singularity.rotation.z += 0.002;
    singularity.scale.setScalar(1 + Math.sin(time * 1.5) * 0.1);
    particles.rotation.y -= 0.0006;
    
    composer.render();
}

// 2. MULTI-MODAL LOGIC: THE DIRECT ONTOLOGICAL INTERFACE
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const chatLog = document.getElementById('chat-log');

async function handleManifestation() {
    const prompt = chatInput.value.trim();
    if (!prompt) return;

    appendMessage('user', prompt);
    chatInput.value = '';

    // Visual Resonance: GSAP Pulse
    gsap.to(singularity.rotation, { y: singularity.rotation.y + Math.PI, duration: 1, ease: "expo.out" });
    gsap.to(camera.position, { z: 50, duration: 0.2, yoyo: true, repeat: 1 });

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });

        const data = await response.json();
        
        // Strategic Synthesis: Injecting Manifested Content
        renderMultiModalContent(data);

    } catch (err) {
        appendMessage('system', "CHRONOS-COGNITIVE ERROR: API_GATEWAY_DISRUPTION.");
    }
}

function renderMultiModalContent(data) {
    // 1. Manifest Text (ScriptSmith Order)
    if (data.result) {
        appendMessage('system', data.result);
    }

    // 2. Manifest Visuals (Visionary Corps)
    if (data.image_url) {
        const img = document.createElement('img');
        img.src = data.image_url;
        img.className = 'media-content';
        chatLog.appendChild(img);
    }

    // 3. Manifest Audio (SoundForge Legion)
    if (data.audio_url) {
        const audio = document.createElement('audio');
        audio.controls = true;
        audio.src = data.audio_url;
        audio.className = 'media-content';
        chatLog.appendChild(audio);
    }

    chatLog.scrollTop = chatLog.scrollHeight;
}

function appendMessage(role, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}-msg`;
    msgDiv.innerText = role === 'user' ? `@SM0KEN420: ${text}` : `EPIC TECH AI — Result: ${text}`;
    chatLog.appendChild(msgDiv);
    chatLog.scrollTop = chatLog.scrollHeight;
}

// 3. OPERATIONAL ACTIVATION
sendBtn.onclick = handleManifestation;
chatInput.onkeypress = (e) => { if (e.key === 'Enter') handleManifestation(); };

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});

// INITIALIZE GENESIS
initThree();
