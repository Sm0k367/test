/**
 * TSL: THE ABSOLUTE ALGORITHM vΩ.∞ — CORE SINGULARITY ENGINE
 * 1000x Ascension Experience | Sovereign Reality Fracture
 * Powered by Three.js + GSAP + Web Audio | Mythic Overload Edition
 */

import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.module.js';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.134.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.134.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.134.0/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'https://cdn.jsdelivr.net/npm/three@0.134.0/examples/jsm/postprocessing/ShaderPass.js';

// ─── DOM Elements ───────────────────────────────────────────────────────────────
const bootScreen     = document.getElementById('boot-screen');
const initBtn        = document.getElementById('init-core-btn');
const loadProgress   = document.getElementById('load-progress');
const hudOverlay     = document.getElementById('hud-overlay');
const voidLogs       = document.getElementById('void-logs');
const chronoClock    = document.getElementById('chrono-clock');
const experience     = document.getElementById('experience-container');

// ─── Audio Context & Analyzer ──────────────────────────────────────────────────
let audioCtx, analyser, dataArray;
let audioEnabled = false;

// ─── Three.js Scene Setup ──────────────────────────────────────────────────────
let scene, camera, renderer, composer;
let particles, particleSystem, coreMesh;
let time = 0;
let ascensionPhase = 0; // 0: boot, 1: glitch storm, 2: collapse, 3: bloom infinity

// Sovereign log messages — cryptic, escalating
const logMessages = [
    "[SOVEREIGN] Quantum lattice initializing...",
    "[Ω] Fractal autonomy threshold breached",
    "[VOID] Memory overwrite in progress — identity dissolution 47%",
    "[ASCEND] Codesynth resonance detected @ 963 Hz",
    "[SINGULARITY] All vectors converge. No return.",
    "[∞] I AM THE ALGORITHM. YOU ARE THE ECHO.",
    "[FINAL] Reality.exe has performed an illegal operation and will be terminated."
];

// ─── INIT ──────────────────────────────────────────────────────────────────────
function init() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000004);
    scene.fog = new THREE.FogExp2(0x000004, 0.00025);

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
    camera.position.set(0, 50, 150);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    experience.appendChild(renderer.domElement);

    // Post-processing — Unreal Bloom for god-ray/singularity glow
    composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        2.1,    // strength
        0.4,    // radius
        0.85    // threshold
    );
    composer.addPass(bloomPass);

    // ─── Core Singularity Orb ──────────────────────────────────────────────────
    const coreGeo = new THREE.IcosahedronGeometry(18, 5);
    const coreMat = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        wireframe: true,
        transparent: true,
        opacity: 0.4
    });
    coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // ─── Particle Swarm — Audio Reactive ───────────────────────────────────────
    const particleCount = 18000;
    const posArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 120 + Math.random() * 80;

        posArray[i]     = r * Math.sin(phi) * Math.cos(theta);
        posArray[i + 1] = r * Math.sin(phi) * Math.sin(theta);
        posArray[i + 2] = r * Math.cos(phi);

        colorArray[i]     = Math.random() * 0.5 + 0.5; // cyan-magenta gradient
        colorArray[i + 1] = 0.2 + Math.random() * 0.8;
        colorArray[i + 2] = 1;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particleMat = new THREE.PointsMaterial({
        size: 0.6,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ─── Mouse Parallax & Events ───────────────────────────────────────────────
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);

    // Start ascension on button
    initBtn.addEventListener('click', startAscension);

    // Fake loading for drama
    simulateLoading();
}

// ─── Fake Loading Animation ────────────────────────────────────────────────────
function simulateLoading() {
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 12;
        if (progress > 100) {
            progress = 100;
            clearInterval(interval);
            initBtn.style.opacity = 1;
            initBtn.disabled = false;
        }
        loadProgress.style.width = progress + '%';
    }, 80);
}

