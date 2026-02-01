**TL;DR** – This file creates the Three.js universe (nebula, particles, avatar, post‑processing), handles socket.io communication, creates 3‑D text bubbles with Troika‑three‑text, plays sounds via Howler, and adds the little Easter‑egg behaviours you asked for.

```js
/* -------------------------------------------------
   Epic Tech AI – client side (Three.js + Socket.io)
   ------------------------------------------------- */
(() => {
  // ------------------- GLOBALS --------------------
  const canvas = document.getElementById('glCanvas');
  const socket = io(); // assumes same origin
  const chatLog = document.getElementById('chat-log');
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');

  // three.js essentials
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.set(0, 2, 8);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // orbit controls (touch friendly)
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 5;
  controls.maxDistance = 15;

  // ------------------- POST‑PROCESSING --------------------
  const composer = new THREE.EffectComposer(renderer);
  const renderPass = new THREE.RenderPass(scene, camera);
  composer.addPass(renderPass);

  const bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.2, 0.4, 0.85);
  bloomPass.threshold = 0;
  bloomPass.strength = 1.8;
  bloomPass.radius = 0.6;
  composer.addPass(bloomPass);

  const glitchPass = new THREE.GlitchPass();
  glitchPass.goWild = false; // set true for occasional mega‑glitches
  composer.addPass(glitchPass);

  // ------------------- BACKGROUND (nebula) --------------------
  const texLoader = new THREE.TextureLoader();
  const nebulaTex = texLoader.load('assets/nebula.jpg');
  scene.background = nebulaTex;

  // ------------------- PARTICLE FIELD (cannabis leaf) --------------------
  const leafTex = texLoader.load('assets/leaf.png');
  const leafGeo = new THREE.PlaneGeometry(0.8, 0.8);
  const leafMat = new THREE.MeshBasicMaterial({
    map: leafTex,
    transparent: true,
    opacity: 0.6,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const leafParticles = new THREE.Group();
  const leafCount = 120;
  for (let i = 0; i < leafCount; i++) {
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    leaf.position.set(
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 30
    );
    leaf.rotation.z = Math.random() * Math.PI * 2;
    leaf.scale.setScalar(0.5 + Math.random() * 0.8);
    leafParticles.add(leaf);
  }
  scene.add(leafParticles);

  // ------------------- CENTRAL AI AVATAR --------------------
  const avatarTex = texLoader.load('assets/avatar.png');
  const avatarMat = new THREE.SpriteMaterial({
    map: avatarTex,
    color: 0xffffff,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const avatar = new THREE.Sprite(avatarMat);
  avatar.scale.set(3, 3, 1);
  avatar.position.set(0, 1, 0);
  scene.add(avatar);

  // subtle pulse animation (idle)
  const pulse = { scale: 1 };
  gsap.to(pulse, {
    scale: 1.08,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    onUpdate: () => avatar.scale.setScalar(pulse.scale * 3),
  });

  // ------------------- SOUND SETUP --------------------
  const sounds = {
    ambient: new Howl({ src: ['assets/ambient-loop.mp3'], loop: true, volume: 0.3 }),
    whoosh: new Howl({ src: ['assets/sfx/whoosh.wav'], volume: 0.6 }),
    exhale: new Howl({ src: ['assets/sfx/exhale.wav'], volume: 0.5 }),
    glitch: new Howl({ src: ['assets/sfx/glitch.wav'], volume: 0.4 })
  };
  sounds.ambient.play();

  // ------------------- TEXT MESH HELPERS --------------------
  const textGroup = new THREE.Group(); // holds all floating messages
  scene.add(textGroup);

  const createFloatingText = (msg, isUser = true) => {
    const txt = new TroikaText();
    txt.text = msg;
    txt.fontSize = 0.4;
    txt.color = isUser ? '#00ffae' : '#ff00ff';
    txt.anchorX = 'center';
    txt.anchorY = 'middle';
    txt.outlineWidth = 0.02;
    txt.outlineColor = isUser ? '#004d33' : '#660066';
    txt.position.set(
      (Math.random() - 0.5) * 6,
      isUser ? -2 : 4, // start off‑screen (bottom vs top)
      (Math.random() - 0.5) * 4
    );
    txt.sync(); // required for Troika

    // animate into view
    const targetY = isUser ? Math.random() * 2 + 0.5 : Math.random() * -1 - 0.5;
    gsap.to(txt.position, {
      y: targetY,
      duration: 1.2,
      ease: 'power2.out',
      onComplete: () => {
        // fade out after a while
        gsap.to(txt.material, {
          opacity: 0,
          delay: 8,
          duration: 2,
          onComplete: () => textGroup.remove(txt)
        });
      }
    });

    textGroup.add(txt);
  };
