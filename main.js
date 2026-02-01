console.log("main.js started loading");

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
let audioCtx, analyser, dataArray = new Uint8Array(512);
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
    console.log("init() called");

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000004);
    scene.fog = new THREE.FogExp2(0x000004, 0.00028);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
    camera.position.set(0, 40, 140);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.zIndex = '1';
    renderer.domElement.style.opacity = '1';
    experience.appendChild(renderer.domElement);
    console.log("Renderer canvas appended to experience-container");

    // Post-processing with fallback
    try {
        composer = new THREE.EffectComposer(renderer);
        const renderPass = new THREE.RenderPass(scene, camera);
        composer.addPass(renderPass);

        const bloom = new THREE.UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            2.4, 0.55, 0.78
        );
        composer.addPass(bloom);
        console.log("Bloom post-processing OK");
    } catch (e) {
        console.warn("Composer failed:", e);
        composer = { render: () => renderer.render(scene, camera) };
    }

    // Core orb – make more visible
    const coreGeo = new THREE.IcosahedronGeometry(30, 5);
    const coreMat = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        wireframe: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // Particles – larger & brighter
    const particleCount = 18000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        const r = 80 + Math.random() * 200;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i]     = r * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = r * Math.cos(phi);

        colors[i]     = 0.2 + Math.random() * 0.8;
        colors[i + 1] = 0.5 + Math.random() * 0.5;
        colors[i + 2] = 1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 2.2,  // larger for visibility
        vertexColors: true,
        transparent: true,
        opacity: 1.0,
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
        progress += Math.random() * 12;
        if (progress >= 100) {
            clearInterval(interval);
            initBtn.disabled = false;
            initBtn.style.opacity = 1;
            console.log("Loading done, button enabled");
        }
        loadProgress.style.width = `${progress}%`;
    }, 50);
}

async function startAscension() {
    console.log("Ascension triggered");
    bootScreen.classList.add('hidden');

    // Force audio resume on user gesture
    if (audioCtx && audioCtx.state === 'suspended') {
        await audioCtx.resume();
        console.log("AudioContext resumed on click");
    }

    setTimeout(() => {
        hudOverlay.style.display = 'block';
        hudOverlay.classList.add('active');
        startChronoClock();
        startLogStreamer();
        enableAudio();
    }, 1800);

    ascensionPhase = 1;
    gsap.to(camera.position, { z: 80, y: 30, duration: 12, ease: "power4.inOut" });
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
    }, 3000);
}

async function enableAudio() {
    console.log("enableAudio called");
    if (audioCtx && audioCtx.state === 'suspended') await audioCtx.resume();

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        await audioCtx.resume();
        const source = audioCtx.createMediaStreamSource(stream);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        audioEnabled = true;
        console.log("Mic enabled");

        for (let i = 0; i < 32; i++) {
            const bin = document.createElement('div');
            bin.className = 'bin';
            freqBins.appendChild(bin);
        }
    } catch (e) {
        console.log("Mic failed:", e);
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        await audioCtx.resume();

        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 440; // Changed to 440Hz (A note) – easier to hear for testing
        const gain = audioCtx.createGain();
        gain.gain.value = 0.8; // louder
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        console.log("Fallback tone (440Hz loud) started – should be clearly audible");

        dataArray = new Uint8Array(128);
        setInterval(() => {
            for (let i = 0; i < dataArray.length; i++) {
                dataArray[i] = 100 + Math.sin(time * 4 + i * 0.5) * 100;
            }
        }, 50);
        audioEnabled = true;
    }
}

// ... (keep animate(), onMouseMove, onTouchMove, onResize the same as previous version)

init();
animate();

initBtn.addEventListener('click', startAscension);
console.log("main.js fully executed");
