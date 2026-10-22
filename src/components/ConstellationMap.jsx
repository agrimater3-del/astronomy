import React, { useState, useEffect, useRef } from 'react';
import { Compass, Star, Info, Orbit } from 'lucide-react';

const CONSTELLATIONS = [
  {
    name: 'Orion the Hunter',
    season: 'Winter Sky',
    brightStar: 'Betelgeuse & Rigel',
    lore: 'The celestial huntsman straddling the celestial equator, famous for his three-star belt and the red supergiant Betelgeuse.',
    stars: [
      { x: 0.35, y: 0.30, name: 'Betelgeuse (Alpha)', color: '#fca5a5', size: 5 },
      { x: 0.55, y: 0.32, name: 'Bellatrix (Gamma)', color: '#93c5fd', size: 4 },
      { x: 0.42, y: 0.50, name: 'Alnitak (Belt)', color: '#bfdbfe', size: 3.5 },
      { x: 0.45, y: 0.51, name: 'Alnilam (Belt)', color: '#bfdbfe', size: 3.8 },
      { x: 0.48, y: 0.52, name: 'Mintaka (Belt)', color: '#bfdbfe', size: 3.5 },
      { x: 0.33, y: 0.72, name: 'Saiph (Kappa)', color: '#93c5fd', size: 4 },
      { x: 0.58, y: 0.70, name: 'Rigel (Beta)', color: '#60a5fa', size: 5.5 }
    ],
    connections: [
      [0, 1], [0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6], [5, 6]
    ]
  },
  {
    name: 'Ursa Major (Great Bear / Saptarishi)',
    season: 'All Year Circumpolar',
    brightStar: 'Alioth & Dubhe',
    lore: 'The legendary seven sages of Vedic astronomy. The pointer stars Merak and Dubhe draw an arrow directly to Polaris (North Star).',
    stars: [
      { x: 0.25, y: 0.35, name: 'Dubhe (Kratu)', color: '#fde047', size: 4.5 },
      { x: 0.28, y: 0.55, name: 'Merak (Pulaha)', color: '#ffffff', size: 4 },
      { x: 0.45, y: 0.53, name: 'Phecda (Pulastya)', color: '#ffffff', size: 3.8 },
      { x: 0.48, y: 0.36, name: 'Megrez (Atri)', color: '#bfdbfe', size: 3.5 },
      { x: 0.62, y: 0.42, name: 'Alioth (Angiras)', color: '#ffffff', size: 4.5 },
      { x: 0.75, y: 0.48, name: 'Mizar (Vashistha)', color: '#93c5fd', size: 4.2 },
      { x: 0.88, y: 0.60, name: 'Alkaid (Marichi)', color: '#60a5fa', size: 4.5 }
    ],
    connections: [
      [0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 6]
    ]
  },
  {
    name: 'Cassiopeia Queen',
    season: 'Autumn / Winter',
    brightStar: 'Schedar',
    lore: 'The vain queen of Greek legend seated upon her celestial throne, forming a prominent "W" across the northern Milky Way.',
    stars: [
      { x: 0.20, y: 0.65, name: 'Caph (Beta)', color: '#fef08a', size: 4 },
      { x: 0.38, y: 0.35, name: 'Schedar (Alpha)', color: '#f97316', size: 4.8 },
      { x: 0.55, y: 0.50, name: 'Gamma Cas (Navi)', color: '#38bdf8', size: 4.5 },
      { x: 0.72, y: 0.38, name: 'Ruchbah (Delta)', color: '#ffffff', size: 4 },
      { x: 0.85, y: 0.55, name: 'Segin (Epsilon)', color: '#bfdbfe', size: 3.8 }
    ],
    connections: [
      [0, 1], [1, 2], [2, 3], [3, 4]
    ]
  }
];

export default function ConstellationMap() {
  const [selectedConstellation, setSelectedConstellation] = useState(CONSTELLATIONS[0]);
  const [hoveredStar, setHoveredStar] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = (canvas.width = canvas.parentElement.clientWidth);
    const height = (canvas.height = canvas.parentElement.clientHeight || 440);

    ctx.clearRect(0, 0, width, height);

    // Draw background grid circles (celestial coordinate lines)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let r = 80; r < width; r += 90) {
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    const { stars, connections } = selectedConstellation;

    // Draw constellation connection lines
    ctx.strokeStyle = 'rgba(96, 165, 250, 0.45)';
    ctx.lineWidth = 1.8;
    ctx.setLineDash([4, 4]);

    for (const [fromIdx, toIdx] of connections) {
      const from = stars[fromIdx];
      const to = stars[toIdx];
      if (from && to) {
        ctx.beginPath();
        ctx.moveTo(from.x * width, from.y * height);
        ctx.lineTo(to.x * width, to.y * height);
        ctx.stroke();
      }
    }
    ctx.setLineDash([]);

    // Draw stars
    for (const star of stars) {
      const sx = star.x * width;
      const sy = star.y * height;

      // Glow halo
      const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, star.size * 3.5);
      grad.addColorStop(0, star.color);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(sx, sy, star.size * 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Core point
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(sx, sy, star.size * 0.7, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [selectedConstellation]);

  return (
    <section id="skymap" className="skymap-section">
      <div className="section-container">
        
        <div className="section-head">
          <div className="section-pill">
            <Orbit size={14} className="text-amber-400" />
            <span>INTERACTIVE STAR ATLAS</span>
          </div>
          <h2 className="section-title">Celestial Constellation Chart</h2>
          <p className="section-subtitle">
            Study stellar alignments visible from the Pune latitude sky during club night observation sessions.
          </p>
        </div>

        <div className="skymap-layout">
          
          {/* Interactive Chart Canvas */}
          <div className="skymap-canvas-wrapper">
            <canvas ref={canvasRef} className="skymap-canvas" />

            {/* Overlaid Constellation Label */}
            <div className="skymap-overlay-label">
              <span className="const-tag">ACTIVE CONSTELLATION</span>
              <span className="const-name">{selectedConstellation.name}</span>
              <span className="const-lore">{selectedConstellation.lore}</span>
            </div>

            {/* Legend */}
            <div className="skymap-legend">
              <span>● White: Standard Star</span>
              <span style={{ color: '#fca5a5' }}>● Red: Red Supergiant</span>
              <span style={{ color: '#60a5fa' }}>● Blue: Hot Blue Giant</span>
            </div>
          </div>

          {/* Constellation Selector Tabs */}
          <div className="constellation-selector-panel">
            <h3 className="panel-title">
              <Compass size={16} />
              <span>Select Star Pattern</span>
            </h3>

            <div className="const-tab-list">
              {CONSTELLATIONS.map((c, i) => (
                <div 
                  key={i}
                  className={`const-tab-card ${selectedConstellation.name === c.name ? 'active' : ''}`}
                  onClick={() => setSelectedConstellation(c)}
                >
                  <div className="tab-top">
                    <span className="tab-name">{c.name}</span>
                    <span className="tab-season">{c.season}</span>
                  </div>
                  <div className="tab-stars">
                    <Star size={12} className="text-amber-400" />
                    <span>Key Anchor: {c.brightStar}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pune Stargazing Tip */}
            <div className="stargazing-tip-box">
              <Info size={16} className="text-cyan-400 shrink-0" />
              <p>
                <strong>Observation Tip:</strong> Best seen with 10x50 binoculars or naked eyes from I2IT campus rooftop after 9:30 PM under low ambient light.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
