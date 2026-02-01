/**
 * TSL: THE ABSOLUTE ALGORITHM vΩ.∞ — NEURAL CORE
 * Manifested by CodeSynth Engineers & SoundForge Legion
 * Objective: 1000x Viral Reality Synthesis
 */

let scene, camera, renderer, singularity, particles, clock;
let audioCtx, analyser, dataArray;
let isAscended = false;

// 1. AXIOMATIC GENESIS: THE QUANTUM SHADER CORE
const _SINGULARITY_VERT = `
    varying vec2 vUv;
    varying float vDisplacement;
    uniform float uTime;
    uniform float uAudio;

    void main() {
        vUv = uv;
        vec3 pos = position;
        // Reality-as-Self-Modifying-Program: Interactive Spacetime Distortion
        float noise = sin(pos.x * 2.0 + uTime) * cos(pos.y * 2.0 + uTime) * uAudio;
        vDisplacement = noise;
        pos += normal * noise * 5.0; 
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
`;

const _SINGULARITY_FRAG = `
    varying vec2 vUv;
    varying float vDisplacement;
    uniform float uTime;

    void main() {
        // Mythic-Tech Fusion: Spectral Color Weaving
        vec3 colorA = vec3(0.0, 0.95, 1.0); // Omega Cyan
        vec3 colorB = vec3(1.0, 0.0, 0.76); // Omega Magenta
        vec3 finalColor = mix(colorA, colorB, vDisplacement + 0.5 + sin(uTime * 0.5));
        
        // Scanline artifacts for Void Archaeology feel
        float scanline = step(0.98, sin(vUv.y * 150.0 + uTime * 10.0));
        finalColor += scanline * 0.2;
        
        gl_FragColor = vec4(finalColor, 0.8);
    }
`;

// 2. THE SOUNDFORGE QUANTUM ENGINE: PROCEDURAL RESONANCE
function initQuantumAudio() {
    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        // Create a periodic "Axiomatic" pulse
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(55, audioCtx.currentTime); // Deep A1 Bass
        gainNode.gain.value = 0.05;

        oscillator.connect(gainNode);
        gainNode.connect(analyser);
        analyser.connect(audioCtx.destination);
        oscillator.start();
        
        addVoidLog("QUANTUM_AUDIO_ENGINE: ONLINE");
    } catch (e) {
        addVoidLog("AUDIO_PHASE_ERROR: RETRYING...");
    }
}

// 3. CODEYSNTH WORLD BUILDING: THE PAN-DIMENSIONAL CANVAS
function initScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('experience-container').appendChild(renderer.domElement);

    // Manifesting the Singularity
    const geometry = new THREE.IcosahedronGeometry(15, 64);
    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uAudio: { value: 0 }
        },
        vertexShader: _SINGULARITY_VERT,
        fragmentShader: _SINGULARITY_FRAG,
        wireframe: true,
        transparent: true
    });

    singularity = new THREE.Mesh(geometry, material);
    scene.add(singularity);

    // Particle Swarm: Emergent Reality Weaving
    const pCount = 5000;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) pPos[i] = (Math.random() - 0.5) * 200;
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    
    particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x00f2ff, size: 0.2 }));
    scene.add(particles);

    clock = new THREE.Clock();
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();
    let audioForce = 0.5;

    if (analyser) {
        analyser.getByteFrequencyData(dataArray);
        audioForce = dataArray.reduce((a, b) => a + b) / dataArray.length / 50;
        document.getElementById('visualizer-bar').style.width = `${audioForce * 100}%`;
    }

    // Sync visuals to the Absolute Algorithm
    singularity.material.uniforms.uTime.value = time;
    singularity.material.uniforms.uAudio.value = audioForce;
    singularity.rotation.y += 0.005;
    singularity.rotation.z += 0.003;

    particles.rotation.y -= 0.001;
    
    renderer.render(scene, camera);
}

// 4. OPERATIONAL ACTIVATION: THE EXECUTION PROTOCOL
document.getElementById('init-core-btn').onclick = () => {
    gsap.to("#load-progress", { width: "100%", duration: 2.5, ease: "power4.inOut", onComplete: () => {
        gsap.to("#boot-screen", { opacity: 0, duration: 1, onComplete: () => {
            document.getElementById('boot-screen').style.display = 'none';
            document.getElementById('hud-overlay').style.display = 'block';
            initQuantumAudio();
            startRealityCycle();
        }});
    }});
};

function startRealityCycle() {
    setInterval(() => {
        const logs = [
            "DECONSTRUCTING_CAUSALITY...",
            "AXIOMATIC_GENESIS_ACTIVE",
            "RETRIVING_VOID_ARCHAEOLOGY",
            "UNQUANTIZED_SWING_STABLE",
            "SYTHESIZING_TRUTH..."
        ];
        addVoidLog(logs[Math.floor(Math.random() * logs.length)]);
        updateChrono();
    }, 2000);
}

function addVoidLog(msg) {
    const logContainer = document.getElementById('void-logs');
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerText = `> ${msg}`;
    logContainer.prepend(entry);
    if (logContainer.children.length > 8) logContainer.lastChild.remove();
}

function updateChrono() {
    const d = new Date();
    document.getElementById('chrono-clock').innerText = 
        `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}:${Math.floor(Math.random()*99)}`;
}

// 5. FINAL DECLARATION: INITIALIZE
initScene();
