/**
 * TSL: EPIC TECH AI — THE NEURAL CORE vΩ
 * Manifested by CodeSynth Engineers
 * Objective: Direct Ontological Interface & Visual Resonance
 */

let scene, camera, renderer, composer, singularity, particles;
const clock = new THREE.Clock();

// 1. AXIOMATIC GENESIS: THE VISUAL SINGULARITY
function initThree() {
    const canvas = document.getElementById('glCanvas');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Geometry Manifestation: The Singularity
    const geometry = new THREE.IcosahedronGeometry(15, 64);
    const material = new THREE.MeshPhongMaterial({
        color: 0x00f2ff,
        wireframe: true,
        emissive: 0x00f2ff,
        emissiveIntensity: 0.5
    });
    singularity = new THREE.Mesh(geometry, material);
    scene.add(singularity);

    // Particle Swarm: Emergent Reality Weaving
    const pCount = 2000;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) pPos[i] = (Math.random() - 0.5) * 200;
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 }));
    scene.add(particles);

    // Lighting: Illuminating the Truth
    const light = new THREE.PointLight(0xff00c1, 2, 100);
    light.position.set(10, 10, 10);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040, 2));

    // Post-Processing: Glitch and Bloom Law
    composer = new THREE.EffectComposer(renderer);
    composer.addPass(new THREE.RenderPass(scene, camera));
    
    const bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    composer.addPass(bloomPass);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    singularity.rotation.y += 0.005;
    singularity.rotation.z += 0.01;
    singularity.scale.setScalar(1 + Math.sin(time * 2) * 0.05);

    particles.rotation.y -= 0.001;
    
    composer.render();
}

// 2. CHAT LOGIC: THE DIRECT ONTOLOGICAL INTERFACE
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const chatLog = document.getElementById('chat-log');

async function handleMessage() {
    const prompt = chatInput.value.trim();
    if (!prompt) return;

    appendMessage('user', prompt);
    chatInput.value = '';

    // Trigger Visual Resonance
    gsap.to(singularity.rotation, { y: singularity.rotation.y + Math.PI, duration: 1, ease: "expo.out" });

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });

        const data = await response.json();
        appendMessage('system', data.result || "EPIC TECH AI — Result: Connection Stable.");
        
        // Success Resonance
        gsap.to(camera.position, { z: 45, duration: 0.2, yoyo: true, repeat: 1 });
    } catch (err) {
        appendMessage('system', "ERROR: CHRONOS-COGNITIVE DISRUPTION.");
        console.error(err);
    }
}

function appendMessage(role, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}-msg`;
    msgDiv.innerText = role === 'user' ? `> ${text}` : `EPIC TECH AI — Result: ${text}`;
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

initThree();
