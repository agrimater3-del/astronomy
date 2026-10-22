import React, { useState } from 'react';
import { Eye, ZoomIn, ZoomOut, Compass, Sparkles, Sliders, Info, ShieldCheck } from 'lucide-react';

const CELESTIAL_TARGETS = [
  {
    id: 'pillars',
    name: 'Pillars of Creation (M16)',
    catalog: 'Eagle Nebula / Serpens Constellation',
    dist: '6,500 Light Years',
    type: 'Active Star-Forming Region',
    mag: '+6.0',
    description: 'Towering spires of interstellar gas and dust where newborn stars hatch inside dense dark globules.',
    image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1200&auto=format&fit=crop',
    wavelengths: ['Infrared NIRCam', 'Visible H-Alpha', 'X-Ray Chandra']
  },
  {
    id: 'andromeda',
    name: 'Andromeda Galaxy (M31)',
    catalog: 'Local Group Giant Spiral',
    dist: '2.537 Million Light Years',
    type: 'Barred Spiral Galaxy (1 Trillion Stars)',
    mag: '+3.44',
    description: 'Our galactic neighbor approaching the Milky Way at 110 km/s. Visible to the naked eye from dark skies.',
    image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200&auto=format&fit=crop',
    wavelengths: ['Optical Broadband', 'Ultraviolet GALEX', 'Hydrogen-Alpha']
  },
  {
    id: 'orion',
    name: 'Great Orion Nebula (M42)',
    catalog: 'Sword of Orion / Winter Hexagon',
    dist: '1,344 Light Years',
    type: 'Diffuse Emission & Reflection Nebula',
    mag: '+4.0',
    description: 'The closest massive star-forming nursery to Earth, illuminated by the young Trapezium cluster.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
    wavelengths: ['O-III Filter', 'H-Alpha 656nm', 'Sulfur-II']
  },
  {
    id: 'saturn',
    name: 'Ringed Wonder: Saturn',
    catalog: 'Sol VI / Gas Giant Planet',
    dist: '1.4 Billion km (80 Light Minutes)',
    type: 'Gas Giant with Planetary Ring Complex',
    mag: '+0.4',
    description: 'Spectacular icy ring system tilted at 26.7 degrees, featuring the Cassini Division and moon Titan.',
    image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1200&auto=format&fit=crop',
    wavelengths: ['True Color RGB', 'Methane Absorption', 'Polarized Filter']
  }
];

