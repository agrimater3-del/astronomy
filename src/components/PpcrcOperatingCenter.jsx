import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Module-level persistent cache: 12MB model is loaded/parsed once and preserved forever
let cachedBuildingScene = null;
let buildingLoadingPromise = null;

export function preloadPpcrcBuilding() {
  if (cachedBuildingScene) return Promise.resolve(cachedBuildingScene);
  if (buildingLoadingPromise) return buildingLoadingPromise;
  const loader = new GLTFLoader();
  buildingLoadingPromise = new Promise((resolve) => {
    loader.load(
      '/models/ppcrc_building.glb',
      (gltf) => {
        cachedBuildingScene = gltf.scene;
        resolve(gltf.scene);
      },
      undefined,
      (err) => {
        console.warn('Preload building warning:', err);
        resolve(null);
      }
    );
  });
  return buildingLoadingPromise;
}

export default function PpcrcOperatingCenter({ visible = false, onScrollUp }) {
  const mountRef = useRef(null);
  const visibleRef = useRef(visible);
  const [lettersFinished, setLettersFinished] = useState(false);
  const titleLetters = ['P', 'P', 'R', 'C', ' ', 'B', 'U', 'I', 'L', 'D', 'I', 'N', 'G'];

  useEffect(() => {
    visibleRef.current = visible;
    if (visible) {
      setLettersFinished(false);
      const timer = setTimeout(() => {
        setLettersFinished(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    let animId;
    let isDisposed = false;

    const width = container.clientWidth || window.innerWidth * 0.52;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#02040b');

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    // Direct front-three-quarter facade view
    camera.position.set(22, 17, 46);

    const isMobile =
      window.innerWidth < 768 ||
      /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isMobile ? 1.0 : Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.target.set(0, 7.5, -5);
    controls.minDistance = 14;
    controls.maxDistance = 120;
    controls.maxPolarAngle = Math.PI / 2 + 0.02; // Prevents camera from going under ground

    // 2. High-Fidelity Studio Architectural Lighting
    const hemiLight = new THREE.HemisphereLight(0xcfd6de, 0x1e2430, 1.45);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
    sunLight.position.set(28, 48, 40);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = isMobile ? 1024 : 2048;
    sunLight.shadow.mapSize.height = isMobile ? 1024 : 2048;
    sunLight.shadow.bias = -0.0001;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x94a3b8, 1.0);
    fillLight.position.set(-24, 26, 32);
    scene.add(fillLight);

    const bounceLight = new THREE.DirectionalLight(0xb0bec5, 0.5);
    bounceLight.position.set(0, -10, 20);
    scene.add(bounceLight);

    // Bright Multi-Level Interior Atrium Lights (Centered at Atrium Z = -12.6)
    const atriumLight1 = new THREE.PointLight(0xfff8e8, 3.8, 45);
    atriumLight1.position.set(0, 3.5, -12.6);
    scene.add(atriumLight1);

    const atriumLight2 = new THREE.PointLight(0xfff8e8, 3.2, 45);
    atriumLight2.position.set(0, 11.0, -12.6);
    scene.add(atriumLight2);

    const atriumLight3 = new THREE.PointLight(0xfff8e8, 3.2, 50);
    atriumLight3.position.set(0, 18.0, -12.6);
    scene.add(atriumLight3);

    // 3. Ground Plane
    const groundGeo = new THREE.PlaneGeometry(350, 350);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0a101d,
      roughness: 0.85,
      metalness: 0.08
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -0.02;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // Subtle Ground Grid Rings for futuristic high-tech digital twin feel
    const gridHelper = new THREE.GridHelper(160, 40, 0x38bdf8, 0x1e293b);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // 4. Load Authentic PPCRC Building GLB with Calibrated Original Colors
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Calibrated Reference Color Materials matching the authentic physical PPCRC building
    const matCream = new THREE.MeshStandardMaterial({ color: 0xf4efe8, roughness: 0.65, metalness: 0.05 });
    const matPeach = new THREE.MeshStandardMaterial({ color: 0xd9a994, roughness: 0.55, metalness: 0.05 });
    const matTerracotta = new THREE.MeshStandardMaterial({ color: 0xba4530, roughness: 0.60, metalness: 0.05 });
    const matStoneTread = new THREE.MeshStandardMaterial({ color: 0xede7df, roughness: 0.70, metalness: 0.05 });
    const matWoodBeech = new THREE.MeshStandardMaterial({ color: 0xd7ac7c, roughness: 0.45, metalness: 0.05 });
    const matStainless = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.25, metalness: 0.85 });
    const matGlass = new THREE.MeshPhysicalMaterial({ color: 0x5f8099, transparent: true, opacity: 0.5, roughness: 0.1, transmission: 0.6 });
    const matFireRed = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.3, metalness: 0.1 });
    const matGranite = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.4, metalness: 0.1 });
    const matWindowFrame = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35, metalness: 0.65 });

    // Procedural Atrium Floor Texture (Terracotta Rust-Red + Black Granite Inlay)
    function createAtriumTexture() {
      const size = 1024;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.CanvasTexture(canvas);

      const cx = size / 2;
      const cy = size / 2;

      // Granite perimeter
      ctx.fillStyle = '#0f1115';
      ctx.fillRect(0, 0, size, size);

      // Terracotta quadrants with cream grout
      const quadInset = 80;
      const quadW = cx - quadInset - 40;
      const quadH = cy - quadInset - 40;
      const tileSize = 30;
      const groutSize = 4;

      const drawGrid = (x0, y0, w, h) => {
        ctx.fillStyle = '#eae4d9';
        ctx.fillRect(x0, y0, w, h);
        ctx.fillStyle = '#b74931';
        for (let x = x0 + groutSize; x < x0 + w - groutSize; x += tileSize + groutSize) {
          for (let y = y0 + groutSize; y < y0 + h - groutSize; y += tileSize + groutSize) {
            const curW = Math.min(tileSize, x0 + w - x - groutSize);
            const curH = Math.min(tileSize, y0 + h - y - groutSize);
            if (curW > 2 && curH > 2) ctx.fillRect(x, y, curW, curH);
          }
        }
      };

      drawGrid(quadInset, quadInset, quadW, quadH);
      drawGrid(cx + 40, quadInset, quadW, quadH);
      drawGrid(quadInset, cy + 40, quadW, quadH);
      drawGrid(cx + 40, cy + 40, quadW, quadH);

      ctx.strokeStyle = '#0f1115';
      ctx.lineWidth = 14;
      ctx.strokeRect(quadInset, quadInset, quadW, quadH);
      ctx.strokeRect(cx + 40, quadInset, quadW, quadH);
      ctx.strokeRect(quadInset, cy + 40, quadW, quadH);
      ctx.strokeRect(cx + 40, cy + 40, quadW, quadH);

      // Center ornamental rosette
      ctx.fillStyle = '#b74931';
      ctx.beginPath();
      ctx.arc(cx, cy, 32, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#eae4d9';
      ctx.lineWidth = 4;
      ctx.stroke();

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      return tex;
    }

    const attachBuildingScene = (rootScene) => {
      if (isDisposed) return;
      const root = rootScene.clone(true);

      root.traverse((child) => {
        if (child.isMesh) {
          const m = child;
          m.castShadow = true;
          m.receiveShadow = true;

          const name = (m.name || '').toLowerCase();
          const parentName = (m.parent ? m.parent.name || '' : '').toLowerCase();
          const ln = name + ' ' + parentName;

          // Completely detach legacy procedural paving, platform, and planter meshes
          const isLegacyGroundOrPlanter =
            ln.includes('glossy tile') ||
            ln.includes('stone paving') ||
            ln.includes('planter') ||
            ln.includes('plant leaf') ||
            ln.includes('plant stem') ||
            ln.includes('concrete platform') ||
            ln.includes('circular platform') ||
            ln.includes('stone inlay') ||
            ln.includes('polished stone ground') ||
            ln.includes('atrium polished') ||
            ln.includes('burgundy planter') ||
            ln.includes('sparse low planting') ||
            ln.includes('planting');

          if (isLegacyGroundOrPlanter) {
            m.visible = false;
            return;
          }

          // Calibrated original color assignment matching physical PPCRC Building
          if (ln.includes('glass')) {
            m.material = matGlass;
          } else if (
            ln.includes('mullion') ||
            ln.includes('transom') ||
            ln.includes('window frame') ||
            ln.includes('grille') ||
            ln.includes('latch') ||
            ln.includes('seal')
          ) {
            m.material = matWindowFrame;
          } else if (
            ln.includes('spandrel') ||
            ln.includes('bay sill') ||
            ln.includes('bay header') ||
            ln.includes('bay raised jamb')
          ) {
            m.material = matCream;
          } else if (
            ln.includes('peach') ||
            ln.includes('pediment') ||
            ln.includes('column') ||
            ln.includes('pier') ||
            ln.includes('balustrade') ||
            ln.includes('arch reveal') ||
            ln.includes('reveal rim')
          ) {
            m.material = matPeach;
          } else if (ln.includes('riser') || ln.includes('stair riser')) {
            m.material = matTerracotta;
          } else if (ln.includes('tread') || ln.includes('nosing') || ln.includes('stair tread')) {
            m.material = matStoneTread;
          } else if (ln.includes('door') || ln.includes('portal') || ln.includes('leaf')) {
            m.material = matWoodBeech;
          } else if (ln.includes('handle') || ln.includes('closer') || ln.includes('railing') || ln.includes('bolt')) {
            m.material = matStainless;
          } else if (ln.includes('fire_alarm')) {
            m.material = matFireRed;
          } else if (ln.includes('skirting') || ln.includes('platform') || ln.includes('mortar seam')) {
            m.material = matGranite;
          } else if (ln.includes('wall') || ln.includes('facade') || ln.includes('wing') || ln.includes('coping')) {
            m.material = matCream;
          } else {
            m.material = matCream;
          }
        }
      });

      // Center on X and Z, set bottom to ground
      const box = new THREE.Box3().setFromObject(root);
      const center = box.getCenter(new THREE.Vector3());
      root.position.x = -center.x;
      root.position.z = -center.z - 6; // Center atrium around target
      root.position.y = -box.min.y;

      // Add Authentic Atrium Floor Mesh
      const atriumFloorGeo = new THREE.PlaneGeometry(23.2, 23.2);
      const atriumFloorMat = new THREE.MeshStandardMaterial({
        map: createAtriumTexture(),
        roughness: 0.25,
        metalness: 0.1
      });
      const atriumFloorMesh = new THREE.Mesh(atriumFloorGeo, atriumFloorMat);
      atriumFloorMesh.rotation.x = -Math.PI / 2;
      atriumFloorMesh.position.set(0, 0.08, -12.6);
      atriumFloorMesh.receiveShadow = true;
      root.add(atriumFloorMesh);

      // Add Front Portico Round Pillars
      const createFrontPillar = (px, pz) => {
        const pg = new THREE.Group();
        const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.40, 0.28, 24), matPeach);
        plinth.position.y = 0.14;
        pg.add(plinth);

        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.30, 1.45, 24), matCream);
        shaft.position.y = 0.28 + 0.725;
        pg.add(shaft);

        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.30, 0.18, 24), matPeach);
        cap.position.y = 0.28 + 1.45 + 0.09;
        pg.add(cap);

        const finial = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), matCream);
        finial.position.y = 0.28 + 1.45 + 0.18 + 0.18;
        pg.add(finial);

        pg.position.set(px, 0, pz);
        root.add(pg);
      };

      createFrontPillar(-7.6, 9.2);
      createFrontPillar(7.6, 9.2);

      modelGroup.add(root);
    };

    if (cachedBuildingScene) {
      attachBuildingScene(cachedBuildingScene);
    } else {
      preloadPpcrcBuilding().then((scene) => {
        if (scene) attachBuildingScene(scene);
      });
    }

    // 5. Continuous Smooth Cinematic Orbit & Controls Update
    const clock = new THREE.Clock();
    let isUserInteracting = false;

    const onControlsStart = () => { isUserInteracting = true; };
    const onControlsEnd = () => { isUserInteracting = false; };
    controls.addEventListener('start', onControlsStart);
    controls.addEventListener('end', onControlsEnd);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!visibleRef.current) return;
      const dt = clock.getDelta();

      // Slow elegant showcase rotation when user isn't dragging
      if (!isUserInteracting) {
        modelGroup.rotation.y += dt * 0.08;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      controls.removeEventListener('start', onControlsStart);
      controls.removeEventListener('end', onControlsEnd);
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
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      className="ppcrc-operating-stage"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 45,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pointerEvents: visible ? 'auto' : 'none',
        visibility: visible ? 'visible' : 'hidden',
        opacity: visible ? 1 : 0,
        background: 'radial-gradient(ellipse at 25% 50%, rgba(10, 18, 38, 0.6) 0%, rgba(2, 4, 11, 0.98) 100%)',
        transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.6s',
        userSelect: visible ? 'auto' : 'none'
      }}
    >
      {/* -------------------------------------------------------------
          LEFT SIDE: 3D PPCRC BUILDING DIGITAL TWIN (INTERACTIVE 360°)
          ------------------------------------------------------------- */}
      <div
        style={{
          position: 'relative',
          width: '54vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div
          ref={mountRef}
          style={{
            width: '100%',
            height: '100%',
            cursor: 'grab'
          }}
          title="Drag to orbit & inspect PPCRC Building 360°"
        />

        {/* 3D Interaction Badge & Return to Orbit Button */}
        <button
          type="button"
          onClick={onScrollUp}
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '7px 14px',
            borderRadius: '9999px',
            background: 'rgba(2, 6, 18, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            backdropFilter: 'blur(8px)',
            fontFamily: "'Space Grotesk', monospace",
            fontSize: '10px',
            letterSpacing: '0.1em',
            color: 'rgba(255, 255, 255, 0.85)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(56, 189, 248, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.5)';
            e.currentTarget.style.color = '#38bdf8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(2, 6, 18, 0.85)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M18 15l-6-6-6 6" />
          </svg>
          <span>↑ RETURN TO ORBIT</span>
        </button>
      </div>

      {/* -------------------------------------------------------------
          RIGHT SIDE: OPERATING CENTER & HEADQUARTERS INFORMATION PANE
          ------------------------------------------------------------- */}
      <div
        className="ppcrc-info-card"
        style={{
          position: 'relative',
          width: 'min(560px, 42vw)',
          marginRight: 'clamp(28px, 4.5vw, 68px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          padding: '28px 32px',
          borderRadius: '22px',
          background: 'linear-gradient(145deg, rgba(3, 6, 16, 0.94) 0%, rgba(2, 4, 11, 0.97) 100%)',
          backdropFilter: 'blur(20px) saturate(160%)',
          WebkitBackdropFilter: 'blur(20px) saturate(160%)',
          border: '1px solid rgba(241, 213, 165, 0.22)',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.9), 0 0 35px rgba(241, 213, 165, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
          userSelect: 'none'
        }}
      >
        {/* Eyebrow Mission Badge & Close Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '3px 10px',
              borderRadius: '9999px',
              background: 'rgba(241, 213, 165, 0.12)',
              border: '1px solid rgba(241, 213, 165, 0.35)',
              color: '#F1D5A5',
              fontFamily: "'Space Grotesk', -apple-system, sans-serif",
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase'
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#F1D5A5',
                boxShadow: '0 0 8px #F1D5A5',
                animation: 'telemetryLedPulse 2s infinite ease-in-out'
              }}
            />
            <span>I²IT ASTRONOMY CLUB // OPERATING CENTER</span>
          </div>

          <button
            onClick={onScrollUp}
            aria-label="Close Operating Center"
            className="showcase-close-btn"
            title="Return to Space Orbit"
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
              <line x1="1" y1="1" x2="11" y2="11" />
              <line x1="11" y1="1" x2="1" y2="11" />
            </svg>
          </button>
        </div>

        {/* Title: PPCRC BUILDING */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <h1
            style={{
              margin: 0,
              display: 'flex',
              gap: '3px',
              fontFamily: "'Oswald', 'Bebas Neue', -apple-system, sans-serif",
              fontSize: 'clamp(36px, 4.0vw, 52px)',
              fontWeight: 700,
              letterSpacing: '0.06em',
              lineHeight: 1.0,
              textTransform: 'uppercase',
              color: '#FFF8E9',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.9), 0 0 35px rgba(241, 213, 165, 0.25)'
            }}
          >
            {titleLetters.map((char, index) => (
              <span
                key={index}
                style={{
                  display: 'inline-block',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'scale(1)' : 'scale(0.8)',
                  transition: `opacity 0.5s ease ${index * 0.04}s, transform 0.5s ease ${index * 0.04}s`
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>

          <h2
            style={{
              margin: '4px 0 0',
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(11px, 0.92vw, 13px)',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#F1D5A5',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)'
            }}
          >
            PRALHAD P. CHHABRIA RESEARCH CENTER • HINJAWADI, PUNE
          </h2>
        </div>

        {/* Concise Narrative Description */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            opacity: lettersFinished ? 1 : 0,
            transform: lettersFinished ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease'
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: "'Inter', -apple-system, sans-serif",
              fontSize: 'clamp(12px, 0.90vw, 13.5px)',
              lineHeight: 1.55,
              color: 'rgba(255, 255, 255, 0.88)',
              textShadow: '0 1px 4px rgba(0, 0, 0, 0.9)'
            }}
          >
            The operational nerve center and observatory headquarters of the I²IT Astronomy Club.
            Located within the prestigious PPCRC facility at the International Institute of Information Technology,
            Hinjawadi Pune. This complex houses our mission control telemetry desks, high-resolution optical telescope
            arrays, computational astrophysics workstations, and rooftop observation deck for deep-sky stargazing.
          </p>
        </div>

        {/* Geographic & Facility Chips */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            opacity: lettersFinished ? 1 : 0,
            transform: lettersFinished ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s'
          }}
        >
          {['18.5912° N, 73.7389° E', '574M ELEVATION', 'HINJAWADI PHASE 1', 'LEVEL-3 OBSERVATORY', '24/7 ACTIVE STATION'].map(
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

        {/* 6 Telemetry Tiles Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '6px',
            opacity: lettersFinished ? 1 : 0,
            transform: lettersFinished ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s'
          }}
        >
          <div className="showcase-metric-tile" style={{ padding: '6px 10px' }}>
            <div className="showcase-metric-header">
              <span>⌖</span>
              <span>CAMPUS LOCATION</span>
            </div>
            <div className="showcase-metric-value" style={{ fontSize: '13px' }}>I²IT Hinjawadi, Pune</div>
            <div className="showcase-metric-badge">Phase 1 InfoTech Park</div>
          </div>

          <div className="showcase-metric-tile" style={{ padding: '6px 10px' }}>
            <div className="showcase-metric-header">
              <span>◈</span>
              <span>ALTITUDE</span>
            </div>
            <div className="showcase-metric-value" style={{ fontSize: '13px' }}>574m MSL</div>
            <div className="showcase-metric-badge">Optimal Dark-Sky Baseline</div>
          </div>

          <div className="showcase-metric-tile" style={{ padding: '6px 10px' }}>
            <div className="showcase-metric-header">
              <span>↻</span>
              <span>OBSERVATION DECK</span>
            </div>
            <div className="showcase-metric-value" style={{ fontSize: '13px' }}>Rooftop Sky Deck</div>
            <div className="showcase-metric-badge">360° Unobstructed Horizon</div>
          </div>

          <div className="showcase-metric-tile" style={{ padding: '6px 10px' }}>
            <div className="showcase-metric-header">
              <span>⏳</span>
              <span>HARDWARE ARRAYS</span>
            </div>
            <div className="showcase-metric-value" style={{ fontSize: '13px' }}>8" Dobsonian &amp; SCT</div>
            <div className="showcase-metric-badge">Solar &amp; Deep-Sky Optics</div>
          </div>

          <div className="showcase-metric-tile" style={{ padding: '6px 10px' }}>
            <div className="showcase-metric-header">
              <span>◎</span>
              <span>ASTRO-IMAGING LAB</span>
            </div>
            <div className="showcase-metric-value" style={{ fontSize: '13px', color: '#F1D5A5' }}>
              Mission Control Room
            </div>
            <div className="showcase-metric-badge">Spectral &amp; Data Pipeline</div>
          </div>

          <div className="showcase-metric-tile" style={{ padding: '6px 10px' }}>
            <div className="showcase-metric-header">
              <span>🌡</span>
              <span>OPERATING STATUS</span>
            </div>
            <div className="showcase-metric-value" style={{ fontSize: '13px', color: '#34D399' }}>
              Active 24/7 Ground Station
            </div>
            <div className="showcase-metric-badge">NASA Horizons Linked</div>
          </div>
        </div>
      </div>
    </div>
  );
}
