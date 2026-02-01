// ... (keep the top part the same, up to enableAudio function)

// Replace the enableAudio function with this:
async function enableAudio() {
    console.log("Attempting audio enable");

    if (audioCtx && audioCtx.state === 'suspended') {
        await audioCtx.resume();
        console.log("AudioContext resumed");
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') await audioCtx.resume();
        const source = audioCtx.createMediaStreamSource(stream);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        audioEnabled = true;

        for (let i = 0; i < 32; i++) {
            const bin = document.createElement('div');
            bin.className = 'bin';
            if (freqBins) freqBins.appendChild(bin);
        }
        console.log("Microphone audio enabled – visualizer should react");
    } catch (e) {
        console.log("Mic access failed:", e.name || e.message, "– using fallback tone");

        if (!audioCtx || audioCtx.state === 'closed') {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            await audioCtx.resume();
            console.log("Fallback: AudioContext resumed");
        }

        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 963;
        const gain = audioCtx.createGain();
        gain.gain.value = 0.5; // louder for testing
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        console.log("Fallback 963 Hz tone started – you should hear a constant hum");

        dataArray = new Uint8Array(128);
        setInterval(() => {
            for (let i = 0; i < dataArray.length; i++) {
                dataArray[i] = 70 + Math.sin(time * 5 + i * 0.6) * 70;
            }
        }, 40);
        audioEnabled = true;
    }
}

// In startAscension(), add this right after setTimeout:
startAscension = () => {
    console.log("startAscension() triggered");
    bootScreen.classList.add('hidden');

    // Resume audio context on user gesture if still suspended
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().then(() => console.log("Audio resumed on ascension gesture"));
    }

    // ... rest unchanged
}
