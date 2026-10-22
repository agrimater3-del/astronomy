import React, { useState, useEffect, useRef } from 'react';
import MilkyWayGalaxy from './components/MilkyWayGalaxy';
import CelestialWelcome from './components/CelestialWelcome';
import SpaceLeftInfo from './components/SpaceLeftInfo';
import EarthLeftInfo from './components/EarthLeftInfo';
import ClubHeader from './components/ClubHeader';
import PlanetShowcase from './components/PlanetShowcase';
import PpcrcOperatingCenter, { preloadPpcrcBuilding } from './components/PpcrcOperatingCenter';

export default function App() {
  const [coreZoomComplete, setCoreZoomComplete] = useState(false);
  const [isTilted, setIsTilted] = useState(false);
  // Continuous float:
  // 0.0 to 0.20: Milky Way Dwell & Info
  // 0.20 to 1.0: Solar System Overview (Sun + 8 planets orbiting)
  // 1.0 to 1.80: Deep Flight towards Earth -> Dedicated Earth GLB on right + Left Info text
  // 1.80 to 2.40: Cinematic Dive into Pune, India on Earth with targeting lock
  // 2.40 to 3.0: Direct Seamless Entry -> PPCRC Building on left & Operating Center on right
  const [solarZoom, setSolarZoom] = useState(0.0);
  const [selectedPlanet, setSelectedPlanet] = useState(null); // Selected planet for 3D corner showcase
  const [blankPhase, setBlankPhase] = useState('idle'); // 'idle' | 'ready'

  // Guarantee coreZoomComplete triggers around 10.4s even if WebGL is throttled
  useEffect(() => {
    const timer = setTimeout(() => {
      setCoreZoomComplete(true);
    }, 10400);
    return () => clearTimeout(timer);
  }, []);

  // Continuous, slow, buttery-smooth scrolling physics
  const isTiltedRef = useRef(isTilted);
  const solarZoomRef = useRef(solarZoom);
  const blankPhaseRef = useRef(blankPhase);

  useEffect(() => {
    isTiltedRef.current = isTilted;
  }, [isTilted]);

  useEffect(() => {
    solarZoomRef.current = solarZoom;
  }, [solarZoom]);

  useEffect(() => {
    blankPhaseRef.current = blankPhase;
  }, [blankPhase]);

  useEffect(() => {
    // Close corner showcase when scrolling completely out to COSMOS or into dedicated Earth hero stage
    if ((!isTilted || solarZoom >= 1.15) && selectedPlanet) {
      setSelectedPlanet(null);
    }
  }, [isTilted, solarZoom, selectedPlanet]);

  // Preload PPCRC digital twin building into memory as soon as user approaches Earth info stage
  useEffect(() => {
    if (isTilted && solarZoom >= 1.0) {
      preloadPpcrcBuilding();
    }
  }, [isTilted, solarZoom >= 1.0]);

  useEffect(() => {
    if (!coreZoomComplete) return;

    let touchStartY = 0;
    let zoomRafId = null;
    const maxZoom = 3.0;

    const commitZoom = (nextZoom) => {
      solarZoomRef.current = nextZoom;

      // Direct seamless entry into PPCRC Operating Center without delay
      if (nextZoom >= 2.40 && blankPhaseRef.current !== 'ready') {
        setBlankPhase('ready');
      } else if (nextZoom < 2.35 && blankPhaseRef.current !== 'idle') {
        setBlankPhase('idle');
      }

      if (!zoomRafId) {
        zoomRafId = requestAnimationFrame(() => {
          setSolarZoom(solarZoomRef.current);
          zoomRafId = null;
        });
      }
    };

    const handleWheel = (e) => {
      // If inside PPCRC Operating Center: let component manage internal scroll and trigger onScrollUp at top
      if (blankPhaseRef.current === 'ready') {
        return;
      }

      // 1. If at initial COSMOS view: scrolling down tilts galaxy and shows THE MILKY WAY info
      if (!isTiltedRef.current) {
        if (e.deltaY > 10) {
          setIsTilted(true);
          setSolarZoom(0.0);
        }
        return;
      }

      // 2. If in THE MILKY WAY view (isTilted = true):
      // Very slow, continuous, silky-smooth zoom dive all the way to Earth and Pune (0.0 to 3.0)
      const delta = e.deltaY * 0.00065;
      const nextZoom = Math.min(maxZoom, Math.max(0.0, solarZoomRef.current + delta));

      // Scrolling up past 0.0 returns smoothly to COSMOS view
      if (nextZoom === 0 && solarZoomRef.current === 0 && e.deltaY < -20) {
        setIsTilted(false);
        setSelectedPlanet(null);
      } else {
        commitZoom(nextZoom);
      }
    };

    const handleTouchStart = (e) => {
      if (e.touches && e.touches[0]) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (!e.touches || !e.touches[0]) return;
      const deltaY = touchStartY - e.touches[0].clientY;
      touchStartY = e.touches[0].clientY;

      if (blankPhaseRef.current === 'ready') {
        return;
      }

      if (!isTiltedRef.current) {
        if (deltaY > 20) {
          setIsTilted(true);
          setSolarZoom(0.0);
        }
        return;
      }

      const delta = deltaY * 0.0016;
      const nextZoom = Math.min(maxZoom, Math.max(0.0, solarZoomRef.current + delta));

      if (nextZoom === 0 && solarZoomRef.current === 0 && deltaY < -20) {
        setIsTilted(false);
        setSelectedPlanet(null);
      } else {
        commitZoom(nextZoom);
      }
    };

    const handleKeyDown = (e) => {
      if (blankPhaseRef.current === 'ready') {
        if (['ArrowUp', 'PageUp', 'Escape'].includes(e.key)) {
          setBlankPhase('idle');
          setSolarZoom(2.15);
        }
        return;
      }

      if (!isTiltedRef.current) {
        if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
          setIsTilted(true);
          setSolarZoom(0.0);
        }
        return;
      }

      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
        setSolarZoom((prev) => {
          const nz = Math.min(maxZoom, prev + 0.08);
          if (nz >= 2.40 && blankPhaseRef.current !== 'ready') setBlankPhase('ready');
          return nz;
        });
      } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
        if (solarZoomRef.current > 0.01) {
          setSolarZoom((prev) => {
            const nz = Math.max(0.0, prev - 0.08);
            if (nz < 2.35 && blankPhaseRef.current !== 'idle') setBlankPhase('idle');
            return nz;
          });
        } else {
          setIsTilted(false);
          setSelectedPlanet(null);
        }
      } else if (e.key === 'Escape') {
        setSelectedPlanet(null);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      if (zoomRafId) cancelAnimationFrame(zoomRafId);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [coreZoomComplete]);

  return (
    <div
      className="astronomy-app-root"
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#02040b'
      }}
    >
      {/* 0. Official I²IT Astronomy Club Header */}
      <ClubHeader visible={coreZoomComplete} />

      {/* 1. 3D Milky Way Galaxy Canvas with Solar System & Earth Zoom */}
      <MilkyWayGalaxy
        mode="galaxy"
        paused={blankPhase === 'ready'}
        isTilted={isTilted}
        solarZoom={solarZoom}
        onCoreZoomComplete={() => setCoreZoomComplete(true)}
        onSelectPlanet={(planetName) => {
          setSelectedPlanet(planetName);
          if (solarZoom < 0.35) {
            setSolarZoom(0.75);
          }
        }}
      />

      {/* 2. Celestial Welcome (0s to 8.3s) */}
      {!coreZoomComplete && !isTilted && <CelestialWelcome isTilted={isTilted} />}

      {/* 3. Stage 4 & 5: COSMOS and THE MILKY WAY info (instant reverse transition on downscroll) */}
      <SpaceLeftInfo
        active={coreZoomComplete}
        isTilted={isTilted}
        solarZoom={solarZoom}
      />

      {/* 4. Dedicated Earth Hero Info on Left (activates as user scrolls towards Earth, solarZoom >= 1.25 && solarZoom < 2.05) */}
      <EarthLeftInfo
        visible={isTilted && solarZoom >= 1.25 && solarZoom < 2.05 && blankPhase === 'idle'}
        solarZoom={solarZoom}
      />

      {/* 5. Planet Corner Showcase (Rotates 3D GLB model in upper section + downside astronomical info) */}
      {selectedPlanet && isTilted && solarZoom < 1.15 && (
        <PlanetShowcase
          planetName={selectedPlanet}
          onClose={() => setSelectedPlanet(null)}
        />
      )}

      {/* 6. PPCRC Operating Center (Building on LEFT with original colors, Information on RIGHT) */}
      <PpcrcOperatingCenter
        visible={blankPhase === 'ready'}
        onScrollUp={() => {
          setSolarZoom(2.15);
          setBlankPhase('idle');
        }}
      />
    </div>
  );
}