export default function ObservatoryViewer() {
  const [selectedTarget, setSelectedTarget] = useState(CELESTIAL_TARGETS[0]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeFilter, setActiveFilter] = useState('Visible H-Alpha');
  const [isCrosshairOn, setIsCrosshairOn] = useState(true);

  return (
    <section id="observatory" className="observatory-section">
      <div className="section-container">
        
        {/* Section Header */}
        <div className="section-head">
          <div className="section-pill">
            <Eye size={14} className="text-cyan-400" />
            <span>I2IT TELESCOPE FEED</span>
          </div>
          <h2 className="section-title">Deep Sky Digital Observatory</h2>
          <p className="section-subtitle">
            Simulate views through the club’s computerized optical rigs, cooled CMOS sensors, and narrowband optical filters.
          </p>
        </div>

        {/* Observatory Grid */}
        <div className="observatory-grid">
          
          {/* Main Telescope Viewport */}
          <div className="telescope-viewport-card">
            
            {/* Viewport Frame */}
            <div className="telescope-display">
              
              {/* Simulated Space Image with Dynamic Zoom & Optical Filters */}
              <div 
                className={`telescope-imagery filter-${activeFilter.toLowerCase().replace(/[^a-z]/g, '')}`}
                style={{
                  backgroundImage: `url(${selectedTarget.image})`,
                  transform: `scale(${zoomLevel})`
                }}
              />

              {/* Optical Reticle / Crosshair */}
              {isCrosshairOn && (
                <div className="observatory-reticle">
                  <div className="reticle-circle outer" />
                  <div className="reticle-circle inner" />
                  <div className="reticle-line h" />
                  <div className="reticle-line v" />
                  <div className="reticle-coords">
                    <span>FOV: {(1.2 / zoomLevel).toFixed(2)}°</span>
                    <span>MAG: {(zoomLevel * 48).toFixed(0)}×</span>
                  </div>
                </div>
              )}

              {/* Telemetry HUD Overlays */}
              <div className="telemetry-hud top-left">
                <span className="hud-badge live">● OPTICAL FEED ACTIVE</span>
                <span className="hud-metric">{selectedTarget.name}</span>
                <span className="hud-sub">{selectedTarget.catalog}</span>
              </div>

              <div className="telemetry-hud top-right">
                <span className="hud-label">DISTANCE</span>
                <span className="hud-val">{selectedTarget.dist}</span>
                <span className="hud-label">APPARENT MAG</span>
                <span className="hud-val">{selectedTarget.mag}</span>
              </div>

              <div className="telemetry-hud bottom-left">
                <span className="hud-label">FILTER PASSBAND</span>
                <span className="hud-val highlight">{activeFilter}</span>
              </div>

              {/* Viewport Controls Bar */}
              <div className="viewport-controls-bar">
                <div className="zoom-controls">
                  <button 
                    className="ctrl-btn" 
                    onClick={() => setZoomLevel(prev => Math.max(0.8, prev - 0.25))}
                    title="Zoom Out"
                  >
                    <ZoomOut size={16} />
                  </button>
                  <span className="zoom-indicator">{(zoomLevel).toFixed(1)}x</span>
                  <button 
                    className="ctrl-btn" 
                    onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.25))}
                    title="Zoom In"
                  >
                    <ZoomIn size={16} />
                  </button>
                </div>

                <button 
                  className={`ctrl-btn text-btn ${isCrosshairOn ? 'active' : ''}`}
                  onClick={() => setIsCrosshairOn(!isCrosshairOn)}
                >
                  <Compass size={14} />
                  <span>Reticle</span>
                </button>
              </div>

            </div>

            {/* Target Details Card */}
            <div className="target-description-bar">
              <p className="desc-text">{selectedTarget.description}</p>
              <div className="filter-chips">
                <span className="filter-label">Wavelengths:</span>
                {selectedTarget.wavelengths.map((w, idx) => (
                  <button 
                    key={idx}
                    className={`filter-chip ${activeFilter === w ? 'active' : ''}`}
                    onClick={() => setActiveFilter(w)}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Target Selector Sidebar */}
          <div className="targets-sidebar">
            <h3 className="sidebar-title">
              <Sparkles size={16} />
              <span>Target Coordinates</span>
            </h3>

            <div className="target-list">
              {CELESTIAL_TARGETS.map(target => (
                <div 
                  key={target.id}
                  className={`target-item-card ${selectedTarget.id === target.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedTarget(target);
                    setActiveFilter(target.wavelengths[0]);
                    setZoomLevel(1);
                  }}
                >
                  <div 
                    className="target-thumb"
                    style={{ backgroundImage: `url(${target.image})` }}
                  />
                  <div className="target-info">
                    <span className="target-name">{target.name}</span>
                    <span className="target-cat">{target.catalog}</span>
                    <span className="target-dist">{target.dist}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Observation Status */}
            <div className="station-status-card">
              <div className="status-header">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>I2IT Weather Station</span>
              </div>
              <div className="status-metric-row">
                <span>Location</span>
                <span className="metric-val">Pune (18.52° N, 73.85° E)</span>
              </div>
              <div className="status-metric-row">
                <span>Sky Transparency</span>
                <span className="metric-val text-emerald-400">92% Excellent</span>
              </div>
              <div className="status-metric-row">
                <span>Bortle Dark Scale</span>
                <span className="metric-val">Class 4 (Rural/Suburban)</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
