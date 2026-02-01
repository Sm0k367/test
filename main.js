console.log("main.js vDEBUG loaded");

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
    console.log("init() running");

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x001122); // TEMP bright blue-gray to TEST visibility

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 20, 80); // closer

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.zIndex = '1';
    experience.appendChild(renderer.domElement);
    console.log("Canvas appended – check if visible in DOM");

    // Composer
    try {
        composer = new THREE.EffectComposer(renderer);
        composer.addPass(new THREE.RenderPass(scene, camera));
        const bloom = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.8, 0.4, 0.85);
        composer.addPass(bloom);
        console.log("Bloom OK");
    } catch (e) {
        console.warn("Bloom failed – using direct render", e);
        composer = { render: () => renderer.render(scene, camera) };
    }

    // Bright orb
    const coreGeo = new THREE.IcosahedronGeometry(35, 6);
    const coreMat = new THREE.MeshBasicMaterial({
        color: 0xffffff, // white for max visibility test
        wireframe: true,
        transparent: true,
        opacity: 1.0,
        blending: THREE.AdditiveBlending
    });
    coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // Bright particles
    const particleCount = 12000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        const r = 50 + Math.random() * 150;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i]     = r * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = r * Math.cos(phi);

        colors[i]     = 1;
        colors[i + 1] = 0.8;
        colors[i + 2] = 0.3; // bright yellow-white
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 4.5,
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
        progress += Math.random() * 15;
        if (progress >= 100) {
            clearInterval(interval);
            initBtn.disabled = false;
            initBtn.style.opacity = 1;
            console.log("Button ready");
        }
        loadProgress.style.width = `${Math.min(progress, 100)}%`;
    }, 40);
}

async function startAscension() {
    console.log("ASCENSION CLICKED");
    bootScreen.classList.add('hidden');

    // Force audio resume + fallback tone immediately
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            await audioCtx.resume();
            console.log("AudioContext resumed on click");
        }

        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 440;
        const gain = audioCtx.createGain();
        gain.gain.value = 0.9; // very audible
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        console.log("TEST TONE 440Hz PLAYING NOW – should hear loud hum");
    } catch (e) {
        console.error("Audio init failed:", e);
    }

    setTimeout(() => {
        hudOverlay.style.display = 'block';
        hudOverlay.classList.add('active');
        startChronoClock();
        startLogStreamer();
        enableAudio(); // try mic after tone
    }, 1500);

    ascensionPhase = 1;
    gsap.to(camera.position, { z: 60, y: 15, duration: 10, ease: "power3.out" });
}

function enableAudio() {
    console.log("Trying mic");
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const source = audioCtx.createMediaStreamSource(stream);
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = 512;
            source.connect(analyser);
            dataArray = new Uint8Array(analyser.frequencyBinCount);
            audioEnabled = true;
            console.log("MIC ACTIVE");
            // add bins
            for (let i = 0; i < 32; i++) {
                const bin = document.createElement('div');
                bin.className = 'bin';
                freqBins.appendChild(bin);
            }
        })
        .catch(e => console.log("Mic denied:", e));
}

// Animate
function animate() {
    requestAnimationFrame(animate);
    time += 0.016;

    if (ascensionPhase >= 1) {
        if (coreMesh) {
            coreMesh.rotation.x += 0.004;
            coreMesh.rotation.y += 0.006;
        }
        if (particles) {
            const pos = particles.geometry.attributes.position.array;
            for (let i = 0; i < pos.length; i += 3) {
                pos[i + 1] += Math.sin(time + i * 0.001) * 0.5;
            }
            particles.geometry.attributes.position.needsUpdate = true;
        }
    }

    if (composer) composer.render();
}

function onMouseMove(e) {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    gsap.to(camera.rotation, { y: x * 0.15, x: y * 0.1, duration: 2 });
}

function onTouchMove(e) {
    if (e.touches.length > 0) {
        const x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        const y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
        gsap.to(camera.rotation, { y: x * 0.15, x: y * 0.1, duration: 2 });
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
console.log("main.js ready");