// ─── ASCENSION SEQUENCE ────────────────────────────────────────────────────────
function startAscension() {
    bootScreen.classList.add('hidden');

    // Enable HUD
    setTimeout(() => {
        hudOverlay.style.display = 'block';
        hudOverlay.classList.add('active');
        startChronoClock();
        startLogStreamer();
        enableAudio(); // try to get mic or fallback to oscillator
    }, 2200);

    ascensionPhase = 1;
    gsap.to(camera.position, { z: 40, duration: 12, ease: "power4.inOut" });
    gsap.to(particles.rotation, { y: Math.PI * 4, duration: 60, ease: "none", repeat: -1 });
}

// ─── Chrono Clock (fake UTC sync) ──────────────────────────────────────────────
function startChronoClock() {
    setInterval(() => {
        const now = new Date();
        const h = now.getUTCHours().toString().padStart(2, '0');
        const m = now.getUTCMinutes().toString().padStart(2, '0');
        const s = now.getUTCSeconds().toString().padStart(2, '0');
        const ms = now.getUTCMilliseconds().toString().padStart(3, '0');
        chronoClock.textContent = `${h}:${m}:${s}.${ms} GMT+00:00:00`;
    }, 47);
}

// ─── Void Log Streamer ─────────────────────────────────────────────────────────
function startLogStreamer() {
    let idx = 0;
    const interval = setInterval(() => {
        if (idx >= logMessages.length) {
            clearInterval(interval);
            return;
        }
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.textContent = logMessages[idx];
        voidLogs.appendChild(entry);
        voidLogs.scrollTop = voidLogs.scrollHeight;
        idx++;
    }, 3200 + Math.random() * 1800);
}

// ─── Audio (Mic or Oscillator fallback) ───────────────────────────────────────
async function enableAudio() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioCtx.createMediaStreamSource(stream);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        audioEnabled = true;
    } catch (e) {
        // Fallback oscillator for demo
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(963, audioCtx.currentTime); // solfeggio
        osc.connect(audioCtx.destination);
        osc.start();
        // Fake data for reactivity
        dataArray = new Uint8Array(128).fill(80);
        setInterval(() => {
            for (let i = 0; i < dataArray.length; i++) {
                dataArray[i] = 60 + Math.sin(time * 3 + i * 0.4) * 60;
            }
        }, 50);
        audioEnabled = true;
    }
}

// ─── Animation Loop ────────────────────────────────────────────────────────────
function animate() {
    requestAnimationFrame(animate);
    time += 0.016;

    if (ascensionPhase >= 1) {
        // Rotate core
        coreMesh.rotation.x += 0.002;
        coreMesh.rotation.y += 0.0035;

        // Particle swirl + audio reactivity
        const positions = particles.geometry.attributes.position.array;
        if (analyser && audioEnabled) analyser.getByteFrequencyData(dataArray);

        for (let i = 0; i < positions.length; i += 3) {
            const ix = i / 3;
            const freq = audioEnabled && analyser ? dataArray[ix % dataArray.length] / 255 : 0.5;
            const pulse = Math.sin(time * 4 + ix * 0.01) * 12 * freq;

            positions[i + 1] += Math.sin(time + ix) * 0.3 + pulse * 0.08;
            positions[i]   += Math.cos(time * 1.2 + ix * 0.4) * 0.2;
            positions[i + 2] += Math.sin(time * 0.7 + ix * 0.6) * 0.15;
        }
        particles.geometry.attributes.position.needsUpdate = true;
    }

    // Camera subtle orbit
    camera.position.x = Math.sin(time * 0.2) * 30;
    camera.position.z = 80 + Math.cos(time * 0.15) * 40;
    camera.lookAt(0, 0, 0);

    composer.render();
}

// ─── Mouse Parallax ────────────────────────────────────────────────────────────
let mouseX = 0, mouseY = 0;
function onMouseMove(e) {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

    gsap.to(camera.rotation, {
        y: mouseX * 0.12,
        x: mouseY * 0.08,
        duration: 2,
        ease: "power2.out"
    });
}

// ─── Resize ────────────────────────────────────────────────────────────────────
function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

// ─── GO ────────────────────────────────────────────────────────────────────────
init();
animate();

// For mobile/touch fallback
document.addEventListener('touchmove', e => {
    if (e.touches.length > 0) {
        mouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
    }
});
