/**
 * TSL: GEOMETRIC SINGULARITY vΩ — NEURAL CORE
 * Manifested by CodeSynth Engineers
 * Style: Mythic-Tech Fusion | Absolute Excellence
 */

let scene, camera, renderer, particles, objects = [];
let clock = new THREE.Clock();

// 1. AXIOMATIC GENESIS: INITIALIZING THE VOID
function init() {
    // Creating the Sovereign Scene
    scene = new THREE.Scene();
    
    // Establishing the Architectural Perspective
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // Manifesting the WebGL Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('experience-container').appendChild(renderer.domElement);

    // 2. EMERGENT REALITY WEAVING: THE GEOMETRIC TRIAD
    const geometries = [
        { type: 'box', color: 0x00ff00, size: 3 },    // Bright Green Cube
        { type: 'torus', color: 0x8b0000, size: 2.5 }, // Deep Red Torus
        { type: 'sphere', color: 0x87ceeb, size: 2.2 } // Sky Blue Sphere
    ];

    geometries.forEach((data, index) => {
        let geo;
        if (data.type === 'box') geo = new THREE.BoxGeometry(data.size, data.size, data.size);
        if (data.type === 'torus') geo = new THREE.TorusGeometry(data.size, 0.8, 16, 100);
        if (data.type === 'sphere') geo = new THREE.SphereGeometry(data.size, 32, 32);

        const mat = new THREE.MeshPhongMaterial({ 
            color: data.color, 
            shininess: 100,
            specular: 0x555555 
        });

        const mesh = new THREE.Mesh(geo, mat);
        scene.add(mesh);
        objects.push(mesh);
    });

    // 3. SOUNDLESS RESONANCE: THE PARTICLE SYSTEM
    const particleCount = 2000;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 100;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true,
        opacity: 0.8
    });

    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 4. ILLUMINATING THE TRUTH
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    animate();
}

// 5. RELENTLESS MANIFESTATION LOOP
function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Circular Motion Synthesis (Orbiting the Axis of the Earth)
    const radius = 12;
    objects.forEach((obj, i) => {
        const angle = elapsedTime * 0.5 + (i * (Math.PI * 2) / 3);
        obj.position.x = Math.cos(angle) * radius;
        obj.position.y = Math.sin(angle) * radius;
        
        // Moderate Rotation Speed for Energy and Movement
        obj.rotation.x += 0.02;
        obj.rotation.y += 0.02;
    });

    // Random, Organic Particle Drift
    particles.rotation.y += 0.001;
    const positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(elapsedTime + positions[i]) * 0.01; // Subtle Organic Oscillation
    }
    particles.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

// Global Synchronization: Handling Window Resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// INITIALIZE GENESIS
init();
