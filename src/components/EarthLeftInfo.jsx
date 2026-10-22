import React, { useEffect, useState } from 'react';

export default function EarthLeftInfo({ visible = false, solarZoom = 1.0 }) {
  const earthLetters = ['E', 'A', 'R', 'T', 'H'];
  const [lettersFinished, setLettersFinished] = useState(false);

  useEffect(() => {
    if (visible) {
      setLettersFinished(false);
      const timer = setTimeout(() => {
        setLettersFinished(true);
      }, 700);
      return () => clearTimeout(timer);
    } else {
      setLettersFinished(false);
    }
  }, [visible]);

  if (!visible) return null;

  const puneFade = solarZoom > 1.80 ? Math.max(0, 1.0 - (solarZoom - 1.80) / 0.18) : 1.0;

  return (
    <div
      className="earth-hero-stage earth-stage-active"
      style={{
        opacity: puneFade,
        pointerEvents: puneFade < 0.2 ? 'none' : 'auto',
        transition: 'opacity 0.15s ease-out'
      }}
    >
      {/* Main Title: EARTH with letter-by-letter zoom bounce */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <h1
          className="earth-main-heading"
          aria-label="EARTH"
          style={{
            margin: 0,
            display: 'flex',
            gap: '3px',
            fontFamily: "'Oswald', 'Bebas Neue', -apple-system, sans-serif",
            fontSize: 'clamp(36px, 4.2vw, 54px)',
            fontWeight: 700,
            letterSpacing: '0.06em',
            lineHeight: 1.0,
            textTransform: 'uppercase',
            color: '#FFF8E9',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.9), 0 0 35px rgba(56, 189, 248, 0.35)'
          }}
        >
          {earthLetters.map((char, index) => (
            <span
              key={index}
              className={`earth-bounce-letter ${visible ? 'bounce-in' : 'reverse-out'}`}
              style={{
                display: 'inline-block',
                animationDelay: visible ? `${index * 0.08}s` : `${(4 - index) * 0.03}s`
              }}
            >
              {char}
            </span>
          ))}
        </h1>

        <h2
          style={{
            margin: '4px 0 0',
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(11px, 0.95vw, 13px)',
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#F1D5A5',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)'
          }}
        >
          OUR HOME IN THE COSMIC OCEAN • THE PALE BLUE DOT
        </h2>
      </div>

      {/* 3. Concise Narrative Description Block */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          opacity: lettersFinished ? 1 : 0,
          transform: lettersFinished ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease'
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: "'Inter', -apple-system, sans-serif",
            fontSize: 'clamp(12px, 0.92vw, 13.5px)',
            lineHeight: 1.55,
            color: 'rgba(255, 255, 255, 0.88)',
            textShadow: '0 1px 4px rgba(0, 0, 0, 0.9)'
          }}
        >
          An oasis of liquid water and atmosphere adrift in the infinite cosmic dark.
          Earth is the only known celestial sanctuary harboring complex life, shielded
          by a churning liquid iron magnetosphere and sustained by the steady warmth of our sun.
        </p>
      </div>

      {/* 4. Atmospheric Composition Pills */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          opacity: lettersFinished ? 1 : 0,
          transform: lettersFinished ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s'
        }}
      >
        {['78.1% N₂', '20.9% O₂', '70.8% WATER', '1.00g GRAVITY', '1.0 AU DISTANCE'].map(
          (tag, idx) => (
            <span
              key={idx}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '5px',
                padding: '2px 7px',
                fontFamily: "'Space Grotesk', monospace",
                fontSize: '9.5px',
                letterSpacing: '0.06em',
                color: '#e2e8f0'
              }}
            >
              {tag}
            </span>
          )
        )}
      </div>

      {/* 5. Key Planetary Telemetry Micro-Cards (Compact 2x3 Grid) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '6px',
          opacity: lettersFinished ? 1 : 0,
          transform: lettersFinished ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s'
        }}
      >
        <div className="showcase-metric-tile" style={{ padding: '6px 10px' }}>
          <div className="showcase-metric-header">
            <span>⌖</span>
            <span>DIAMETER</span>
          </div>
          <div className="showcase-metric-value" style={{ fontSize: '13px' }}>12,742 km</div>
          <div className="showcase-metric-badge">1.000× Earth Base</div>
        </div>

        <div className="showcase-metric-tile" style={{ padding: '6px 10px' }}>
          <div className="showcase-metric-header">
            <span>◈</span>
            <span>SOLAR DISTANCE</span>
          </div>
          <div className="showcase-metric-value" style={{ fontSize: '13px' }}>149.6M km</div>
          <div className="showcase-metric-badge">1.000 AU (Goldilocks)</div>
        </div>

        <div className="showcase-metric-tile" style={{ padding: '6px 10px' }}>
          <div className="showcase-metric-header">
            <span>↻</span>
            <span>ORBIT PERIOD</span>
          </div>
          <div className="showcase-metric-value" style={{ fontSize: '13px' }}>365.25 Days</div>
          <div className="showcase-metric-badge">107,200 km/h Speed</div>
        </div>

        <div className="showcase-metric-tile" style={{ padding: '6px 10px' }}>
          <div className="showcase-metric-header">
            <span>⏳</span>
            <span>ROTATION PERIOD</span>
          </div>
          <div className="showcase-metric-value" style={{ fontSize: '13px' }}>23h 56m 04s</div>
          <div className="showcase-metric-badge">23.44° Axial Tilt</div>
        </div>

        <div className="showcase-metric-tile" style={{ padding: '6px 10px' }}>
          <div className="showcase-metric-header">
            <span>◎</span>
            <span>NATURAL SATELLITE</span>
          </div>
          <div className="showcase-metric-value" style={{ fontSize: '13px', color: '#38BDF8' }}>
            The Moon (Luna)
          </div>
          <div className="showcase-metric-badge">384,400 km Distance</div>
        </div>

        <div className="showcase-metric-tile" style={{ padding: '6px 10px' }}>
          <div className="showcase-metric-header">
            <span>🌡</span>
            <span>SURFACE TEMP</span>
          </div>
          <div className="showcase-metric-value" style={{ fontSize: '13px' }}>15°C Mean</div>
          <div className="showcase-metric-badge">-88°C Min / +58°C Max</div>
        </div>
      </div>
    </div>
  );
}
