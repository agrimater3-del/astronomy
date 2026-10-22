import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, FastForward } from 'lucide-react';
import { playStardustChime } from '../utils/audio';

const LINE1_TEXT = "Welcome to";
const LINE2_PREFIX = "I2IT Astr";
const LINE2_SUFFIX = "nomy Club";

export default function HumanHandwritingIntro({ onComplete, isAudioEnabled, onToggleAudio }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: '50%', y: '50%' });
  const [writingComplete, setWritingComplete] = useState(false);

  const animFrameRef = useRef(null);
  const audioEnabledRef = useRef(isAudioEnabled);
  audioEnabledRef.current = isAudioEnabled;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let isCancelled = false;
    let dpr = window.devicePixelRatio || 1;

    const resizeCanvas = () => {
      dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Stardust ink particles emitted while writing
    const particles = [];
    const addPenParticles = (x, y) => {
      for (let i = 0; i < 2; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.5,
          life: 1.0,
          decay: 0.022 + Math.random() * 0.03,
          size: 1.2 + Math.random() * 1.8,
          color: Math.random() > 0.4 ? 'rgba(165, 243, 252,' : 'rgba(255, 255, 255,'
        });
      }
    };

    // Handwriting state
    let progressLine1 = 0;
    let progressLine2 = 0; // 0 to (PREFIX.length + SUFFIX.length)
    let currentPhase = 'line1'; // 'blank' | 'line1' | 'pause1' | 'line2' | 'finished' | 'zooming'

    let penX = window.innerWidth * 0.3;
    let penY = window.innerHeight * 0.4;
    let targetPenX = penX;
    let targetPenY = penY;
    let penDown = false;

    // Round galaxy aperture coordinates
    let oCenterPos = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.53, radius: 22 };
    let apertureRadius = 0;
    let targetApertureRadius = 0;

    let lastTime = performance.now();
    let charTimer = 0;
    let line1CharIndex = 0;
    let line2CharIndex = 0;
    const totalLine2Chars = LINE2_PREFIX.length + LINE2_SUFFIX.length;

    // Initial pause for suspense
    setTimeout(() => {
      if (!isCancelled) {
        currentPhase = 'line1';
        penDown = true;
      }
    }, 500);

    const render = (now) => {
      if (isCancelled) return;
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const W = window.innerWidth;
      const H = window.innerHeight;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Solid deep space background
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#02040b';
      ctx.fillRect(0, 0, W, H);

      // Font calculations
      const fontSize1 = Math.max(34, Math.min(W * 0.045, 60));
      const fontSize2 = Math.max(42, Math.min(W * 0.065, 84));

      const line1Y = H * 0.44;
      const line2Y = line1Y + fontSize1 * 1.35;

      // Line 1 metrics
      ctx.font = `600 ${fontSize1}px 'Caveat', 'Kalam', cursive, sans-serif`;
      const line1TotalWidth = ctx.measureText(LINE1_TEXT).width;
      const line1StartX = (W - line1TotalWidth) / 2;

      // Line 2 metrics without the 'O' glyph:
      // "I2IT Astr" + [ROUND GALAXY] + "nomy Club"
      ctx.font = `700 ${fontSize2}px 'Caveat', 'Kalam', cursive, sans-serif`;
      const wPrefix = ctx.measureText(LINE2_PREFIX).width;
      const wSuffix = ctx.measureText(LINE2_SUFFIX).width;

      // The circular space dedicated for the Round Galaxy
      const galaxyDiameter = Math.max(36, fontSize2 * 0.72);
      const galaxyGap = galaxyDiameter + 10;
      const line2TotalWidth = wPrefix + galaxyGap + wSuffix;
      const line2StartX = (W - line2TotalWidth) / 2;

      // Exact center of the Round Galaxy
      const computedOX = line2StartX + wPrefix + galaxyGap / 2;
      const computedOY = line2Y - fontSize2 * 0.28;
      const maxGalaxyRadius = galaxyDiameter / 2;
      oCenterPos = { x: computedOX, y: computedOY, radius: maxGalaxyRadius };

      // Update character progression
      if (currentPhase === 'line1') {
        charTimer += dt;
        const delay = LINE1_TEXT[line1CharIndex] === ' ' ? 0.18 : 0.085;
        if (charTimer >= delay && line1CharIndex < LINE1_TEXT.length) {
          charTimer = 0;
          line1CharIndex++;
          progressLine1 = line1CharIndex;
          if (audioEnabledRef.current) {
            playStardustChime(460 + (line1CharIndex / LINE1_TEXT.length) * 140);
          }
        }
        if (line1CharIndex >= LINE1_TEXT.length) {
          currentPhase = 'pause1';
          penDown = false;
          setTimeout(() => {
            if (!isCancelled) {
              currentPhase = 'line2';
              penDown = true;
            }
          }, 300);
        }
      } else if (currentPhase === 'line2') {
        charTimer += dt;
        let currentChar;
        if (line2CharIndex < LINE2_PREFIX.length) {
          currentChar = LINE2_PREFIX[line2CharIndex];
        } else {
          currentChar = LINE2_SUFFIX[line2CharIndex - LINE2_PREFIX.length];
        }

        // Slight pause when passing the galaxy
        const isTransitioningAcrossGalaxy = line2CharIndex === LINE2_PREFIX.length;
        const delay = isTransitioningAcrossGalaxy
          ? 0.28
          : currentChar === ' '
          ? 0.20
          : 0.075;

        if (charTimer >= delay && line2CharIndex < totalLine2Chars) {
          charTimer = 0;
          line2CharIndex++;
          progressLine2 = line2CharIndex;

          // As soon as "Astr" is written, open the round galaxy portal!
          if (line2CharIndex >= LINE2_PREFIX.length) {
            targetApertureRadius = maxGalaxyRadius;
          }

          if (audioEnabledRef.current) {
            playStardustChime(540 + (line2CharIndex / totalLine2Chars) * 180);
          }
        }

        if (line2CharIndex >= totalLine2Chars) {
          currentPhase = 'finished';
          penDown = false;
          setWritingComplete(true);

          // Hold the complete view of "Welcome to I2IT Astr [GALAXY] nomy Club", then zoom into the galaxy!
          setTimeout(() => {
            if (!isCancelled) {
              triggerZoomIntoGalaxy(computedOX, computedOY);
            }
          }, 700);
        }
      }

      // Smoothly expand round galaxy aperture
      apertureRadius += (targetApertureRadius - apertureRadius) * 0.14;

      // Pen target positioning
      if (currentPhase === 'line1') {
        ctx.font = `600 ${fontSize1}px 'Caveat', 'Kalam', cursive, sans-serif`;
        const writtenSub = LINE1_TEXT.substring(0, line1CharIndex);
        const subW = ctx.measureText(writtenSub).width;
        targetPenX = line1StartX + subW + 2;
        targetPenY = line1Y - 6;
      } else if (currentPhase === 'line2') {
        ctx.font = `700 ${fontSize2}px 'Caveat', 'Kalam', cursive, sans-serif`;
        if (line2CharIndex <= LINE2_PREFIX.length) {
          const writtenPrefix = LINE2_PREFIX.substring(0, line2CharIndex);
          const subW = ctx.measureText(writtenPrefix).width;
          targetPenX = line2StartX + subW + 2;
          targetPenY = line2Y - 8;
        } else {
          const suffixIndex = line2CharIndex - LINE2_PREFIX.length;
          const writtenSuffix = LINE2_SUFFIX.substring(0, suffixIndex);
          const subW = ctx.measureText(writtenSuffix).width;
          targetPenX = line2StartX + wPrefix + galaxyGap + subW + 2;
          targetPenY = line2Y - 8;
        }
      }

      // Smooth pen motion
      penX += (targetPenX - penX) * 0.35;
      penY += (targetPenY - penY) * 0.35;

      if (penDown) {
        addPenParticles(penX, penY);
      }

      // ------------------------------------------------------------
      // DRAW HANDWRITTEN TEXT (NO 'O' GLYPH DRAWN)
      // ------------------------------------------------------------
      ctx.textBaseline = 'alphabetic';
      ctx.textAlign = 'left';

      // 1. Line 1: "Welcome to"
      if (progressLine1 > 0) {
        ctx.font = `600 ${fontSize1}px 'Caveat', 'Kalam', cursive, sans-serif`;
        ctx.fillStyle = '#f1f5f9';
        ctx.shadowColor = 'rgba(165, 243, 252, 0.4)';
        ctx.shadowBlur = 6;
        ctx.fillText(LINE1_TEXT.substring(0, progressLine1), line1StartX, line1Y);
        ctx.shadowBlur = 0;
      }

      // 2. Line 2 Prefix: "I2IT Astr"
      ctx.font = `700 ${fontSize2}px 'Caveat', 'Kalam', cursive, sans-serif`;
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
      ctx.shadowBlur = 8;

      if (progressLine2 > 0) {
        const prefixChars = Math.min(progressLine2, LINE2_PREFIX.length);
        ctx.fillText(LINE2_PREFIX.substring(0, prefixChars), line2StartX, line2Y);
      }

      // 3. Line 2 Suffix: "nomy Club" (starts after the Round Galaxy)
      if (progressLine2 > LINE2_PREFIX.length) {
        const suffixChars = progressLine2 - LINE2_PREFIX.length;
        const suffixStartX = line2StartX + wPrefix + galaxyGap;
        ctx.fillText(LINE2_SUFFIX.substring(0, suffixChars), suffixStartX, line2Y);
      }
      ctx.shadowBlur = 0;

      // ------------------------------------------------------------
      // ROUND GALAXY PORTAL: PUNCH CIRCLE WHERE 'O' WOULD BE
      // ------------------------------------------------------------
      if (apertureRadius > 1.0) {
        // Cut out the circle so the 3D Milky Way behind the canvas shows through
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(oCenterPos.x, oCenterPos.y, apertureRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Glowing cosmic rim around our round galaxy
        ctx.save();
        ctx.globalCompositeOperation = 'source-over';
        ctx.beginPath();
        ctx.arc(oCenterPos.x, oCenterPos.y, apertureRadius + 0.5, 0, Math.PI * 2);
        ctx.lineWidth = 1.8;
        ctx.strokeStyle = 'rgba(147, 197, 253, 0.85)';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 12;
        ctx.stroke();

        // Celestial stardust core indicator
        const pulse = 0.5 + 0.5 * Math.sin(now * 0.006);
        ctx.beginPath();
        ctx.arc(oCenterPos.x, oCenterPos.y, 2.0 + pulse * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.45 + pulse * 0.45})`;
        ctx.fill();
        ctx.restore();
      }

      // ------------------------------------------------------------
      // STARDUST INK PARTICLES
      // ------------------------------------------------------------
      ctx.globalCompositeOperation = 'source-over';
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.life})`;
        ctx.fill();
      }

      // ------------------------------------------------------------
      // HUMAN CALLIGRAPHY PEN / STYLUS
      // ------------------------------------------------------------
      if (penDown && currentPhase !== 'finished') {
        ctx.save();
        ctx.translate(penX, penY);
        ctx.rotate((38 * Math.PI) / 180);

        // Glowing pen nib point
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 8;
        ctx.fill();

        // Pen nib triangle (golden metallic chiseled nib)
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-4, -14);
        ctx.lineTo(4, -14);
        ctx.closePath();
        ctx.fillStyle = '#e2e8f0';
        ctx.fill();

        // Slender pen barrel extending upwards
        const grad = ctx.createLinearGradient(0, -14, 0, -60);
        grad.addColorStop(0, '#94a3b8');
        grad.addColorStop(0.5, '#475569');
        grad.addColorStop(1, 'rgba(30, 41, 59, 0.2)');

        ctx.fillStyle = grad;
        ctx.fillRect(-3, -60, 6, 46);

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      isCancelled = true;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const triggerZoomIntoGalaxy = (ox, oy) => {
    if (isZooming) return;
    setIsZooming(true);
    setZoomOrigin({ x: `${ox}px`, y: `${oy}px` });

    setTimeout(() => {
      onComplete();
    }, 1350);
  };

  const handleSkip = (e) => {
    e.stopPropagation();
    triggerZoomIntoGalaxy(window.innerWidth * 0.5, window.innerHeight * 0.53);
  };

  return (
    <div
      ref={containerRef}
      className={`human-handwriting-overlay ${isZooming ? 'zooming-into-galaxy' : ''}`}
      style={{
        transformOrigin: `${zoomOrigin.x} ${zoomOrigin.y}`
      }}
      onClick={handleSkip}
    >
      {/* Top Controls: Sound Toggle and Skip */}
      <div className="handwriting-header-controls" onClick={(e) => e.stopPropagation()}>
        <button
          className="btn-intro-control"
          onClick={onToggleAudio}
          title={isAudioEnabled ? "Sound ON" : "Sound OFF"}
        >
          {isAudioEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
        </button>

        <button
          className="btn-intro-control btn-skip-portal"
          onClick={handleSkip}
          title="Zoom straight into the galaxy"
        >
          <span>Skip to Galaxy</span>
          <FastForward size={14} />
        </button>
      </div>

      {/* HTML5 Canvas Surface */}
      <canvas ref={canvasRef} className="handwriting-html5-canvas" />

      {/* Subtle bottom prompt */}
      <div className="handwriting-footer-hint">
        {writingComplete ? "Entering Milky Way galaxy..." : "Click anywhere to explore immediately"}
      </div>
    </div>
  );
}
