import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export const PLANET_INFO = {
  Sun: {
    name: 'Sun',
    order: 'SOL-00',
    index: '00 / 08',
    symbol: '☉',
    category: 'Yellow Dwarf Star (G2V)',
    tagline: 'Incandescent Heart • Gravitational Anchor of the Solar System',
    color: '#FFB800',
    metrics: {
      diameter: { val: '1,392,700 km', sub: '109.2× Earth', icon: '⌖', label: 'DIAMETER' },
      distance: { val: '0 km', sub: 'Solar Barycenter', icon: '◈', label: 'SOLAR DISTANCE' },
      orbit: { val: '230 Million Yrs', sub: 'Galactic Core Orbit', icon: '↻', label: 'ORBIT PERIOD' },
      rotation: { val: '25 – 35 Days', sub: 'Differential Spin', icon: '⏳', label: 'DAY LENGTH' },
      moons: { val: '8 Major Planets', sub: '5 Dwarf + 1M+ Asteroids', icon: '◎', label: 'ORBITING BODIES' },
      temp: '5,500°C',
      tempSub: 'Core: 15,000,000°C',
      tempIcon: '🌡',
      tempLabel: 'SURFACE TEMP'
    },
    gravity: '274.0 m/s²',
    density: '1.41 g/cm³',
    axialTilt: '7.25°',
    composition: ['73.5% H₂', '24.9% He', '1.6% Metals'],
    description:
      'The incandescent powerhouse at the center of our solar system. Containing 99.86% of the system’s total mass, the Sun generates radiant energy via continuous thermonuclear fusion of hydrogen into helium.'
  },
  Mercury: {
    name: 'Mercury',
    order: 'SOL-01',
    index: '01 / 08',
    symbol: '☿',
    category: 'Terrestrial Planet',
    tagline: 'Innermost World • Ancient Sun-Scorched Regolith',
    color: '#A8A29E',
    metrics: {
      diameter: { val: '4,879 km', sub: '0.383× Earth', icon: '⌖', label: 'DIAMETER' },
      distance: { val: '57.9M km', sub: '0.387 AU from Sun', icon: '◈', label: 'SOLAR DISTANCE' },
      orbit: { val: '88 Earth Days', sub: '47.4 km/s Velocity', icon: '↻', label: 'ORBIT PERIOD' },
      rotation: { val: '58.6 Earth Days', sub: '3:2 Spin Resonance', icon: '⏳', label: 'DAY LENGTH' },
      moons: { val: '0 Moons', sub: 'No Satellites', icon: '◎', label: 'KNOWN MOONS' },
      temp: '167°C Mean',
      tempSub: '-180°C Min / 430°C Max',
      tempIcon: '🌡',
      tempLabel: 'SURFACE TEMP'
    },
    gravity: '3.70 m/s²',
    density: '5.43 g/cm³',
    axialTilt: '0.034°',
    composition: ['42% O₂', '29% Na', '22% H₂'],
    description:
      'The smallest planet and closest to the Sun. Mercury has a heavily cratered silicate surface and no substantial atmosphere, resulting in the most extreme diurnal temperature swings in the solar system.'
  },
  Venus: {
    name: 'Venus',
    order: 'SOL-02',
    index: '02 / 08',
    symbol: '♀',
    category: 'Terrestrial Planet',
    tagline: 'Runaway Greenhouse • Super-Rotating Acid Atmosphere',
    color: '#EAB308',
    metrics: {
      diameter: { val: '12,104 km', sub: '0.949× Earth', icon: '⌖', label: 'DIAMETER' },
      distance: { val: '108.2M km', sub: '0.723 AU from Sun', icon: '◈', label: 'SOLAR DISTANCE' },
      orbit: { val: '224.7 Earth Days', sub: 'Near-Circular Orbit', icon: '↻', label: 'ORBIT PERIOD' },
      rotation: { val: '243 Earth Days', sub: 'Retrograde Clockwise', icon: '⏳', label: 'DAY LENGTH' },
      moons: { val: '0 Moons', sub: 'No Satellites', icon: '◎', label: 'KNOWN MOONS' },
      temp: '465°C',
      tempSub: '92 Bar Atmospheric Pressure',
      tempIcon: '🌡',
      tempLabel: 'SURFACE TEMP'
    },
    gravity: '8.87 m/s²',
    density: '5.24 g/cm³',
    axialTilt: '177.4°',
    composition: ['96.5% CO₂', '3.5% N₂', '0.015% SO₂'],
    description:
      'Earth’s scorching twin. Wrapped in dense clouds of sulfuric acid with atmospheric pressure 92 times that of Earth, Venus experiences a ferocious runaway greenhouse effect, making it the hottest planet.'
  },
  Earth: {
    name: 'Earth',
    order: 'SOL-03',
    index: '03 / 08',
    symbol: '♁',
    category: 'Terrestrial Planet',
    tagline: 'The Pale Blue Dot • Sanctuary of Complex Life',
    color: '#38BDF8',
    metrics: {
      diameter: { val: '12,742 km', sub: '1.000× Earth Base', icon: '⌖', label: 'DIAMETER' },
      distance: { val: '149.6M km', sub: '1.000 AU (Goldilocks)', icon: '◈', label: 'SOLAR DISTANCE' },
      orbit: { val: '365.25 Days', sub: '1 Astronomical Year', icon: '↻', label: 'ORBIT PERIOD' },
      rotation: { val: '23h 56m 04s', sub: 'Sidereal Rotation', icon: '⏳', label: 'DAY LENGTH' },
      moons: { val: '1 Moon (Luna)', sub: 'Stabilizing Axial Tilt', icon: '◎', label: 'KNOWN MOONS' },
      temp: '15°C Mean',
      tempSub: '-88°C Min / 58°C Max',
      tempIcon: '🌡',
      tempLabel: 'SURFACE TEMP'
    },
    gravity: '9.81 m/s²',
    density: '5.51 g/cm³',
    axialTilt: '23.44°',
    composition: ['78.1% N₂', '20.9% O₂', '0.93% Ar'],
    description:
      'An oasis of life adrift in the cosmic ocean. Earth is the only known celestial sanctuary harboring liquid water oceans, an active nitrogen-oxygen atmosphere, plate tectonics, and a protective magnetic field.'
  },
  Mars: {
    name: 'Mars',
    order: 'SOL-04',
    index: '04 / 08',
    symbol: '♂',
    category: 'Terrestrial Planet',
    tagline: 'The Red Planet • Ancient Riverbeds & Olympus Mons',
    color: '#EF4444',
    metrics: {
      diameter: { val: '6,779 km', sub: '0.532× Earth', icon: '⌖', label: 'DIAMETER' },
      distance: { val: '227.9M km', sub: '1.524 AU from Sun', icon: '◈', label: 'SOLAR DISTANCE' },
      orbit: { val: '687 Earth Days', sub: '1.88 Earth Years', icon: '↻', label: 'ORBIT PERIOD' },
      rotation: { val: '24h 37m 22s', sub: '1 Martian Sol', icon: '⏳', label: 'DAY LENGTH' },
      moons: { val: '2 Moons', sub: 'Phobos & Deimos', icon: '◎', label: 'KNOWN MOONS' },
      temp: '-63°C Mean',
      tempSub: '-140°C Min / 20°C Max',
      tempIcon: '🌡',
      tempLabel: 'SURFACE TEMP'
    },
    gravity: '3.72 m/s²',
    density: '3.93 g/cm³',
    axialTilt: '25.19°',
    composition: ['95.3% CO₂', '2.6% N₂', '1.9% Ar'],
    description:
      'The Red Planet, colored by oxidized iron dust across its desert plains. Mars features Olympus Mons—the largest volcano in the solar system—and ancient riverbeds that once carried vast torrents of water.'
  },
  Jupiter: {
    name: 'Jupiter',
    order: 'SOL-05',
    index: '05 / 08',
    symbol: '♃',
    category: 'Gas Giant',
    tagline: 'Colossus of Sol • Great Red Spot & Jovian Magnetosphere',
    color: '#F59E0B',
    metrics: {
      diameter: { val: '139,820 km', sub: '11.0× Earth', icon: '⌖', label: 'DIAMETER' },
      distance: { val: '778.5M km', sub: '5.20 AU from Sun', icon: '◈', label: 'SOLAR DISTANCE' },
      orbit: { val: '11.86 Earth Yrs', sub: '4,333 Days Orbit', icon: '↻', label: 'ORBIT PERIOD' },
      rotation: { val: '9h 55m', sub: 'Fastest Spin in Sol', icon: '⏳', label: 'DAY LENGTH' },
      moons: { val: '95 Confirmed', sub: '4 Galilean Giants', icon: '◎', label: 'KNOWN MOONS' },
      temp: '-110°C',
      tempSub: 'Cloud Top Level',
      tempIcon: '🌡',
      tempLabel: 'SURFACE TEMP'
    },
    gravity: '24.79 m/s²',
    density: '1.33 g/cm³',
    axialTilt: '3.13°',
    composition: ['89.8% H₂', '10.2% He', '0.3% CH₄'],
    description:
      'The colossus of our solar system, with more mass than all other planets combined. Jupiter is an immense world of swirling hydrogen-helium clouds, turbulent equatorial jet streams, and the ancient Great Red Spot storm.'
  },
  Saturn: {
    name: 'Saturn',
    order: 'SOL-06',
    index: '06 / 08',
    symbol: '♄',
    category: 'Gas Giant',
    tagline: 'The Ringed Jewel • 282,000 km Ring System',
    color: '#FDE047',
    metrics: {
      diameter: { val: '116,460 km', sub: '9.14× Earth', icon: '⌖', label: 'DIAMETER' },
      distance: { val: '1.43B km', sub: '9.54 AU from Sun', icon: '◈', label: 'SOLAR DISTANCE' },
      orbit: { val: '29.45 Earth Yrs', sub: '10,759 Earth Days', icon: '↻', label: 'ORBIT PERIOD' },
      rotation: { val: '10h 33m', sub: 'Equatorial Jet Streams', icon: '⏳', label: 'DAY LENGTH' },
      moons: { val: '146 Confirmed', sub: 'Titan & Enceladus Oceans', icon: '◎', label: 'KNOWN MOONS' },
      temp: '-140°C',
      tempSub: 'Cloud Top Level',
      tempIcon: '🌡',
      tempLabel: 'SURFACE TEMP'
    },
    gravity: '10.44 m/s²',
    density: '0.69 g/cm³',
    axialTilt: '26.73°',
    composition: ['96.3% H₂', '3.25% He', '0.45% CH₄'],
    description:
      'The crown jewel of planetary astronomy, surrounded by an iconic ring system spanning 282,000 km. Composed primarily of billions of water-ice fragments, Saturn is also less dense than water.'
  },
  Uranus: {
    name: 'Uranus',
    order: 'SOL-07',
    index: '07 / 08',
    symbol: '♅',
    category: 'Ice Giant',
    tagline: 'The Rolling Giant • Extreme 97.8° Axial Tilt',
    color: '#67E8F9',
    metrics: {
      diameter: { val: '50,724 km', sub: '3.98× Earth', icon: '⌖', label: 'DIAMETER' },
      distance: { val: '2.87B km', sub: '19.2 AU from Sun', icon: '◈', label: 'SOLAR DISTANCE' },
      orbit: { val: '84.0 Earth Yrs', sub: '30,687 Earth Days', icon: '↻', label: 'ORBIT PERIOD' },
      rotation: { val: '17h 14m', sub: 'Retrograde Rolling Spin', icon: '⏳', label: 'DAY LENGTH' },
      moons: { val: '28 Confirmed', sub: 'Titania, Oberon, Miranda', icon: '◎', label: 'KNOWN MOONS' },
      temp: '-224°C',
      tempSub: 'Coldest Sol Atmosphere',
      tempIcon: '🌡',
      tempLabel: 'SURFACE TEMP'
    },
    gravity: '8.69 m/s²',
    density: '1.27 g/cm³',
    axialTilt: '97.77°',
    composition: ['82.5% H₂', '15.2% He', '2.3% CH₄'],
    description:
      'A pale aquamarine ice giant composed of water, methane, and ammonia ices. Uranus rotates on an extraordinary 97.8° axial tilt—effectively rolling on its side along its 84-year orbit around the Sun.'
  },
  Neptune: {
    name: 'Neptune',
    order: 'SOL-08',
    index: '08 / 08',
    symbol: '♆',
    category: 'Ice Giant',
    tagline: 'Supersonic Winds • Cryovolcanic Triton System',
    color: '#3B82F6',
    metrics: {
      diameter: { val: '49,244 km', sub: '3.86× Earth', icon: '⌖', label: 'DIAMETER' },
      distance: { val: '4.50B km', sub: '30.1 AU from Sun', icon: '◈', label: 'SOLAR DISTANCE' },
      orbit: { val: '164.8 Earth Yrs', sub: '60,190 Earth Days', icon: '↻', label: 'ORBIT PERIOD' },
      rotation: { val: '16h 06m', sub: 'Supersonic 2,100 km/h', icon: '⏳', label: 'DAY LENGTH' },
      moons: { val: '16 Confirmed', sub: 'Triton (Captured Kuiper)', icon: '◎', label: 'KNOWN MOONS' },
      temp: '-218°C',
      tempSub: 'Cloud Top Level',
      tempIcon: '🌡',
      tempLabel: 'SURFACE TEMP'
    },
    gravity: '11.15 m/s²',
    density: '1.64 g/cm³',
    axialTilt: '28.32°',
    composition: ['80.0% H₂', '19.0% He', '1.5% CH₄'],
    description:
      'The outermost major planet, an intense deep-blue world swept by supersonic winds exceeding 2,100 km/h. Neptune’s largest moon, Triton, is a captured Kuiper Belt object featuring active cryovolcanic geysers.'
  }
};

