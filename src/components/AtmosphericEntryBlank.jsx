import React, { useEffect, useState } from 'react';

export default function AtmosphericEntryBlank({ active = false, onFinished }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!active) {
      setProgress(0);
      return;
    }

    const start = performance.now();
    const duration = 1100; // ~1 second blank atmospheric transition

    const interval = setInterval(() => {
      const elapsed = performance.now() - start;
      const p = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(p);

      if (elapsed >= duration) {
        clearInterval(interval);
        if (onFinished) onFinished();
      }
    }, 25);

    return () => clearInterval(interval);
  }, [active, onFinished]);

  if (!active) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 90,
        backgroundColor: '#02040b',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        animation: 'fadeInBlank 0.25s ease-out forwards',
        userSelect: 'none'
      }}
    >
      {/* High-tech pulsing descent reticle */}
      <div style={{ position: 'relative', width: '80px', height: '80px' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2px solid rgba(56, 189, 248, 0.4)',
            animation: 'radarPing 1.2s cubic-bezier(0, 0, 0.2, 1) infinite'
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: '16px',
            borderRadius: '50%',
            border: '1.5px dashed rgba(241, 213, 165, 0.6)',
            animation: 'spinSlow 4s linear infinite'
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#38BDF8',
            boxShadow: '0 0 14px #38BDF8'
          }}
        />
      </div>

      {/* Atmospheric Descent Telemetry Text */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 14px',
            borderRadius: '9999px',
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#38BDF8',
            fontFamily: "'Space Grotesk', monospace",
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase'
          }}
        >
          <span>ATMOSPHERIC DESCENT // PUNE AIRSPACE</span>
        </div>

        <h3
          style={{
            margin: '4px 0 0',
            fontFamily: "'Oswald', -apple-system, sans-serif",
            fontSize: '20px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#FFF8E9',
            textShadow: '0 2px 12px rgba(0,0,0,0.8)'
          }}
        >
          TRANSITIONING TO GROUND STATION
        </h3>

        <div
          style={{
            fontFamily: "'Space Grotesk', monospace",
            fontSize: '10px',
            letterSpacing: '0.1em',
            color: '#94a3b8'
          }}
        >
          TARGET: 18.5912° N, 73.7389° E • ALTITUDE: 574M • PPCRC HINJAWADI
        </div>
      </div>

      {/* Fast Progress Track */}
      <div
        style={{
          width: '240px',
          height: '3px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '2px',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #38BDF8, #F1D5A5)',
            boxShadow: '0 0 10px #38BDF8',
            transition: 'width 0.05s linear'
          }}
        />
      </div>
    </div>
  );
}
