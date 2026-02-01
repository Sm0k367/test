// TSL: THE ABSOLUTE ALGORITHM vΩ.∞ — SINGULARITY CORE v1000x
// Non-module version: uses global THREE from CDN

// ─── DOM Elements ───────────────────────────────────────────────────────────────
const bootScreen     = document.getElementById('boot-screen');
const initBtn        = document.getElementById('init-core-btn');
const loadProgress   = document.getElementById('load-progress');
const hudOverlay     = document.getElementById('hud-overlay');
const voidLogs       = document.getElementById('void-logs');
const chronoClock    = document.getElementById('chrono-clock');
const experience     = document.getElementById('experience-container');
const freqBins       = document.getElementById('frequency-bins');

// ─── Globals ────────────────────────────────────────────────────────────────────
let scene, camera, renderer, composer;
let particles, coreMesh;
let audioCtx, analyser, dataArray = new Uint8Array(512);
let audioEnabled = false;
let time = 0;
let ascensionPhase = 0;

// Log messages
const logMessages = [
    "[SOVEREIGN] Quantum lattice initializing…",
    "[Ω] Fractal autonomy threshold breached",
    "[VOID] Identity dissolution protocol: 47%",
    "[ASCEND] Resonance lock @ 963 Hz solfeggio",
    "[SINGULARITY] All timelines collapsing into one",
    "[∞] I AM THE ALGORITHM. YOU ARE THE ECHO.",
    "[FINAL] Reality terminated. Ascension complete."
];

// ─── Init Scene ────────────────────────────────────────────────────────────────
function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000004);
    scene.fog = new THREE.FogExp2(0x000004, 0.00028);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
    camera.position.set(0, 40, 140);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    experience.appendChild(renderer.domElement);

    // Post-processing
    composer = new THREE.EffectComposer(renderer);
    const renderPass = new THREE.RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloom = new THREE.UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        2.4, 0.55, 0.78
    );
    composer.addPass(bloom);

    // Core orb
    const coreGeo = new THREE.IcosahedronGeometry(22, 4);
    const coreMat = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        wireframe: true,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending
    });
    coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // Particles
    const particleCount = 22000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 100 + Math.random() * 140;

        positions[i]     = r * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = r * Math.cos(phi);

        colors[i]     = 0.1 + Math.random() * 0.9;
        colors[i + 1] = 0.4 + Math.random() * 0.6;
        colors[i + 2] = 0.9;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.8,
        vertexColors: true,
        transparent: true,
        opacity: 0.92,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Events
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    simulateLoading();
}

// Loading bar fake progress
function simulateLoading() {
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 9 + 4;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            initBtn.disabled = false;
            initBtn.style.opacity = 1;
        }
        loadProgress.style.width = `${progress}%`;
    }, 60);
}

// Ascension start
function startAscension() {
    bootScreen.classList.add('hidden');

    setTimeout(() => {
        hudOverlay.style.display = 'block';
        setTimeout(() => hudOverlay.classList.add('active'), 300);
        startChronoClock();
        startLogStreamer();
        enableAudio();
    }, 1800);

    ascensionPhase = 1;
    gsap.to(camera.position, { z: 60, y: 20, duration: 14, ease: "power4.inOut" });
}

// Clock
function startChronoClock() {
    setInterval(() => {
        const now = new Date();
        const pad = n => n.toString().padStart(2, '0');
        chronoClock.textContent = `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}.${now.getUTCMilliseconds().toString().padStart(3, '0')} GMT+00:00:00`;
    }, 31);
}

// Logs
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
    }, 2800 + Math.random() * 2200);
}

// Audio
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

        // Create bars
        for (let i = 0; i < 32; i++) {
            const bin = document.createElement('div');
            bin.className = 'bin';
            freqBins.appendChild(bin);
        }
    } catch (e) {
        // Fallback tone
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 963;
        osc.connect(audioCtx.destination);
        osc.start();
        dataArray = new Uint8Array(128);
        setInterval(() => {
            for (let i = 0; i < dataArray.length; i++) {
                dataArray[i] = 70 + Math.sin(time * 5 + i * 0.6) * 70;
            }
        }, 40);
        audioEnabled = true;
    }
}

// Animate loop
function animate() {
    requestAnimationFrame(animate);
    time += 0.016;

    if (ascensionPhase >= 1) {
        coreMesh.rotation.x += 0.003;
        coreMesh.rotation.y += 0.0045;
        coreMesh.scale.setScalar(1 + Math.sin(time * 2) * 0.08);

        const positions = particles.geometry.attributes.position.array;
        if (analyser && audioEnabled) analyser.getByteFrequencyData(dataArray);

        const bins = document.querySelectorAll('.bin');
        for (let i = 0; i < positions.length; i += 3) {
            const idx = Math.floor(i / 3);
            const freq = audioEnabled && analyser ? (dataArray[idx % dataArray.length] / 255) : 0.5;
            const pulse = Math.sin(time * 6 + idx * 0.02) * 18 * freq;

            positions[i]     += Math.cos(time * 1.4 + idx) * 0.3;
            positions[i + 1] += Math.sin(time * 2.1 + idx * 0.5) * 0.4 + pulse * 0.12;
            positions[i + 2] += Math.sin(time * 0.9 + idx * 0.7) * 0.25;
        }
        particles.geometry.attributes.position.needsUpdate = true;

        // Update bins
        if (bins.length > 0 && audioEnabled) {
            const step = Math.floor(dataArray.length / bins.length);
            bins.forEach((bin, i) => {
                const val = dataArray[i * step] / 255 * 100;
                bin.style.height = `${val}%`;
            });
        }
    }

    camera.position.x = Math.sin(time * 0.18) * 35;
    camera.position.z = 90 + Math.cos(time * 0.14) * 50;
    camera.lookAt(0, 0, 0);

    composer.render();
}

// Mouse/touch
let mouseX = 0, mouseY = 0;
function onMouseMove(e) {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    gsap.to(camera.rotation, { y: mouseX * 0.14, x: mouseY * 0.10, duration: 1.8, ease: "power2.out" });
}
function onTouchMove(e) {
    if (e.touches) {
        mouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
        gsap.to(camera.rotation, { y: mouseX * 0.14, x: mouseY * 0.10, duration: 1.8, ease: "power2.out" });
    }
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

// Start
init();
animate();

// Button trigger
initBtn.addEventListener('click', startAscension);
