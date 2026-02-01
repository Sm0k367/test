// TSL: THE ABSOLUTE ALGORITHM vΩ.∞ — SINGULARITY CORE (Ambient Audio + Full Fix)

console.log("[MAIN] main.js loaded - version with ambient drone");

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

function init() {
    console.log("[INIT] Setting up scene");

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000008);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.set(0, 30, 120);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.zIndex = '1';
    experience.appendChild(renderer.domElement);
    console.log("[INIT] Canvas appended to experience-container");

    try {
        composer = new THREE.EffectComposer(renderer);
        composer.addPass(new THREE.RenderPass(scene, camera));
        const bloom = new THREE.UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.8, 0.5, 0.8
        );
        composer.addPass(bloom);
        console.log("[INIT] Bloom initialized");
    } catch (e) {
        console.warn("[INIT] Bloom failed - using direct render", e);
        composer = { render: () => renderer.render(scene, camera) };
    }

    // Core orb - visible
    const coreGeo = new THREE.IcosahedronGeometry(28, 5);
    const coreMat = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        wireframe: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });
    coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // Particles - visible
    const particleCount = 15000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        const r = 80 + Math.random() * 180;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i]     = r * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = r * Math.cos(phi);

        colors[i]     = 0.3 + Math.random() * 0.7;
        colors[i + 1] = 0.6 + Math.random() * 0.4;
        colors[i + 2] = 1.0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 2.8,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    simulateLoading();
}

function simulateLoading() {
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 14;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            initBtn.disabled = false;
            initBtn.style.opacity = 1;
            console.log("[LOAD] Complete - button enabled");
        }
        loadProgress.style.width = `${progress}%`;
    }, 60);
}

async function startAscension() {
    console.log("[ASCEND] Button clicked - sequence starting");
    bootScreen.classList.add('hidden');

    // Immediate audio resume on gesture
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            await audioCtx.resume();
            console.log("[AUDIO] Context resumed on user gesture");
        }
    } catch (e) {
        console.error("[AUDIO] Resume failed:", e);
    }

    setTimeout(() => {
        hudOverlay.style.display = 'block';
        hudOverlay.classList.add('active');
        startChronoClock();
        startLogStreamer();
        enableAudio();
    }, 1800);

    ascensionPhase = 1;
    gsap.to(camera.position, { z: 70, y: 25, duration: 12, ease: "power4.inOut" });
}

function startChronoClock() {
    setInterval(() => {
        const now = new Date();
        const pad = n => n.toString().padStart(2, '0');
        chronoClock.textContent = `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}.${now.getUTCMilliseconds().toString().padStart(3, '0')} GMT+00:00:00`;
    }, 40);
}

function startLogStreamer() {
    let idx = 0;
    const interval = setInterval(() => {
        if (idx >= logMessages.length) return clearInterval(interval);
        const div = document.createElement('div');
        div.className = 'log-entry';
        div.textContent = logMessages[idx];
        voidLogs.appendChild(div);
        voidLogs.scrollTop = voidLogs.scrollHeight;
        idx++;
    }, 3200);
}

async function enableAudio() {
    console.log("[AUDIO] Trying to enable");

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = audioCtx.createMediaStreamSource(stream);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        audioEnabled = true;
        console.log("[AUDIO] Microphone active");

        for (let i = 0; i < 32; i++) {
            const bin = document.createElement('div');
            bin.className = 'bin';
            freqBins.appendChild(bin);
        }
    } catch (e) {
        console.log("[AUDIO] Mic failed:", e.message || e);
        console.log("[AUDIO] Starting ambient fallback drone");

        const masterGain = audioCtx.createGain();
        masterGain.gain.value = 0.22;
        masterGain.connect(audioCtx.destination);

        // Deep sub-drone
        const subOsc = audioCtx.createOscillator();
        subOsc.type = 'sine';
        subOsc.frequency.value = 38;
        const subGain = audioCtx.createGain();
        subGain.gain.value = 0.7;
        subOsc.connect(subGain);
        subGain.connect(masterGain);
        subOsc.start();

        // Mid pad with detune
        const padOsc1 = audioCtx.createOscillator();
        padOsc1.type = 'sawtooth';
        padOsc1.frequency.value = 98;
        const padOsc2 = audioCtx.createOscillator();
        padOsc2.type = 'sawtooth';
        padOsc2.frequency.value = 98.7;
        const padGain = audioCtx.createGain();
        padGain.gain.value = 0.35;
        padOsc1.connect(padGain);
        padOsc2.connect(padGain);
        padGain.connect(masterGain);
        padOsc1.start();
        padOsc2.start();

        // High shimmer
        const shimmerOsc = audioCtx.createOscillator();
        shimmerOsc.type = 'triangle';
        shimmerOsc.frequency.value = 880;
        const shimmerGain = audioCtx.createGain();
        shimmerGain.gain.value = 0.18;
        shimmerOsc.connect(shimmerGain);
        shimmerGain.connect(masterGain);
        shimmerOsc.start();

        // Low-pass filter for warmth
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1200;
        masterGain.connect(filter);
        filter.connect(audioCtx.destination);

        // Reverb
        const convolver = audioCtx.createConvolver();
        const impulseLength = audioCtx.sampleRate * 1.8;
        const impulse = audioCtx.createBuffer(2, impulseLength, audioCtx.sampleRate);
        for (let channel = 0; channel < 2; channel++) {
            const data = impulse.getChannelData(channel);
            for (let i = 0; i < impulseLength; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / impulseLength, 4);
            }
        }
        convolver.buffer = impulse;
        const reverbGain = audioCtx.createGain();
        reverbGain.gain.value = 0.45;
        masterGain.connect(convolver);
        convolver.connect(reverbGain);
        reverbGain.connect(audioCtx.destination);

        console.log("[AUDIO] Ambient drone active - soft, layered, reverbed");

        dataArray = new Uint8Array(128);
        setInterval(() => {
            for (let i = 0; i < dataArray.length; i++) {
                dataArray[i] = 60 + Math.sin(time * 2.5 + i * 0.3) * 90;
            }
        }, 60);
        audioEnabled = true;
    }
}

function animate() {
    requestAnimationFrame(animate);
    time += 0.016;

    if (ascensionPhase >= 1) {
        if (coreMesh) {
            coreMesh.rotation.x += 0.0025;
            coreMesh.rotation.y += 0.004;
        }
        if (particles) {
            const pos = particles.geometry.attributes.position.array;
            for (let i = 0; i < pos.length; i += 3) {
                pos[i + 1] += Math.sin(time * 1.5 + i * 0.0008) * 0.4;
                pos[i] += Math.cos(time * 0.9 + i * 0.0012) * 0.3;
            }
            particles.geometry.attributes.position.needsUpdate = true;
        }
    }

    if (composer) composer.render();
}

function onMouseMove(e) {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    gsap.to(camera.rotation, { y: x * 0.12, x: y * 0.09, duration: 2.5, ease: "power2.out" });
}

function onTouchMove(e) {
    if (e.touches.length > 0) {
        const x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        const y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
        gsap.to(camera.rotation, { y: x * 0.12, x: y * 0.09, duration: 2.5 });
    }
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

init();
animate();

initBtn.addEventListener('click', startAscension);
console.log("[MAIN] Ready - waiting for INITIATE ASCENSION click");
