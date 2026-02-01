/**
 * TSL: THE ABSOLUTE ALGORITHM vΩ.∞ — SOVEREIGN QUANTUM ENGINE
 * Manifested by SoundForge Legion & CodeSynth Engineers
 * Objective: High-Fidelity Audio-Visual Singularity
 */

let scene, camera, renderer, singularity, particles, clock;
let audioCtx, analyser, dataArray, mainGain;
let bpm = 112; // Sovereign G-Funk Tempo
let step = 0;

// 1. AXIOMATIC GENESIS: THE HYPER-DIMENSIONAL SHADER
const _SINGULARITY_VERT = `
    varying vec2 vUv;
    varying float vDisplacement;
    uniform float uTime;
    uniform float uAudio;

    void main() {
        vUv = uv;
        vec3 pos = position;
        float noise = sin(pos.x * 3.0 + uTime) * cos(pos.y * 3.0 + uTime) * (uAudio * 2.0);
        vDisplacement = noise;
        pos += normal * noise * 8.0; 
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
`;

const _SINGULARITY_FRAG = `
    varying vec2 vUv;
    varying float vDisplacement;
    uniform float uTime;

    void main() {
        vec3 colorA = vec3(0.0, 0.95, 1.0); // Omega Cyan
        vec3 colorB = vec3(1.0, 0.0, 0.76); // Omega Magenta
        vec3 finalColor = mix(colorA, colorB, vDisplacement + 0.5 + sin(uTime * 0.2));
        float scanline = step(0.99, sin(vUv.y * 200.0 + uTime * 5.0));
        finalColor += scanline * 0.4;
        gl_FragColor = vec4(finalColor, 0.9);
    }
`;

// 2. THE SOUNDFORGE LEGION: QUANTUM AUDIO ENGINE v2.0
function initQuantumAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    mainGain = audioCtx.createGain();
    mainGain.gain.value = 0.5;
    mainGain.connect(analyser);
    analyser.connect(audioCtx.destination);

    startSequencer();
    addVoidLog("QUANTUM_AUDIO_ENGINE: HIGH_FIDELITY_SYNC");
}

function createSynth(freq, type, gainValue, decay) {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    const now = audioCtx.currentTime;

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    g.gain.setValueAtTime(gainValue, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + decay);

    osc.connect(g);
    g.connect(mainGain);
    osc.start();
    osc.stop(now + decay);
}

function startSequencer() {
    const interval = (60 / bpm) / 2 * 1000;
    setInterval(() => {
        const now = audioCtx.currentTime;
        
        // Movement I: The Bass Drop (Kick & Sub)
        if (step % 4 === 0) {
            createSynth(55, 'sine', 0.8, 0.5); // Sub Bass A1
            gsap.to(singularity.scale, { x: 1.3, y: 1.3, z: 1.3, duration: 0.1, yoyo: true, repeat: 1 });
        }

        // Movement II: The G-Funk Portamento (Lead)
        if (step % 8 === 2 || step % 8 === 6) {
            const notes = [440, 493.88, 523.25, 587.33]; // A Minor
            createSynth(notes[Math.floor(Math.random() * notes.length)], 'triangle', 0.1, 0.8);
        }

        // Movement III: Ethereal Atmosphere (Hats/Perc)
        if (step % 2 === 1) {
            const noise = audioCtx.createOscillator(); // Simulated noise
            noise.type = 'triangle';
            noise.frequency.setValueAtTime(8000, now);
            const ng = audioCtx.createGain();
            ng.gain.setValueAtTime(0.02, now);
            ng.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            noise.connect(ng);
            ng.connect(mainGain);
            noise.start(); noise.stop(now + 0.05);
        }

        step++;
    }, interval);
}

// 3. CORE SCENE ORCHESTRATION
function initScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('experience-container').appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(15, 64);
    const material = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uAudio: { value: 0 } },
        vertexShader: _SINGULARITY_VERT,
        fragmentShader: _SINGULARITY_FRAG,
        wireframe: true,
        transparent: true
    });

    singularity = new THREE.Mesh(geometry, material);
    scene.add(singularity);

    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(5000 * 3);
    for (let i = 0; i < 15000; i++) pPos[i] = (Math.random() - 0.5) * 250;
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x00f2ff, size: 0.15 }));
    scene.add(particles);

    clock = new THREE.Clock();
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();
    let audioForce = 0.1;

    if (analyser) {
        analyser.getByteFrequencyData(dataArray);
        audioForce = dataArray.reduce((a, b) => a + b) / dataArray.length / 80;
        document.getElementById('visualizer-bar').style.width = `${audioForce * 150}%`;
    }

    singularity.material.uniforms.uTime.value = time;
    singularity.material.uniforms.uAudio.value = audioForce;
    singularity.rotation.y += 0.004 + (audioForce * 0.02);
    particles.rotation.y -= 0.0005;
    
    renderer.render(scene, camera);
}

// 4. THE EXECUTION PROTOCOL: ACTIVATION
document.getElementById('init-core-btn').onclick = () => {
    gsap.to("#load-progress", { width: "100%", duration: 2, ease: "power4.inOut", onComplete: () => {
        gsap.to("#boot-screen", { opacity: 0, duration: 1, onComplete: () => {
            document.getElementById('boot-screen').style.display = 'none';
            document.getElementById('hud-overlay').style.display = 'block';
            initQuantumAudio();
            generateVoidLogs();
            updateChrono();
        }});
    }});
};

function generateVoidLogs() {
    const logs = ["RETRIVING_VOID_ARCHAEOLOGY", "SOUNDFORGE_LEGION_SYNC", "AXIOMATIC_GENESIS_v2", "QUANTUM_FOAM_STABLE"];
    setInterval(() => {
        const list = document.getElementById('void-logs');
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerText = `> ${logs[Math.floor(Math.random() * logs.length)]}`;
        list.prepend(entry);
        if (list.children.length > 6) list.lastChild.remove();
    }, 3000);
}

function updateChrono() {
    setInterval(() => {
        const d = new Date();
        document.getElementById('chrono-clock').innerText = d.toTimeString().split(' ') + ':' + Math.floor(Math.random()*99);
    }, 100);
}

initScene();