const planetModelCache = new Map();

export default function PlanetShowcase({ planetName, onClose }) {
  const canvasMountRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const info = PLANET_INFO[planetName] || PLANET_INFO['Earth'];

  useEffect(() => {
    const mount = canvasMountRef.current;
    if (!mount) return;

    setLoading(true);

    // 1. Showcase Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 4.3);

    const isMobile =
      window.innerWidth < 768 ||
      /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(isMobile ? 1.0 : Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    mount.appendChild(renderer.domElement);

    // 2. High-contrast showcase lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.45);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffae8, 3.0);
    keyLight.position.set(4, 3, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x60a5fa, 1.25);
    fillLight.position.set(-4, -2, -3);
    scene.add(fillLight);

    // 3. User can inspect / rotate the 3D model
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableZoom = false;
    controls.enablePan = false;

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // 4. Load or reuse cached GLB model for this planet
    let isDisposed = false;

    const attachPlanetModel = (gltfScene) => {
      if (isDisposed) return;
      const root = gltfScene.clone(true);
      const box = new THREE.Box3().setFromObject(root);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      root.position.sub(center);

      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 0) {
        root.scale.setScalar(2.65 / maxDim);
      }

      root.rotation.z = 0.12;
      modelGroup.add(root);
      setLoading(false);
    };

    if (planetModelCache.has(planetName)) {
      attachPlanetModel(planetModelCache.get(planetName));
    } else {
      const loader = new GLTFLoader();
      const modelUrl = `/models/${planetName}.glb`;
      loader.load(
        modelUrl,
        (gltf) => {
          planetModelCache.set(planetName, gltf.scene);
          attachPlanetModel(gltf.scene);
        },
        undefined,
        () => {
          if (isDisposed) return;
          const geom = new THREE.SphereGeometry(1.35, 32, 24);
          const mat = new THREE.MeshStandardMaterial({
            color: info.color,
            roughness: 0.5,
            metalness: 0.1
          });
          const mesh = new THREE.Mesh(geom, mat);
          modelGroup.add(mesh);
          setLoading(false);
        }
      );
    }

    // 5. Continuous smooth showcase rotation
    const clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      modelGroup.rotation.y += dt * 0.45; // continuous rotating showcase
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      modelGroup.traverse((child) => {
        if (child.isMesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => {
                if (m.map) m.map.dispose();
                m.dispose();
              });
            } else {
              if (child.material.map) child.material.map.dispose();
              child.material.dispose();
            }
          }
        }
      });
      renderer.dispose();
      if (renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [planetName, info.color]);

  return (
    <div
      className="planet-corner-showcase"
      style={{
        border: `1.5px solid ${info.color}44`,
        boxShadow: `0 24px 60px rgba(0, 0, 0, 0.9), 0 0 35px ${info.color}1c, inset 0 1px 0 rgba(255, 255, 255, 0.16)`
      }}
    >
      {/* 1. Observatory Telemetry Header */}
      <div className="showcase-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            className="showcase-badge-pill"
            style={{
              backgroundColor: `${info.color}14`,
              border: `1px solid ${info.color}45`,
              color: info.color
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: info.color,
                boxShadow: `0 0 8px ${info.color}`
              }}
            />
            <span>{info.order} • {info.category}</span>
          </div>

          <span
            style={{
              fontFamily: "'Space Grotesk', monospace",
              fontSize: '10px',
              color: 'rgba(255, 255, 255, 0.4)',
              letterSpacing: '0.08em'
            }}
          >
            {info.index}
          </span>
        </div>

        <button
          onClick={onClose}
          aria-label="Close Showcase"
          className="showcase-close-btn"
          title="Close telemetry view"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <line x1="2" y1="2" x2="10" y2="10" />
            <line x1="10" y1="2" x2="2" y2="10" />
          </svg>
        </button>
      </div>

      {/* 2. Holographic 3D Viewport Chamber */}
      <div className="showcase-viewport-box">
        {/* HUD Viewfinder Reticle Brackets */}
        <div className="showcase-hud-bracket tl" />
        <div className="showcase-hud-bracket tr" />
        <div className="showcase-hud-bracket bl" />
        <div className="showcase-hud-bracket br" />

        {/* Ambient colored backdrop radial aura */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 50% 50%, ${info.color}22 0%, transparent 68%)`,
            pointerEvents: 'none'
          }}
        />

        {/* Scientific HUD Coordinates Overlay */}
        <div className="showcase-hud-indicator" style={{ top: '8px', left: '26px' }}>
          TILT: {info.axialTilt}
        </div>
        <div className="showcase-hud-indicator" style={{ top: '8px', right: '26px' }}>
          SYS: 3D REAL-TIME
        </div>

        {/* Interactive Three.js Mount Canvas */}
        <div
          ref={canvasMountRef}
          style={{ width: '100%', height: '100%', cursor: 'grab' }}
          title="Drag mouse or swipe to rotate 3D model"
        />

        {loading && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#94a3b8',
              fontSize: '11px',
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(10, 16, 32, 0.85)',
              padding: '6px 14px',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderTopColor: info.color,
                borderRadius: '50%',
                animation: 'spinSlow 1s linear infinite'
              }}
            />
            Loading GLB Telemetry...
          </div>
        )}

      </div>

      {/* 3. Structured Telemetry & Scientific Data Section */}
      <div className="showcase-content-area">
        {/* Planet Identity Heading */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <h2
              style={{
                margin: 0,
                fontFamily: "'Oswald', 'Bebas Neue', -apple-system, sans-serif",
                fontSize: 'clamp(28px, 2.3vw, 34px)',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: '#FFF8E9',
                textShadow: '0 2px 14px rgba(0, 0, 0, 0.8)'
              }}
            >
              {info.name}
            </h2>

            {/* Astronomical Symbol Icon */}
            <span
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '22px',
                fontWeight: 600,
                color: info.color,
                opacity: 0.85,
                textShadow: `0 0 12px ${info.color}66`
              }}
              title={`Astronomical Symbol for ${info.name}`}
            >
              {info.symbol}
            </span>
          </div>

          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '11px',
              letterSpacing: '0.12em',
              color: '#F1D5A5',
              textTransform: 'uppercase'
            }}
          >
            {info.tagline}
          </div>
        </div>

        {/* Atmospheric & Physical Tags Strip */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          <div className="showcase-param-chip" title="Surface Gravity">
            <span style={{ color: '#94a3b8' }}>g:</span> {info.gravity}
          </div>
          <div className="showcase-param-chip" title="Mean Bulk Density">
            <span style={{ color: '#94a3b8' }}>ρ:</span> {info.density}
          </div>
          <div className="showcase-param-chip" title="Axial Obliquity">
            <span style={{ color: '#94a3b8' }}>Tilt:</span> {info.axialTilt}
          </div>
          {info.composition.map((comp, idx) => (
            <div
              key={idx}
              className="showcase-param-chip"
              style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}
            >
              {comp}
            </div>
          ))}
        </div>

        {/* Scientific Overview Box with Accent Left Border */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.025)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderLeft: `3px solid ${info.color}`,
            borderRadius: '8px',
            padding: '9px 12px'
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: "'Inter', -apple-system, sans-serif",
              fontSize: '12.5px',
              lineHeight: 1.55,
              color: 'rgba(255, 255, 255, 0.84)',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)'
            }}
          >
            {info.description}
          </p>
        </div>

        {/* Structured 2-Column Telemetry Micro-Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '7px'
          }}
        >
          {/* Card 1: Diameter */}
          <div className="showcase-metric-tile">
            <div className="showcase-metric-header">
              <span>{info.metrics.diameter.icon}</span>
              <span>{info.metrics.diameter.label}</span>
            </div>
            <div className="showcase-metric-value">{info.metrics.diameter.val}</div>
            <div className="showcase-metric-badge">{info.metrics.diameter.sub}</div>
          </div>

          {/* Card 2: Distance */}
          <div className="showcase-metric-tile">
            <div className="showcase-metric-header">
              <span>{info.metrics.distance.icon}</span>
              <span>{info.metrics.distance.label}</span>
            </div>
            <div className="showcase-metric-value">{info.metrics.distance.val}</div>
            <div className="showcase-metric-badge">{info.metrics.distance.sub}</div>
          </div>

          {/* Card 3: Orbit Period */}
          <div className="showcase-metric-tile">
            <div className="showcase-metric-header">
              <span>{info.metrics.orbit.icon}</span>
              <span>{info.metrics.orbit.label}</span>
            </div>
            <div className="showcase-metric-value">{info.metrics.orbit.val}</div>
            <div className="showcase-metric-badge">{info.metrics.orbit.sub}</div>
          </div>

          {/* Card 4: Day Length */}
          <div className="showcase-metric-tile">
            <div className="showcase-metric-header">
              <span>{info.metrics.rotation.icon}</span>
              <span>{info.metrics.rotation.label}</span>
            </div>
            <div className="showcase-metric-value">{info.metrics.rotation.val}</div>
            <div className="showcase-metric-badge">{info.metrics.rotation.sub}</div>
          </div>

          {/* Card 5: Moons */}
          <div className="showcase-metric-tile">
            <div className="showcase-metric-header">
              <span>{info.metrics.moons.icon}</span>
              <span>{info.metrics.moons.label}</span>
            </div>
            <div
              className="showcase-metric-value"
              style={{ color: info.color }}
            >
              {info.metrics.moons.val}
            </div>
            <div className="showcase-metric-badge">{info.metrics.moons.sub}</div>
          </div>

          {/* Card 6: Temperature */}
          <div className="showcase-metric-tile">
            <div className="showcase-metric-header">
              <span>{info.metrics.tempIcon}</span>
              <span>{info.metrics.tempLabel}</span>
            </div>
            <div className="showcase-metric-value">{info.metrics.temp}</div>
            <div className="showcase-metric-badge">{info.metrics.tempSub}</div>
          </div>
        </div>
      </div>

      {/* 4. Observatory Verification Status Footer */}
      <div className="showcase-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              display: 'inline-block',
              animation: 'telemetryLedPulse 2.2s infinite ease-in-out'
            }}
          />
          <span style={{ color: '#10b981', fontWeight: 600 }}>NASA HORIZONS VERIFIED</span>
        </div>
        <span style={{ color: 'rgba(255, 255, 255, 0.45)' }}>I²IT OBSERVATORY</span>
      </div>
    </div>
  );
}
