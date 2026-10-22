import React, { useEffect, useState } from 'react';
import stoneCrackTexture from '../assets/stone_crack_texture.webp';

export default function CelestialWelcome({ isTilted = false }) {
  // Phase 1 (0s-3s): Only Milky Way rotating full-screen
  // Phase 2 (3s-5s): Milky Way shrinks down smoothly to center slot
  // Phase 3 (5s-6.3s): "WELCOME TO" appears, words slide out from behind galaxy
  // Phase 4 (6.3s-8.3s): Full title held for 2 seconds
  // Phase 5 (8.3s-9.2s): Text reverses back into center where it was born and disappears
  // Phase 6 (9.2s+): Completely unmounts from DOM so zero composite mask artifacts remain!
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [wordsSlideOut, setWordsSlideOut] = useState(false);
  const [subVisible, setSubVisible] = useState(false);
  const [reversing, setReversing] = useState(false);
  const [fullyCompleted, setFullyCompleted] = useState(false);

  useEffect(() => {
    // 1. At 3.8 seconds: "WELCOME TO" appears as galaxy shrinks
    const tWelcome = setTimeout(() => {
      setWelcomeVisible(true);
    }, 3800);

    // 2. At 3.8 seconds: Words emerge from behind the galaxy
    const tWords = setTimeout(() => {
      setWordsSlideOut(true);
    }, 3800);

    // 3. At 4.9 seconds: Institutional Subtitle reveals
    const tSub = setTimeout(() => {
      setSubVisible(true);
    }, 4900);

    // 4. At 7.0 seconds: All text reverses back into position
    const tReverse = setTimeout(() => {
      setReversing(true);
    }, 7000);

    // 5. At 7.9 seconds: Reverse animation complete -> remove from DOM
    const tDone = setTimeout(() => {
      setFullyCompleted(true);
    }, 7900);

    return () => {
      clearTimeout(tWelcome);
      clearTimeout(tWords);
      clearTimeout(tSub);
      clearTimeout(tReverse);
      clearTimeout(tDone);
    };
  }, []);

  // When animation finishes, tilted, or unmounted, render nothing to prevent any DOM/mask artifacts
  if (fullyCompleted || isTilted) return null;

  return (
    <div className={`celestial-cinematic-stage ${reversing ? 'stage-reversing' : ''}`}>
      <div className="celestial-welcome-hero">

        {/* -------------------------------------------------------------
            STAGE 1: "WELCOME TO" (APPEARS AFTER 5s, REVERSES AT 8.3s)
            ------------------------------------------------------------- */}
        <div
          className={`metallic-welcome-header ${
            reversing
              ? 'reversing'
              : welcomeVisible
              ? 'reveal-welcome'
              : 'hidden-welcome'
          }`}
        >
          <div className="metallic-rule-line rule-left" />
          <h2 className="metallic-welcome-text">WELCOME TO</h2>
          <div className="metallic-rule-line rule-right" />
        </div>

        {/* -------------------------------------------------------------
            STAGE 2: MAIN TITLE ROW
            ------------------------------------------------------------- */}
        <div className={`celestial-title-row ${reversing ? 'row-reversing' : ''}`}>
          
          {/* Left Wing: "I2IT ASTR" */}
          <div
            className={`title-wing title-wing-left ${
              reversing
                ? 'reversing'
                : wordsSlideOut
                ? 'sliding-out'
                : 'behind-galaxy'
            }`}
          >
            <div
              className="stone-crack-word word-i2it"
              style={{ backgroundImage: `url(${stoneCrackTexture})` }}
            >
              I2IT
            </div>
            <div className="stone-space" />
            <div
              className="stone-crack-word word-astr"
              style={{ backgroundImage: `url(${stoneCrackTexture})` }}
            >
              ASTR
            </div>
          </div>

          {/* Center Slot: Transparent space where 3D Milky Way spins as letter 'O' */}
          <div className="milkyway-portal-o-slot" />

          {/* Right Wing: "NOMY CLUB" */}
          <div
            className={`title-wing title-wing-right ${
              reversing
                ? 'reversing'
                : wordsSlideOut
                ? 'sliding-out'
                : 'behind-galaxy'
            }`}
          >
            <div
              className="stone-crack-word word-nomy"
              style={{ backgroundImage: `url(${stoneCrackTexture})` }}
            >
              NOMY
            </div>
            <div className="stone-space" />
            <div
              className="stone-crack-word word-club"
              style={{ backgroundImage: `url(${stoneCrackTexture})` }}
            >
              CLUB
            </div>
          </div>

        </div>

        {/* Institutional Subtitle */}
        <div
          className={`celestial-footer-subtitle ${
            reversing
              ? 'reversing'
              : subVisible
              ? 'reveal-sub'
              : 'hidden-sub'
          }`}
        >
          <span>HOPE FOUNDATION’S INTERNATIONAL INSTITUTE OF INFORMATION TECHNOLOGY</span>
          <span className="sub-bullet">•</span>
          <span>HINJAWADI, PUNE</span>
        </div>

      </div>
    </div>
  );
}
