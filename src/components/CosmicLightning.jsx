import React, { useEffect, useState } from 'react';
import { playStardustChime } from '../utils/audio';

export default function CosmicLightning({ onLightningStrike, isAudioEnabled }) {
  // Stages: 'blank' (0-1s) -> 'lightning' (1-1.4s) -> 'done' (>1.4s)
  const [stage, setStage] = useState('blank');
  const [flashIntensity, setFlashIntensity] = useState(0);

  useEffect(() => {
    // 1. First 1.0 second: pure blank screen
    const blankTimer = setTimeout(() => {
      setStage('lightning');
      setFlashIntensity(1.0);

      if (onLightningStrike) {
        onLightningStrike();
      }

      if (isAudioEnabled) {
        // Dramatic cosmic lightning surge chimes
        playStardustChime(320);
        setTimeout(() => playStardustChime(580), 80);
        setTimeout(() => playStardustChime(880), 160);
      }

      // Quick flash fade-out
      setTimeout(() => setFlashIntensity(0.7), 60);
      setTimeout(() => setFlashIntensity(0.3), 180);
      setTimeout(() => {
        setFlashIntensity(0);
        setStage('done');
      }, 420);
    }, 1000);

    return () => clearTimeout(blankTimer);
  }, []);

  if (stage === 'done') return null;

  return (
    <div
      className="cosmic-intro-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 50,
        pointerEvents: 'none',
        backgroundColor: stage === 'blank' ? '#02040b' : 'transparent',
        transition: stage === 'blank' ? 'none' : 'opacity 0.3s ease-out'
      }}
    >
      {/* Intense Lightning Flash & Radial Energy Burst */}
      {stage === 'lightning' && (
        <>
          {/* Screen Flash Glow */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(circle at center, rgba(255,255,255,${flashIntensity}) 0%, rgba(56,189,248,${flashIntensity * 0.7}) 35%, rgba(2,4,11,0) 70%)`,
              transition: 'all 0.15s ease-out'
            }}
          />

          {/* Central Electric Lightning Arcs */}
          <svg
            viewBox="0 0 1000 1000"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              filter: 'drop-shadow(0 0 16px #38bdf8) drop-shadow(0 0 35px #ffffff)'
            }}
          >
            {/* Core Lightning Fork 1 */}
            <path
              d="M 500 200 L 490 340 L 515 370 L 485 500 L 525 540 L 495 680 L 510 800"
              stroke="#ffffff"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            {/* Core Lightning Fork 2 */}
            <path
              d="M 500 200 L 520 310 L 480 390 L 530 480 L 475 560 L 505 650 L 500 800"
              stroke="#67e8f9"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            {/* Branch 1 */}
            <path
              d="M 485 500 L 430 530 L 410 590 L 370 610"
              stroke="#a5f3fc"
              strokeWidth="2.5"
              fill="none"
            />
            {/* Branch 2 */}
            <path
              d="M 525 540 L 580 560 L 610 620 L 650 640"
              stroke="#a5f3fc"
              strokeWidth="2.5"
              fill="none"
            />
            {/* Branch 3 */}
            <path
              d="M 490 340 L 440 370 L 420 420"
              stroke="#38bdf8"
              strokeWidth="2"
              fill="none"
            />
            {/* Center Electric Plasma Flare */}
            <circle cx="500" cy="500" r="18" fill="#ffffff" />
            <circle cx="500" cy="500" r="45" fill="rgba(56,189,248,0.6)" />
            <circle cx="500" cy="500" r="90" fill="rgba(147,197,253,0.2)" />
          </svg>
        </>
      )}
    </div>
  );
}
