import React, { useState } from 'react';
import { 
  Telescope, RotateCcw, Volume2, VolumeX, Sparkles, 
  Orbit, Globe, Play, Pause, ChevronRight, Compass, Info 
} from 'lucide-react';
import { PLANETS_DATA, PC_TO_LY } from './MilkyWayGalaxy';

export default function CosmicExplorerUI({
  mode,
  onSetMode,
  paused,
  onTogglePause,
  simSpeed,
  onChangeSpeed,
  selectedPlanet,
  onSelectPlanet,
  onResetCamera,
  onReplayIntro,
  isAudioEnabled,
  onToggleAudio,
  onOpenJoin
}) {
  const [panelCollapsed, setPanelCollapsed] = useState(false);

  const currentPlanetData = selectedPlanet >= 0 ? PLANETS_DATA[selectedPlanet] : null;

  return (
    <div className="cosmic-explorer-ui-overlay">
      {/* Top Navigation Bar */}
      <header className="cosmic-top-nav">
        <div className="nav-brand-group" onClick={onReplayIntro} style={{ cursor: 'pointer' }}>
          <div className="nav-brand-icon">
            <Telescope size={18} className="text-cyan-400" />
          </div>
          <div>
            <div className="nav-brand-title">I2IT ASTRONOMY CLUB</div>
            <div className="nav-brand-sub">HOPE FOUNDATION’S INTERNATIONAL INSTITUTE OF IT</div>
          </div>
        </div>

        {/* Center Mode Switcher Pills */}
        <div className="nav-mode-pills">
          <button
            className={`btn-mode-pill ${mode === 'galaxy' ? 'active' : ''}`}
            onClick={() => onSetMode('galaxy')}
          >
            <Orbit size={14} />
            <span>Milky Way</span>
          </button>

          <button
            className={`btn-mode-pill ${mode === 'solar' ? 'active' : ''}`}
            onClick={() => onSetMode('solar')}
          >
            <Globe size={14} />
            <span>Solar System</span>
          </button>
        </div>

        {/* Right Navigation Actions */}
        <div className="nav-actions-group">
          <button
            className="btn-glass-action"
            onClick={onReplayIntro}
            title="Replay handwritten welcome intro"
          >
            <RotateCcw size={13} />
            <span>Replay Intro</span>
          </button>

          <button
            className={`btn-glass-action ${isAudioEnabled ? 'active-audio' : ''}`}
            onClick={onToggleAudio}
            title="Toggle cosmic soundscape"
          >
            {isAudioEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
            <span>{isAudioEnabled ? "Sound ON" : "Sound OFF"}</span>
          </button>

          <button className="btn-join-highlight" onClick={onOpenJoin}>
            <Sparkles size={13} />
            <span>Join Club</span>
          </button>
        </div>
      </header>

      {/* Interactive Control Panel from andro.html */}
      <aside className={`explorer-floating-panel ${panelCollapsed ? 'collapsed' : ''}`}>
        <div className="panel-header-row">
          <div>
            <h1 className="panel-title">Milky Way Explorer</h1>
            <div className="panel-subtitle">A galaxy, then our place within it.</div>
          </div>
          <button 
            className="btn-collapse-toggle"
            onClick={() => setPanelCollapsed(!panelCollapsed)}
            title={panelCollapsed ? "Expand panel" : "Collapse panel"}
          >
            <ChevronRight size={16} className={panelCollapsed ? "" : "rotate-90"} />
          </button>
        </div>

        {!panelCollapsed && (
          <div className="panel-body">
            {/* View Switching Buttons */}
            <div className="panel-button-row">
              <button
                className={`panel-btn ${mode === 'galaxy' ? 'active' : ''}`}
                onClick={() => onSetMode('galaxy')}
              >
                Milky Way
              </button>
              <button
                className={`panel-btn ${mode === 'solar' ? 'active' : ''}`}
                onClick={() => onSetMode('solar')}
              >
                Solar System
              </button>
              <button className="panel-btn btn-reset" onClick={onResetCamera}>
                Reset View
              </button>
            </div>

            {/* Description Text */}
            <p className="panel-desc">
              {mode === 'galaxy'
                ? 'Explore the stellar disk, spiral arms, central bar, bulge, and inner halo. The cyan marker identifies our Sun.'
                : 'Explore eight planets on elliptical, inclined orbits. Zoom in for the inner planets or out to the Kuiper belt.'}
            </p>

            {/* Solar System Specific Controls */}
            {mode === 'solar' && (
              <div className="solar-controls-section">
                <label className="input-group-label">Select Celestial Body:</label>
                <select
                  className="solar-planet-select"
                  value={selectedPlanet}
                  onChange={(e) => onSelectPlanet(Number(e.target.value))}
                >
                  <option value="-1">Overview (All Orbits)</option>
                  {PLANETS_DATA.map((p, idx) => (
                    <option key={p.name} value={idx}>
                      {p.name}
                    </option>
                  ))}
                </select>

                <div className="speed-slider-control">
                  <div className="speed-label-row">
                    <span>Simulation Speed:</span>
                    <span className="speed-val">{simSpeed} Earth days/s</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={simSpeed}
                    onChange={(e) => onChangeSpeed(Number(e.target.value))}
                    className="cosmic-range-slider"
                  />
                </div>

                <div className="pause-row">
                  <button className="panel-btn btn-pause" onClick={onTogglePause}>
                    {paused ? <Play size={13} /> : <Pause size={13} />}
                    <span>{paused ? 'Resume Motion' : 'Pause Orbit Motion'}</span>
                  </button>
                </div>

                {/* Telemetry Details */}
                {currentPlanetData && (
                  <div className="planet-telemetry-box">
                    <div className="telemetry-header">
                      <span className="telemetry-planet-name">{currentPlanetData.name}</span>
                      <span className="telemetry-dot" style={{ backgroundColor: currentPlanetData.color }} />
                    </div>
                    <div className="telemetry-grid">
                      <div className="tele-metric">
                        <span className="metric-label">Mean Distance</span>
                        <span className="metric-val">{currentPlanetData.a} AU</span>
                      </div>
                      <div className="tele-metric">
                        <span className="metric-label">Orbital Period</span>
                        <span className="metric-val">{(currentPlanetData.period / 365.256).toFixed(3)} Earth yrs</span>
                      </div>
                      <div className="tele-metric">
                        <span className="metric-label">Mean Radius</span>
                        <span className="metric-val">{currentPlanetData.radius.toLocaleString()} km</span>
                      </div>
                      <div className="tele-metric">
                        <span className="metric-label">Eccentricity</span>
                        <span className="metric-val">{currentPlanetData.e}</span>
                      </div>
                      <div className="tele-metric">
                        <span className="metric-label">Inclination</span>
                        <span className="metric-val">{currentPlanetData.i}°</span>
                      </div>
                    </div>
                  </div>
                )}

                <p className="panel-footnote">
                  Distances use a linear AU scale. Planet and Sun radii are enlarged;
                  orbital elements are approximate Keplerian models.
                </p>
              </div>
            )}

            {/* Scientific Scale Note */}
            <div className="panel-scale-note">
              <Info size={13} className="text-cyan-400 shrink-0 mt-0.5" />
              <span>
                {mode === 'galaxy'
                  ? `Disk diameter shown: ~${Math.round(30000 * PC_TO_LY).toLocaleString()} light-years. 75,000 stellar points, 4 spiral arms, Sgr A* black hole.`
                  : '1 AU ≈ 149.6 million km. Keplerian dynamical model with asteroid belt & Kuiper belt.'}
              </span>
            </div>
          </div>
        )}
      </aside>

      {/* Bottom Camera Interaction Guide */}
      <footer className="explorer-footer-guide">
        <span>Drag: orbit · Scroll: zoom · Right-drag: pan</span>
      </footer>
    </div>
  );
}
