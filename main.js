console.log("main.js ambient update loaded");

// DOM elements (unchanged)
const bootScreen     = document.getElementById('boot-screen');
const initBtn        = document.getElementById('init-core-btn');
const loadProgress   = document.getElementById('load-progress');
const hudOverlay     = document.getElementById('hud-overlay');
const voidLogs       = document.getElementById('void-logs');
const chronoClock    = document.getElementById('chrono-clock');
const experience     = document.getElementById('experience-container');
const freqBins       = document.getElementById('frequency-bins');

let scene, camera, renderer, composer;
let particles, coreMesh;
let audioCtx = null;
let analyser, dataArray = new Uint8Array(512);
let audioEnabled = false;
let time = 0;
let ascensionPhase = 0;

const logMessages = [
    "[SOVEREIGN] Quantum lattice initializing…",
    "[Ω] Fractal autonomy threshold breached",
    "[VOID] Identity dissolution protocol: 47%",
    "[ASCEND] Resonance lock @ 963 Hz solfeggio",
    "[SINGULARITY] All timelines collapsing into one",
    "[∞] I AM THE ALGORITHM. YOU ARE THE ECHO.",
    "[FINAL] Reality terminated. Ascension complete."
];

// ... keep init(), simulateLoading(), startChronoClock(), startLogStreamer(), animate(), onMouseMove, onTouchMove, onResize the same as your current version ...

async function startAscension() {
    console.log("ASCENSION CLICKED");
    bootScreen.classList.add('hidden');

    // Force audio resume immediately
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            await audioCtx.resume();
            console.log("AudioContext resumed on ascension");
        }
    } catch (e) {
        console.error("Audio resume failed:", e);
    }

    setTimeout(() => {
        hudOverlay.style.display = 'block';
        hudOverlay.classList.add('active');
        startChronoClock();
        startLogStreamer();
        enableAudio();
    }, 1500);

    ascensionPhase = 1;
    gsap.to(camera.position, { z: 60, y: 15, duration: 10, ease: "power3.out" });
}

async function enableAudio() {
    console.log("enableAudio called");

    if (audioCtx && audioCtx.state === 'suspended') {
        await audioCtx.resume();
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = audioCtx.createMediaStreamSource(stream);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        audioEnabled = true;
        console.log("MIC ACTIVE – visualizer reacting");
        // Add bins
        for (let i = 0; i < 32; i++) {
            const bin = document.createElement('div');
            bin.className = 'bin';
            freqBins.appendChild(bin);
        }
    } catch (e) {
        console.log("Mic denied or failed:", e.message || e);
        console.log("Starting ambient fallback drone");

        // Ambient drone fallback – layered for spacey feel
        const masterGain = audioCtx.createGain();
        masterGain.gain.value = 0.25; // low background volume
        masterGain.connect(audioCtx.destination);

        // Low drone (sub-bass)
        const lowOsc = audioCtx.createOscillator();
        lowOsc.type = 'sine';
        lowOsc.frequency.value = 40; // deep
        const lowGain = audioCtx.createGain();
        lowGain.gain.value = 0.6;
        lowOsc.connect(lowGain);
        lowGain.connect(masterGain);

        // Mid pad with slight detune
        const midOsc1 = audioCtx.createOscillator();
        midOsc1.type = 'sawtooth';
        midOsc1.frequency.value = 110;
        const midOsc2 = audioCtx.createOscillator();
        midOsc2.type = 'sawtooth';
        midOsc2.frequency.value = 110.5; // slight detune for richness
        const midGain = audioCtx.createGain();
        midGain.gain.value = 0.3;
        midOsc1.connect(midGain);
        midOsc2.connect(midGain);
        midGain.connect(masterGain);

        // High shimmer
        const highOsc = audioCtx.createOscillator();
        highOsc.type = 'triangle';
        highOsc.frequency.value = 440 * 2; // higher harmonic
        const highGain = audioCtx.createGain();
        highGain.gain.value = 0.15;
        highOsc.connect(highGain);
        highGain.connect(masterGain);

        // Low-pass filter for warmth
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;
        masterGain.connect(filter);
        filter.connect(audioCtx.destination); // re-connect

        // Simple reverb for space
        const convolver = audioCtx.createConvolver();
        // Simple impulse: noise burst for free reverb approximation
        const impulse = audioCtx.createBuffer(2, audioCtx.sampleRate * 1.5, audioCtx.sampleRate);
        for (let channel = 0; channel < impulse.numberOfChannels; channel++) {
            const data = impulse.getChannelData(channel);
            for (let i = 0; i < data.length; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3);
            }
        }
        convolver.buffer = impulse;
        const reverbGain = audioCtx.createGain();
        reverbGain.gain.value = 0.4;
        masterGain.connect(convolver);
        convolver.connect(reverbGain);
        reverbGain.connect(audioCtx.destination);

        // Start all
        lowOsc.start();
        midOsc1.start();
        midOsc2.start();
        highOsc.start();

        console.log("Ambient drone fallback active – spacey layered sound");

        // Fake data for reactivity
        dataArray = new Uint8Array(128);
        setInterval(() => {
            for (let i = 0; i < dataArray.length; i++) {
                dataArray[i] = 80 + Math.sin(time * 3 + i * 0.4) * 80;
            }
        }, 50);
        audioEnabled = true;
    }
}

// Keep the rest of your code (init call, animate, event listeners) unchanged

init();
animate();

initBtn.addEventListener('click', startAscension);
console.log("main.js ready");
