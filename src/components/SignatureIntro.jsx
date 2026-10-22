import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, FastForward } from 'lucide-react';
import { playStardustChime } from '../utils/audio';

// Two clear, beautiful human-written lines
const LINE1 = "Welcome to";
const LINE2 = "I2IT Astronomy Club";

export default function SignatureIntro({ onComplete, isAudioEnabled, onToggleAudio }) {
  // Stages: 'blank' -> 'writing-1' -> 'writing-2' -> 'done' -> fade out
  const [stage, setStage] = useState('blank');
  const [charIndex1, setCharIndex1] = useState(0);
  const [charIndex2, setCharIndex2] = useState(0);
  const [penPos, setPenPos] = useState({ x: 0, y: 0, visible: false });
  const [fadingOut, setFadingOut] = useState(false);

  const containerRef = useRef(null);
  const spanRefs1 = useRef([]);
  const spanRefs2 = useRef([]);

  // 1. Initial Blank Screen: Pure black for 1.2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setStage('writing-1');
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Update pen position to the active letter
  const updatePenPosition = (span) => {
    if (!span || !containerRef.current) return;
    const rect = span.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    // Pen tip sits at the right edge of the current letter
    const x = rect.right - containerRect.left;
    const y = rect.bottom - containerRect.top - 6;

    setPenPos({ x, y, visible: true });
  };

  // 2. Writing Line 1: "Welcome to"
  useEffect(() => {
    if (stage !== 'writing-1') return;

    if (charIndex1 < LINE1.length) {
      const char = LINE1[charIndex1];
      // Realistic human writing pauses: longer after space, shorter within word
      const delay = char === ' ' ? 180 : 75 + Math.random() * 35;

      const timer = setTimeout(() => {
        setCharIndex1(prev => prev + 1);
        if (isAudioEnabled) {
          playStardustChime(480 + (charIndex1 / LINE1.length) * 120);
        }
      }, delay);

      return () => clearTimeout(timer);
    } else {
      // Finished Line 1 -> brief pause of 300ms, then move down to Line 2
      const pauseTimer = setTimeout(() => {
        setStage('writing-2');
      }, 320);
      return () => clearTimeout(pauseTimer);
    }
  }, [stage, charIndex1, isAudioEnabled]);

  // Update pen tracking for line 1
  useEffect(() => {
    if (stage === 'writing-1' && spanRefs1.current[charIndex1 - 1]) {
      updatePenPosition(spanRefs1.current[charIndex1 - 1]);
    }
  }, [stage, charIndex1]);

  // 3. Writing Line 2: "I2IT Astronomy Club"
  useEffect(() => {
    if (stage !== 'writing-2') return;

    if (charIndex2 < LINE2.length) {
      const char = LINE2[charIndex2];
      const delay = char === ' ' ? 200 : 70 + Math.random() * 30;

      const timer = setTimeout(() => {
        setCharIndex2(prev => prev + 1);
        if (isAudioEnabled) {
          playStardustChime(560 + (charIndex2 / LINE2.length) * 160);
        }
      }, delay);

      return () => clearTimeout(timer);
    } else {
      // Finished Line 2 -> Done! Lift pen, hold for 850ms, then auto-redirect!
      setPenPos(prev => ({ ...prev, visible: false }));
      setStage('done');

      const redirectTimer = setTimeout(() => {
        setFadingOut(true);
        setTimeout(() => {
          onComplete();
        }, 600);
      }, 850);

      return () => clearTimeout(redirectTimer);
    }
  }, [stage, charIndex2, isAudioEnabled, onComplete]);

  // Update pen tracking for line 2
  useEffect(() => {
    if (stage === 'writing-2' && spanRefs2.current[charIndex2 - 1]) {
      updatePenPosition(spanRefs2.current[charIndex2 - 1]);
    }
  }, [stage, charIndex2]);

  // Quick skip on click
  const handleQuickSkip = () => {
    setFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 400);
  };

  return (
    <div 
      className={`human-signature-screen ${fadingOut ? 'fade-out' : ''}`}
      onClick={stage.startsWith('writing') ? handleQuickSkip : undefined}
    >
      {/* Minimal nav top right */}
      {stage !== 'blank' && (
        <div className="signature-minimal-nav" onClick={e => e.stopPropagation()}>
          <button 
            className="btn-minimal-audio"
            onClick={onToggleAudio}
            title={isAudioEnabled ? "Sound ON" : "Sound OFF"}
          >
            {isAudioEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>

          <button 
            className="btn-minimal-skip"
            onClick={handleQuickSkip}
            title="Skip directly to club portal"
          >
            <span>Skip</span>
            <FastForward size={13} />
          </button>
        </div>
      )}

      {/* Center Writing Stage */}
      {stage !== 'blank' && (
        <div className="handwriting-stage" ref={containerRef}>
          
          {/* Line 1: "Welcome to" */}
          <div className="handwriting-line line-welcome">
            {LINE1.split('').map((char, i) => (
              <span
                key={i}
                ref={el => spanRefs1.current[i] = el}
                className={`hw-char ${i < charIndex1 ? 'visible' : 'hidden'}`}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </div>

          {/* Line 2: "I2IT Astronomy Club" */}
          <div className="handwriting-line line-club">
            {LINE2.split('').map((char, i) => (
              <span
                key={i}
                ref={el => spanRefs2.current[i] = el}
                className={`hw-char ${i < charIndex2 ? 'visible' : 'hidden'}`}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </div>

          {/* Realistic Human Writing Pen / Stylus */}
          {penPos.visible && (
            <div 
              className="human-writing-pen"
              style={{
                left: `${penPos.x}px`,
                top: `${penPos.y}px`
              }}
            >
              {/* Pen Nib Tip */}
              <div className="pen-nib-point" />
              {/* Slender Pen Barrel tilted naturally at 40 degrees */}
              <div className="pen-stem" />
            </div>
          )}

        </div>
      )}

    </div>
  );
}
