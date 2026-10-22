// Pure Web Audio API Cosmic Sound Engine (Zero external dependencies)
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playStardustChime(freq = 528) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {
    // Ignore audio autoplay restrictions gracefully
  }
}

export function playDeepCosmicDrone() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return null;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(55, ctx.currentTime); // A1 note deep drone

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(110, ctx.currentTime); // A2 harmonic

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, ctx.currentTime);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 3);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();

    return {
      stop: () => {
        try {
          gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 1);
          setTimeout(() => {
            osc1.stop();
            osc2.stop();
          }, 1000);
        } catch (e) {}
      }
    };
  } catch (e) {
    return null;
  }
}
