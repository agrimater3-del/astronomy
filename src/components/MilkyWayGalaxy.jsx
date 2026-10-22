import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export const PC_TO_LY = 3.26156;

function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export default function MilkyWayGalaxy({
  mode = 'galaxy',
  paused = false,
  isTilted = false,
  solarZoom = 0.0,
  onCoreZoomComplete,
  onSelectPlanet
}) {
  const mountRef = useRef(null);
  const pausedRef = useRef(paused);
  const isTiltedRef = useRef(isTilted);
  const solarZoomRef = useRef(solarZoom);
  const onCoreZoomCompleteRef = useRef(onCoreZoomComplete);
  const onSelectPlanetRef = useRef(onSelectPlanet);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    isTiltedRef.current = isTilted;
  }, [isTilted]);

  useEffect(() => {
    solarZoomRef.current = solarZoom;
  }, [solarZoom]);

  useEffect(() => {
    onCoreZoomCompleteRef.current = onCoreZoomComplete;
  }, [onCoreZoomComplete]);

  useEffect(() => {
    onSelectPlanetRef.current = onSelectPlanet;
  }, [onSelectPlanet]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // ------------------------------------------------------------
    // 1. Scene, Camera, Renderer
    // ------------------------------------------------------------
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#02040b');

    // Ambient cosmic starlight fill so night sides of planets remain softly discernible
    const ambientLight = new THREE.AmbientLight(0x8da4c8, 1.35);
    scene.add(ambientLight);

    const camera = new THREE.PerspectiveCamera(
      52,
      window.innerWidth / window.innerHeight,
      0.01,
      250000
    );

    // Camera Fill Light so planets facing the user are always clearly illuminated with rich colors
    const cameraFillLight = new THREE.DirectionalLight(0xdbe6ff, 1.45);
    cameraFillLight.position.set(0, 30, 70);
    camera.add(cameraFillLight);
    scene.add(camera);

    const TAU = Math.PI * 2;
    const DEG = Math.PI / 180;

    // Top-down orientation from cosmic view
    const topDownPhi = 88.5 * DEG;
    const topDownTheta = -42 * DEG;
    const cameraR = 30000;

    const cx = cameraR * Math.cos(topDownPhi) * Math.sin(topDownTheta);
    const cy = cameraR * Math.sin(topDownPhi);
    const cz = cameraR * Math.cos(topDownPhi) * Math.cos(topDownTheta);
    camera.position.set(cx, cy, cz);
    camera.lookAt(0, 0, 0);

    const isMobile =
      typeof window !== 'undefined' &&
      (window.innerWidth < 768 ||
        /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent));

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: false,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(
      isMobile
        ? Math.min(window.devicePixelRatio, 1.25)
        : Math.min(window.devicePixelRatio, 1.75)
    );
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 20;
    controls.maxDistance = 120000;
    controls.enabled = false;

    const galaxy = new THREE.Group();
    galaxy.scale.setScalar(1.0);
    scene.add(galaxy);

    let seed = 14783;
    function random() {
      seed = (1664525 * seed + 1013904223) >>> 0;
      return seed / 4294967296;
    }
    function gaussian() {
      return (
        Math.sqrt(-2 * Math.log(Math.max(random(), 1e-9))) *
        Math.cos(TAU * random())
      );
    }

    function createGlowTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 64;
      const ctx = canvas.getContext('2d');
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.15, 'rgba(255,255,255,0.9)');
      g.addColorStop(0.45, 'rgba(255,255,255,0.25)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(canvas);
    }
    const glow = createGlowTexture();

    function pointCloud(parent, positions, colors, size, opacity = 1) {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(positions, 3)
      );
      geometry.setAttribute(
        'color',
        new THREE.Float32BufferAttribute(colors, 3)
      );
      const material = new THREE.PointsMaterial({
        size,
        map: glow,
        vertexColors: true,
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      const points = new THREE.Points(geometry, material);
      parent.add(points);
      return points;
    }

    function createMarker(position, color, size, parent) {
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: glow,
          color,
          transparent: true,
          depthTest: false,
          blending: THREE.AdditiveBlending
        })
      );
      sprite.position.copy(position);
      sprite.scale.setScalar(size);
      parent.add(sprite);
      return sprite;
    }

    // ------------------------------------------------------------
    // 2. Texture Loader & Canvas Billboarding Label Factory
    // ------------------------------------------------------------
    const textureLoader = new THREE.TextureLoader();
    function loadTexture(url) {
      const tex = textureLoader.load(url);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    }

    const textures = {
      sun: loadTexture('/textures/sun.webp'),
      mercury: loadTexture('/textures/mercury.webp'),
      venus: loadTexture('/textures/venus.webp'),
      earth: loadTexture('/textures/earth_photorealistic.webp'),
      moon: loadTexture('/textures/moon.webp'),
      mars: loadTexture('/textures/mars.webp'),
      jupiter: loadTexture('/textures/jupiter.webp'),
      saturn: loadTexture('/textures/saturn.webp'),
      saturnRing: loadTexture('/textures/saturn_ring.png'),
      uranus: loadTexture('/textures/uranus.png'),
      neptune: loadTexture('/textures/neptune.webp')
    };

    /**
     * Creates a high-DPI billboarding sprite for planet names.
     * PURE TEXT ONLY - NO PLATES, NO BOXES, NO BORDERS.
     * Uses heading font: bold condensed Oswald / Bebas Neue, warm ivory (#FFF8E9) with deep soft shadow.
     * Slightly bigger, crisp and clearly visible across full screen.
     * Uses THREE.Sprite so the name ALWAYS faces straight to the user.
     */
    function createPlanetLabelSprite(name) {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 160;
      const ctx = canvas.getContext('2d');

      // 100% transparent background - NO plates, NO pills, NO boxes, NO borders!
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      // Main heading style: bold, condensed Oswald / Bebas Neue, uppercase, warm ivory (#FFF8E9)
      ctx.font = '700 72px "Oswald", "Bebas Neue", -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '6px';

      // Deep cosmic drop shadow for extreme contrast against stars and planetary orbits
      ctx.shadowColor = 'rgba(0, 0, 0, 0.96)';
      ctx.shadowBlur = 16;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;

      // Warm Ivory (#FFF8E9) text color matching "COSMOS" & "THE MILKY WAY"
      ctx.fillStyle = '#FFF8E9';
      ctx.fillText(name.toUpperCase(), canvas.width / 2, canvas.height / 2);

      // Second pass for sharpness and clarity
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 2;
      ctx.fillText(name.toUpperCase(), canvas.width / 2, canvas.height / 2);
      ctx.restore();

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      const mat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0,
        depthTest: false,
        depthWrite: false
      });

      const sprite = new THREE.Sprite(mat);
      // Aspect ratio 640 / 160 = 4.0
      // Slightly big and clearly visible floating in 3D space:
      sprite.scale.set(16.0, 4.0, 1.0);
      return sprite;
    }

    /**
     * Creates a high-tech HUD targeting reticle for Pune, India.
     */
    function createPuneTargetSprite() {
      const canvas = document.createElement('canvas');
      canvas.width = 720;
      canvas.height = 240;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      // Translucent backdrop pill with cyan edge
      ctx.fillStyle = 'rgba(2, 6, 20, 0.88)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
      ctx.lineWidth = 3;
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(16, 16, 688, 208, 20);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillRect(16, 16, 688, 208);
        ctx.strokeRect(16, 16, 688, 208);
      }

      // Corner targeting crosshairs in gold
      ctx.strokeStyle = '#f1d5a5';
      ctx.lineWidth = 4;
      // Top-left
      ctx.beginPath(); ctx.moveTo(34, 60); ctx.lineTo(34, 34); ctx.lineTo(60, 34); ctx.stroke();
      // Top-right
      ctx.beginPath(); ctx.moveTo(686, 60); ctx.lineTo(686, 34); ctx.lineTo(660, 34); ctx.stroke();
      // Bottom-left
      ctx.beginPath(); ctx.moveTo(34, 180); ctx.lineTo(34, 206); ctx.lineTo(60, 206); ctx.stroke();
      // Bottom-right
      ctx.beginPath(); ctx.moveTo(686, 180); ctx.lineTo(686, 206); ctx.lineTo(660, 206); ctx.stroke();

      // Badge: TARGET LOCKED
      ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(46, 36, 240, 38, 19);
        ctx.fill();
      }
      ctx.fillStyle = '#38bdf8';
      ctx.font = '700 18px "Space Grotesk", monospace';
      ctx.fillText('⌖ TARGET LOCKED', 64, 62);

      // Main Heading: PUNE, INDIA
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 40px "Oswald", -apple-system, sans-serif';
      ctx.fillText('PUNE, INDIA', 46, 126);

      // Subtext: 18.5204° N, 73.8567° E • PPCRC COMPLEX
      ctx.fillStyle = '#f1d5a5';
      ctx.font = '600 22px "Space Grotesk", monospace';
      ctx.fillText('18.5204° N, 73.8567° E', 46, 166);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 18px "Space Grotesk", sans-serif';
      ctx.fillText('PPCRC COMPLEX • I²IT HINJAWADI', 46, 198);

      ctx.restore();

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      const mat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0,
        depthTest: false,
        depthWrite: false
      });

      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(0.40, 0.133, 1.0);
      return sprite;
    }

    // ------------------------------------------------------------
    // 3. Milky Way Galaxy Structure (103,500 Authentic Stars)
    // ------------------------------------------------------------
    const starPositions = [];
    const starColors = [];
    const tempColor = new THREE.Color();

    function addStar(x, y, z, population) {
      starPositions.push(x, y, z);
      const t = random();

      if (population === 'old') {
        tempColor.setHSL(0.075 + random() * 0.055, 0.4, 0.57 + random() * 0.3);
      } else if (t < 0.18) {
        tempColor.setHSL(0.60, 0.55, 0.75 + random() * 0.2);
      } else if (t < 0.58) {
        tempColor.setHSL(0.10, 0.25, 0.75 + random() * 0.2);
      } else {
        tempColor.setHSL(0.035, 0.5, 0.55 + random() * 0.3);
      }
      starColors.push(tempColor.r, tempColor.g, tempColor.b);
    }

    const pitch = 13 * DEG;
    function armAngle(radius, arm) {
      return (
        (arm * TAU) / 4 +
        Math.log(Math.max(radius, 1600) / 1600) / Math.tan(pitch)
      );
    }

    // Dynamic authentic star counts: 103,500 on desktop, silky-smooth 45,000 on mobile
    const diskCount = isMobile ? 32000 : 75000;
    const bulgeCount = isMobile ? 6500 : 15000;
    const barCount = isMobile ? 3500 : 8000;
    const haloCount = isMobile ? 1200 : 2000;
    const gasCount = isMobile ? 1800 : 3500;

    // Disk Stars
    for (let i = 0; i < diskCount; i++) {
      let r;
      do {
        r = -2600 * Math.log(Math.max(random() * random(), 1e-12));
      } while (r > 15000);

      let theta = random() * TAU;
      if (r > 2800 && random() < 0.52) {
        theta = armAngle(r, Math.floor(random() * 4)) + gaussian() * 0.085;
      }

      const thick = random() < 0.12;
      const y = gaussian() * (thick ? 750 : 180);
      addStar(r * Math.cos(theta), y, r * Math.sin(theta), 'disk');
    }

    // Bulge Stars
    for (let i = 0; i < bulgeCount; i++) {
      addStar(
        gaussian() * 1150,
        gaussian() * 600,
        gaussian() * 1000,
        'old'
      );
    }

    // Stellar Bar Stars
    const barAngle = 27 * DEG;
    for (let i = 0; i < barCount; i++) {
      const u = (random() * 2 - 1) * 4300;
      const v = gaussian() * 360;
      addStar(
        u * Math.cos(barAngle) - v * Math.sin(barAngle),
        gaussian() * 220,
        u * Math.sin(barAngle) + v * Math.cos(barAngle),
        'old'
      );
    }

    // Halo Stars
    for (let i = 0; i < haloCount; i++) {
      const r = 3000 + Math.pow(random(), 1.7) * 22000;
      const cosTheta = random() * 2 - 1;
      const phi = random() * TAU;
      const s = Math.sqrt(1 - cosTheta * cosTheta);
      addStar(r * s * Math.cos(phi), r * cosTheta * 0.7, r * s * Math.sin(phi), 'old');
    }

    const starCloud = pointCloud(galaxy, starPositions, starColors, isMobile ? 22 : 27, 0.92);

    // Star-Forming Gas / Nebulae
    const gasPositions = [];
    const gasColors = [];
    for (let i = 0; i < gasCount; i++) {
      const r = 3500 + random() * 10000;
      const theta = armAngle(r, Math.floor(random() * 4)) + gaussian() * 0.045;
      gasPositions.push(r * Math.cos(theta), gaussian() * 90, r * Math.sin(theta));
      const c = new THREE.Color().setHSL(random() < 0.6 ? 0.90 : 0.57, 0.7, 0.55);
      gasColors.push(c.r, c.g, c.b);
    }
    const gasCloud = pointCloud(galaxy, gasPositions, gasColors, 180, 0.12);

    // Center Core Glow Marker
    const coreMarker = createMarker(new THREE.Vector3(0, 0, 0), '#ffcc89', 1600, galaxy);

    // Clean pinprick deep-space background starfield for Earth close-up (NO blurry bokeh)
    const deepSpacePositions = [];
    const deepSpaceColors = [];
    const dsTempColor = new THREE.Color();
    for (let i = 0; i < 2000; i++) {
      const theta = random() * TAU;
      const phi = Math.acos(random() * 2 - 1);
      const r = 160 + random() * 240;
      deepSpacePositions.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
      const hue = random() < 0.25 ? 0.6 : (random() < 0.45 ? 0.1 : 0.0);
      dsTempColor.setHSL(hue, 0.2, 0.75 + random() * 0.25);
      deepSpaceColors.push(dsTempColor.r, dsTempColor.g, dsTempColor.b);
    }
    const deepSpaceGeom = new THREE.BufferGeometry();
    deepSpaceGeom.setAttribute('position', new THREE.Float32BufferAttribute(deepSpacePositions, 3));
    deepSpaceGeom.setAttribute('color', new THREE.Float32BufferAttribute(deepSpaceColors, 3));
    const deepSpaceMat = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      sizeAttenuation: false
    });
    const deepSpaceStars = new THREE.Points(deepSpaceGeom, deepSpaceMat);
    scene.add(deepSpaceStars);

    // ------------------------------------------------------------
    // 4. SOLAR SYSTEM IN THE ORION SPUR
    //    Microscopic scale in galaxy overview (0.0012)
    //    Expands to FULL SCREEN on very slow and smooth scroll zoom!
    // ------------------------------------------------------------
    const solarSystemGroup = new THREE.Group();
    const solarR = 8200;
    const solarAngle = 32 * DEG;
    const solarX = solarR * Math.cos(solarAngle);
    const solarZ = solarR * Math.sin(solarAngle);
    solarSystemGroup.position.set(solarX, 8, solarZ);
    solarSystemGroup.scale.setScalar(0.0012);
    galaxy.add(solarSystemGroup);

    // --- The Sun ---
    const sunGeom = new THREE.SphereGeometry(3.4, 36, 28);
    const sunMat = new THREE.MeshBasicMaterial({
      map: textures.sun,
      color: 0xffffff,
      transparent: true,
      opacity: 1.0
    });
    const sunMesh = new THREE.Mesh(sunGeom, sunMat);
    solarSystemGroup.add(sunMesh);

    // Invisible generous Hit-Sphere on Sun for 100% reliable click detection
    const sunHitGeom = new THREE.SphereGeometry(7.0, 16, 12);
    const sunHitMat = new THREE.MeshBasicMaterial({ visible: false });
    const sunHitMesh = new THREE.Mesh(sunHitGeom, sunHitMat);
    sunMesh.add(sunHitMesh);

    // Radiant Sun Light illuminating daylight side of all planets from Mercury to Neptune
    // decay = 0 guarantees that outer planets (Jupiter, Saturn, Uranus, Neptune) receive strong, rich sunlight
    const sunLight = new THREE.PointLight(0xfff5e6, 8.5, 0, 0);
    solarSystemGroup.add(sunLight);

    // Warm inner solar core illumination
    const sunWarmLight = new THREE.PointLight(0xffaa33, 4.5, 120, 0);
    solarSystemGroup.add(sunWarmLight);

    // Dynamic radial corona glow around Sun
    const sunGlow = createMarker(new THREE.Vector3(0, 0, 0), '#ffe8aa', 18.0, solarSystemGroup);

    // Sun Billboarding Label (Pure Text, Main Heading Style)
    const sunLabelSprite = createPlanetLabelSprite('SUN');
    sunLabelSprite.position.set(0, 6.2, 0);
    solarSystemGroup.add(sunLabelSprite);

    // --- 8 Realistic Planets with NASA Textures, Enhanced Visibility & Billboarding Names ---
    const planetSpecs = [
      {
        name: 'Mercury',
        r: 8.5,
        size: 0.75,
        color: '#b5afa9',
        texture: textures.mercury,
        speed: 2.4,
        rotSpeed: 0.6,
        labelOffset: 2.8
      },
      {
        name: 'Venus',
        r: 13.0,
        size: 1.05,
        color: '#eab308',
        texture: textures.venus,
        speed: 1.8,
        rotSpeed: -0.4,
        labelOffset: 3.2
      },
      {
        name: 'Earth',
        r: 18.5,
        size: 1.20,
        color: '#38bdf8',
        texture: textures.earth,
        speed: 1.35,
        rotSpeed: 1.4,
        hasMoon: true,
        labelOffset: 3.4
      },
      {
        name: 'Mars',
        r: 24.5,
        size: 0.85,
        color: '#ef4444',
        texture: textures.mars,
        speed: 1.05,
        rotSpeed: 1.3,
        labelOffset: 3.0
      },
      {
        name: 'Jupiter',
        r: 34.5,
        size: 2.60,
        color: '#d97706',
        texture: textures.jupiter,
        speed: 0.65,
        rotSpeed: 2.0,
        labelOffset: 5.2
      },
      {
        name: 'Saturn',
        r: 45.5,
        size: 2.20,
        color: '#fde047',
        texture: textures.saturn,
        speed: 0.46,
        rotSpeed: 1.8,
        hasRings: true,
        labelOffset: 4.8
      },
      {
        name: 'Uranus',
        r: 56.5,
        size: 1.55,
        color: '#67e8f9',
        texture: textures.uranus,
        speed: 0.34,
        rotSpeed: -1.2,
        labelOffset: 3.8
      },
      {
        name: 'Neptune',
        r: 66.5,
        size: 1.50,
        color: '#2563eb',
        texture: textures.neptune,
        speed: 0.25,
        rotSpeed: 1.3,
        labelOffset: 3.8
      }
    ];

    const animatedPlanets = [];
    const orbitMeshes = [];
    let earthMeshRef = null;
    let moonMeshRef = null;

    planetSpecs.forEach((spec) => {
      // Clean, delicate glowing orbit ring
      const orbitGeom = new THREE.RingGeometry(spec.r - 0.06, spec.r + 0.06, 160);
      orbitGeom.rotateX(Math.PI / 2);
      const orbitMat = new THREE.MeshBasicMaterial({
        color: 0x70b4ff,
        transparent: true,
        opacity: 0.03,
        side: THREE.DoubleSide
      });
      const orbitRing = new THREE.Mesh(orbitGeom, orbitMat);
      solarSystemGroup.add(orbitRing);
      orbitMeshes.push(orbitRing);

      // Planet Sphere Mesh with NASA texture map and subtle self-illumination
      // so details are crisp and visible regardless of camera viewing angle
      const pGeom = new THREE.SphereGeometry(spec.size, 36, 28);
      const pMat = new THREE.MeshStandardMaterial({
        map: spec.texture,
        roughness: 0.45,
        metalness: 0.05,
        emissive: new THREE.Color(spec.color),
        emissiveMap: spec.texture,
        emissiveIntensity: 0.38,
        transparent: true,
        opacity: 1.0
      });
      const pMesh = new THREE.Mesh(pGeom, pMat);
      solarSystemGroup.add(pMesh);

      // Invisible generous Hit-Sphere for effortless clickability
      const hitGeom = new THREE.SphereGeometry(spec.size * 2.6 + 2.5, 16, 12);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeom, hitMat);
      pMesh.add(hitMesh);

      // Earth & Moon
      if (spec.hasMoon) {
        earthMeshRef = pMesh;
        const moonGeom = new THREE.SphereGeometry(0.38, 20, 16);
        const moonMat = new THREE.MeshStandardMaterial({
          map: textures.moon,
          roughness: 0.7,
          emissive: new THREE.Color(0x94a3b8),
          emissiveMap: textures.moon,
          emissiveIntensity: 0.35
        });
        const moonMesh = new THREE.Mesh(moonGeom, moonMat);
        solarSystemGroup.add(moonMesh);
        moonMeshRef = moonMesh;
      }

      // Saturn Rings with radial texture mapping and warm luminous dust
      if (spec.hasRings) {
        const ringInner = 2.7;
        const ringOuter = 5.8;
        const ringGeom = new THREE.RingGeometry(ringInner, ringOuter, 128);
        const pos = ringGeom.attributes.position;
        const uvs = ringGeom.attributes.uv;
        for (let i = 0; i < pos.count; i++) {
          const rx = pos.getX(i);
          const ry = pos.getY(i);
          const dist = Math.sqrt(rx * rx + ry * ry);
          const u = (dist - ringInner) / (ringOuter - ringInner);
          uvs.setXY(i, u, 0.5);
        }
        uvs.needsUpdate = true;
        ringGeom.rotateX(Math.PI / 2);

        const ringMat = new THREE.MeshStandardMaterial({
          map: textures.saturnRing,
          transparent: true,
          opacity: 0.94,
          roughness: 0.4,
          side: THREE.DoubleSide,
          emissive: new THREE.Color(0xd5bc83),
          emissiveMap: textures.saturnRing,
          emissiveIntensity: 0.38
        });
        const ringMesh = new THREE.Mesh(ringGeom, ringMat);
        ringMesh.rotation.z = 26.7 * DEG;
        pMesh.add(ringMesh);
      }

      // Billboarding Name: Pure text always facing straight to user!
      const labelSprite = createPlanetLabelSprite(spec.name);
      solarSystemGroup.add(labelSprite);

      animatedPlanets.push({
        name: spec.name,
        mesh: pMesh,
        labelSprite,
        r: spec.r,
        size: spec.size,
        speed: spec.speed,
        rotSpeed: spec.rotSpeed,
        labelOffset: spec.labelOffset,
        angle: Math.random() * TAU
      });
    });

    // ------------------------------------------------------------
    // DEDICATED EARTH HERO SHOWCASE GROUP (STAGE 6 - RIGHT SIDE GLB)
    // ------------------------------------------------------------
    const earthHeroGroup = new THREE.Group();
    earthHeroGroup.visible = false;
    scene.add(earthHeroGroup);

    // Group 1: User mouse / touch manual drag rotation
    const earthGlbInteractionGroup = new THREE.Group();
    earthHeroGroup.add(earthGlbInteractionGroup);

    // Group 2: Authentic 23.44° axial tilt
    const earthTiltGroup = new THREE.Group();
    earthTiltGroup.rotation.z = 23.44 * DEG;
    earthGlbInteractionGroup.add(earthTiltGroup);

    // Group 3: Continuous polar axial rotation
    const earthSpinGroup = new THREE.Group();
    earthTiltGroup.add(earthSpinGroup);

    // Dedicated Cinematic Space Lighting for Earth Close-up
    const earthSunLight = new THREE.DirectionalLight(0xfffae8, 3.6);
    earthSunLight.position.set(-10, 6, 14);
    earthHeroGroup.add(earthSunLight);

    const earthFillLight = new THREE.DirectionalLight(0x60a5fa, 1.2);
    earthFillLight.position.set(10, -4, -6);
    earthHeroGroup.add(earthFillLight);

    const earthAtmosphereLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    earthAtmosphereLight.position.set(-4, -8, 10);
    earthHeroGroup.add(earthAtmosphereLight);

    const gltfLoader = new GLTFLoader();

    gltfLoader.load(
      '/models/Earth.glb',
      (gltf) => {
        const root = gltf.scene;
        const box = new THREE.Box3().setFromObject(root);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        root.position.sub(center);

        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 0) {
          root.scale.setScalar(2.0 / maxDim); // normalized to unit diameter
        }
        root.rotation.set(0, 0, 0);
        earthSpinGroup.add(root);
        renderer.compile(scene, camera);
      },
      undefined,
      () => {
        // High-detail fallback sphere with Earth photorealistic texture
        const geom = new THREE.SphereGeometry(1.0, 64, 48);
        const mat = new THREE.MeshStandardMaterial({
          map: textures.earth,
          roughness: 0.5,
          metalness: 0.05
        });
        const fallbackMesh = new THREE.Mesh(geom, mat);
        earthSpinGroup.add(fallbackMesh);
      }
    );

    // ------------------------------------------------------------
    // PUNE, INDIA TARGETING RETICLE & TELEMETRY HUD (STAGE 7)
    // ------------------------------------------------------------
    const puneMarkerGroup = new THREE.Group();
    puneMarkerGroup.visible = false;
    // Accurate coordinates for Pune, Maharashtra, India taking Earth.glb axial tilt into account:
    const puneNorm = new THREE.Vector3(0.2437, 0.6709, -0.7004).normalize();
    puneMarkerGroup.position.copy(puneNorm.clone().multiplyScalar(1.002));
    puneMarkerGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), puneNorm);

    const dotGeom = new THREE.SphereGeometry(0.016, 16, 16);
    const dotMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0 });
    const dotMesh = new THREE.Mesh(dotGeom, dotMat);
    puneMarkerGroup.add(dotMesh);

    const ringGeom = new THREE.RingGeometry(0.024, 0.042, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    puneMarkerGroup.add(ringMesh);

    const puneHudSprite = createPuneTargetSprite();
    puneHudSprite.position.set(0.16, -0.16, 0.04);
    puneMarkerGroup.add(puneHudSprite);

    earthSpinGroup.add(puneMarkerGroup);

    // ------------------------------------------------------------
    // 5. Timeline Choreography & Continuous, Very Slow & Smooth Scroll Physics
    // ------------------------------------------------------------
    const clock = new THREE.Clock();
    const animStartTime = performance.now();
    const shrinkStart = 3.0;
    const shrinkDuration = 2.0;
    const startScale = 1.0;
    const targetScale = 0.20;

    const zoomStart = 8.3;
    const zoomDuration = 2.2;
    const startCamR = cameraR; // 30000
    const targetCamR = 360; // deep inside brightest core

    // Stage 5 parameters: 90° tilt & zoom-out (positioned to the LEFT)
    const targetTiltedPhi = 7.0 * DEG;
    const tiltedCamR = 27000;
    const targetLeftShift = -8200;

    let currentTiltFactor = 0; // 0 = core zoom-in, 1 = tilted 90° & zoomed out to left
    let currentSolarZoom = 0.0; // Continuous float from 0.0 to 3.0
    let continuousEarthRotY = 0; // Continuous axial spin tracker
    let coreZoomFinished = false;
    let moonAngle = 0;
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (pausedRef.current) return;
      const dt = Math.min(clock.getDelta(), 0.1);
      const elapsed = (performance.now() - animStartTime) / 1000;
      let pP = 0;

      if (elapsed < shrinkStart) {
        // Phase 1: 0s-3s
        galaxy.rotation.y += dt * 0.024;
        galaxy.scale.setScalar(startScale);
        galaxy.position.set(0, 0, 0);
      } else if (elapsed >= shrinkStart && elapsed < shrinkStart + shrinkDuration) {
        // Phase 2: 3s-5s
        galaxy.rotation.y += dt * 0.024;
        const p = easeInOutCubic((elapsed - shrinkStart) / shrinkDuration);
        const currentScale = startScale + (targetScale - startScale) * p;
        galaxy.scale.setScalar(currentScale);
        galaxy.position.set(0, 0, 0);
      } else if (elapsed < zoomStart) {
        // Phase 3 & 4: 5s-8.3s
        galaxy.rotation.y += dt * 0.024;
        galaxy.scale.setScalar(targetScale);
        galaxy.position.set(0, 0, 0);
      } else if (elapsed >= zoomStart && elapsed < zoomStart + zoomDuration) {
        // Phase 5: 8.3s+: ZOOM INTO BRIGHTEST CORE
        galaxy.rotation.y += dt * 0.024;
        const p = easeInOutCubic((elapsed - zoomStart) / zoomDuration);
        const currentScale = targetScale + (1.25 - targetScale) * p;
        galaxy.scale.setScalar(currentScale);
        galaxy.position.set(0, 0, 0);

        const currentR = startCamR + (targetCamR - startCamR) * p;
        const cx = currentR * Math.cos(topDownPhi) * Math.sin(topDownTheta);
        const cy = currentR * Math.sin(topDownPhi);
        const cz = currentR * Math.cos(topDownPhi) * Math.cos(topDownTheta);
        camera.position.set(cx, cy, cz);
        camera.lookAt(0, 0, 0);
      } else {
        // Core zoom-in complete!
        if (!coreZoomFinished) {
          coreZoomFinished = true;
          if (onCoreZoomCompleteRef.current) {
            onCoreZoomCompleteRef.current();
          }
        }

        // 1. Tilt transition: COSMOS <-> THE MILKY WAY
        const targetTilt = isTiltedRef.current ? 1.0 : 0.0;
        const tiltSpeed = 1.35;
        if (currentTiltFactor < targetTilt) {
          currentTiltFactor = Math.min(targetTilt, currentTiltFactor + dt * tiltSpeed);
        } else if (currentTiltFactor > targetTilt) {
          currentTiltFactor = Math.max(targetTilt, currentTiltFactor - dt * tiltSpeed);
        }
        const pTilt = easeInOutCubic(currentTiltFactor);

        // 2. Continuous, VERY SLOW AND SMOOTH Solar System & Earth Zoom:
        // Exponential damping (0.045) creates silky-smooth, weighted cinematic camera movement
        const targetSolar = isTiltedRef.current ? Math.min(3.0, Math.max(0.0, solarZoomRef.current)) : 0.0;
        currentSolarZoom += (targetSolar - currentSolarZoom) * 0.045;

        // Stage A: 0.0 to 0.20 dwell, 0.20 to 1.0 dives smoothly into Solar System overview
        const flightProgress = Math.max(0, Math.min(1.0, (currentSolarZoom - 0.20) / 0.80));
        const sP = easeInOutCubic(flightProgress);

        // Stage B: 1.0 to 1.80 dives towards Earth -> replaces Earth with Earth.glb on right side + removes others
        const earthFlight = Math.max(0, Math.min(1.0, (currentSolarZoom - 1.0) / 0.80));
        const eP = easeInOutCubic(earthFlight);

        // Stage C: 1.80 to 2.45 dives directly into Pune, India section!
        const puneFlight = Math.max(0, Math.min(1.0, (currentSolarZoom - 1.80) / 0.55));
        pP = easeInOutCubic(puneFlight);

        // Bulk galaxy rotation eases gently to 0 as we enter the Solar System
        const spinFactor = Math.max(0, 1.0 - sP * 1.0);
        galaxy.rotation.y += dt * 0.024 * spinFactor;

        // Base galactic camera coordinates (edge-on view shifted to left)
        const currentPhi = topDownPhi + (targetTiltedPhi - topDownPhi) * pTilt;
        const currentR = targetCamR + (tiltedCamR - targetCamR) * pTilt;
        const currentScale = 1.25 + (1.0 - 1.25) * pTilt;
        galaxy.scale.setScalar(currentScale);

        // Left shift of galaxy during Milky Way info state smoothly centers as solarZoom increases
        const leftShiftD = targetLeftShift * pTilt * (1.0 - sP * 0.95);
        const gx = leftShiftD * Math.cos(topDownTheta);
        const gz = -leftShiftD * Math.sin(topDownTheta);
        galaxy.position.set(gx, 0, gz);

        const cxGal = currentR * Math.cos(currentPhi) * Math.sin(topDownTheta);
        const cyGal = currentR * Math.sin(currentPhi);
        const czGal = currentR * Math.cos(currentPhi) * Math.cos(topDownTheta);
        const camGalPos = new THREE.Vector3(cxGal, cyGal, czGal);

        // World coordinates of Sun
        const worldSunPos = new THREE.Vector3();
        solarSystemGroup.getWorldPosition(worldSunPos);

        // Full-screen Solar System Camera Framing:
        const localCamOffset = new THREE.Vector3(0, 56, 96);
        localCamOffset.applyEuler(galaxy.rotation);
        const targetSolarCamPos = worldSunPos.clone().add(localCamOffset);

        // Solar stage camera position & lookAt
        const solarCamPos = new THREE.Vector3().lerpVectors(camGalPos, targetSolarCamPos, sP);
        const solarLookAt = new THREE.Vector3(0, 0, 0).lerp(worldSunPos, sP);

        // Solar System Scale: Microscopic in galaxy (0.0012) -> Full screen scale (1.0)
        const currentSolarScale = THREE.MathUtils.lerp(0.0012, 1.0, sP);
        solarSystemGroup.scale.setScalar(currentSolarScale);

        // Dynamic Billboarding Label Opacities:
        const baseLabelAlpha = Math.max(0, Math.min(1.0, (sP - 0.22) / 0.78));
        const orbitAlpha = Math.max(0.015, Math.min(0.24, 0.015 + sP * 0.225));

        if (eP <= 0.001) {
          // Normal Solar System or Milky Way View
          galaxy.visible = true;
          starCloud.material.opacity = 0.92;
          gasCloud.material.opacity = 0.12;
          coreMarker.material.opacity = 1.0;
          deepSpaceMat.opacity = 0;

          camera.position.copy(solarCamPos);
          camera.lookAt(solarLookAt);
          solarSystemGroup.visible = true;
          earthHeroGroup.visible = false;

          animatedPlanets.forEach((p) => {
            p.mesh.material.opacity = 1.0;
            p.mesh.visible = true;
            if (p.labelSprite) {
              p.labelSprite.material.opacity = baseLabelAlpha;
              p.labelSprite.visible = baseLabelAlpha > 0.01;
            }
          });
          if (sunLabelSprite) {
            sunLabelSprite.material.opacity = baseLabelAlpha;
            sunLabelSprite.visible = baseLabelAlpha > 0.01;
          }
          if (sunMesh) sunMesh.material.opacity = 1.0;
          if (sunGlow) sunGlow.material.opacity = 1.0;
          if (sunLight) sunLight.intensity = 8.5;
          if (sunWarmLight) sunWarmLight.intensity = 4.5;
          orbitMeshes.forEach((m) => {
            m.material.opacity = orbitAlpha;
            m.visible = true;
          });
          if (moonMeshRef) {
            moonMeshRef.material.opacity = 1.0;
            moonMeshRef.visible = true;
          }
        } else {
          // Deep space clean pinprick stars fade in; Galaxy core particles fade out to eliminate blurry bokeh
          const galFade = Math.max(0, 1.0 - eP * 2.2);
          starCloud.material.opacity = 0.92 * galFade;
          gasCloud.material.opacity = 0.12 * galFade;
          coreMarker.material.opacity = galFade;
          galaxy.visible = galFade > 0.01;
          deepSpaceMat.opacity = Math.min(0.95, eP * 2.2);

          // CONTINUOUS FLIGHT TOWARDS EARTH & REPLACING WITH EARTH GLB ON RIGHT SIDE
          const earthWorldPos = new THREE.Vector3();
          if (earthMeshRef) {
            earthMeshRef.getWorldPosition(earthWorldPos);
          } else {
            earthWorldPos.set(18.5, 0, 0);
          }

          // In Stage B, Earth is positioned on the RIGHT side (3.8).
          // In Stage C (puneFlight > 0), Earth transitions to center (0.0)!
          const rightShift = window.innerWidth < 900 ? 1.0 : 3.8;
          const currentEarthX = THREE.MathUtils.lerp(rightShift, 0.0, pP);
          const finalEarthPos = new THREE.Vector3(currentEarthX, 0, 0);

          // Camera moves towards Earth hero view, and dives close into Pune during Stage C
          const diveCamZ = THREE.MathUtils.lerp(13.0, 4.85, pP);
          const finalEarthCamPos = new THREE.Vector3(0, 0, diveCamZ);
          const finalEarthLookAt = new THREE.Vector3(currentEarthX, 0, 0);

          camera.position.lerpVectors(targetSolarCamPos, finalEarthCamPos, eP);
          const currentLook = worldSunPos.clone().lerp(finalEarthLookAt, eP);
          camera.lookAt(currentLook);

          // Position & scale authentic Earth.glb
          earthHeroGroup.position.lerpVectors(earthWorldPos, finalEarthPos, eP);
          // Stage B scales to 3.5; Stage C scales up to 4.2 zooming directly into India / Pune without clipping
          const baseHeroScale = THREE.MathUtils.lerp(0.65, 3.5, eP);
          const heroScale = THREE.MathUtils.lerp(baseHeroScale, 4.2, pP);
          earthHeroGroup.scale.setScalar(heroScale);
          earthHeroGroup.visible = eP > 0.02 && currentSolarZoom < 2.50;

          // Fade out all other solar system elements
          const otherFade = Math.max(0, 1.0 - eP * 2.2);

          if (sunMesh) sunMesh.material.opacity = otherFade;
          if (sunGlow) sunGlow.material.opacity = otherFade;
          if (sunLight) sunLight.intensity = 8.5 * otherFade;
          if (sunWarmLight) sunWarmLight.intensity = 4.5 * otherFade;
          if (sunLabelSprite) {
            sunLabelSprite.material.opacity = otherFade;
            sunLabelSprite.visible = otherFade > 0.01;
          }

          animatedPlanets.forEach((p) => {
            if (p.name === 'Earth') {
              // Crossfade small Earth into Earth GLB
              p.mesh.material.opacity = Math.max(0, 1.0 - eP * 2.0);
              p.mesh.visible = eP < 0.6;
              if (p.labelSprite) {
                p.labelSprite.material.opacity = Math.max(0, 1.0 - eP * 2.5);
                p.labelSprite.visible = p.labelSprite.material.opacity > 0.01;
              }
            } else {
              p.mesh.material.opacity = otherFade;
              p.mesh.visible = otherFade > 0.01;
              if (p.labelSprite) {
                p.labelSprite.material.opacity = otherFade;
                p.labelSprite.visible = otherFade > 0.01;
              }
            }
          });

          orbitMeshes.forEach((m) => {
            m.material.opacity = orbitAlpha * otherFade;
            m.visible = otherFade > 0.01;
          });

          if (moonMeshRef) {
            moonMeshRef.material.opacity = otherFade;
            moonMeshRef.visible = otherFade > 0.01;
          }

          solarSystemGroup.visible = eP < 0.75;
        }
      }

      // ------------------------------------------------------------
      // 6. REAL-TIME PLANETARY ORBITAL MOTION & AXIAL ROTATION
      // ------------------------------------------------------------
      if (solarSystemGroup.visible) {
        animatedPlanets.forEach((p) => {
          // Orbit around Sun (Keplerian relative speeds)
          p.angle += dt * p.speed * 0.45;
          p.mesh.position.x = p.r * Math.cos(p.angle);
          p.mesh.position.z = p.r * Math.sin(p.angle);

          // Axial spin on planet's own axis
          p.mesh.rotation.y += dt * p.rotSpeed * 0.8;

          // Billboarding name tag follows planet coordinates
          // and ALWAYS faces straight towards the user/camera!
          if (p.labelSprite) {
            p.labelSprite.position.set(
              p.mesh.position.x,
              p.mesh.position.y + p.labelOffset,
              p.mesh.position.z
            );
          }
        });
      }

      // Continuous authentic axial rotation of Earth around its 23.44° polar tilt
      continuousEarthRotY += dt * 0.35;

      if (earthSpinGroup && earthTiltGroup) {
        if (pP <= 0.001) {
          earthSpinGroup.rotation.y = continuousEarthRotY;
          earthTiltGroup.rotation.x = 0;
          earthTiltGroup.rotation.z = 23.44 * DEG;
          if (puneMarkerGroup) {
            puneMarkerGroup.visible = false;
            dotMat.opacity = 0;
            ringMat.opacity = 0;
            puneHudSprite.material.opacity = 0;
          }
        } else {
          // Stage C: Align Pune, India directly to camera
          const rotY = -160.81 * DEG;
          const rotX = 42.14 * DEG;

          const diffY = THREE.MathUtils.euclideanModulo(rotY - continuousEarthRotY + Math.PI, 2 * Math.PI) - Math.PI;
          const targetY = continuousEarthRotY + diffY;

          earthSpinGroup.rotation.y = THREE.MathUtils.lerp(continuousEarthRotY, targetY, pP);
          earthTiltGroup.rotation.x = THREE.MathUtils.lerp(0, rotX, pP);
          earthTiltGroup.rotation.z = THREE.MathUtils.lerp(23.44 * DEG, 0, pP);

          if (pP > 0.05 && earthGlbInteractionGroup) {
            earthGlbInteractionGroup.rotation.x *= (1.0 - pP * 0.08);
            earthGlbInteractionGroup.rotation.y *= (1.0 - pP * 0.08);
          }

          if (puneMarkerGroup) {
            const reticleAlpha = Math.max(0, Math.min(1.0, (pP - 0.05) / 0.25));
            puneMarkerGroup.visible = reticleAlpha > 0.01;
            dotMat.opacity = reticleAlpha;
            ringMat.opacity = reticleAlpha * 0.85;
            puneHudSprite.material.opacity = reticleAlpha;

            const ringScale = 1.0 + Math.sin(elapsed * 5.0) * 0.22;
            ringMesh.scale.setScalar(ringScale);
          }
        }
      }

      // Earth's Moon orbital motion
      if (earthMeshRef && moonMeshRef) {
        moonAngle += dt * 3.4;
        moonMeshRef.position.x = earthMeshRef.position.x + 2.5 * Math.cos(moonAngle);
        moonMeshRef.position.z = earthMeshRef.position.z + 2.5 * Math.sin(moonAngle);
      }

      // Soft breathing glow on Sun corona
      if (sunGlow) {
        const pulse = 1.0 + Math.sin(elapsed * 2.5) * 0.08;
        sunGlow.scale.setScalar(18.0 * pulse);
      }

      renderer.render(scene, camera);
    };

    animate();

    // ------------------------------------------------------------
    // 7. Interactive Click & Hover Detection for All Planets & Sun
    //    Zero-allocation scratch vectors prevent GC freeze pauses during mouse movement
    // ------------------------------------------------------------
    const _scratchCamDir = new THREE.Vector3();
    const _scratchWorldPos = new THREE.Vector3();
    const _scratchDiff = new THREE.Vector3();
    const _scratchScreen = new THREE.Vector3();

    const getPlanetAtScreenPos = (clientX, clientY) => {
      if (solarZoomRef.current >= 1.15) return null;

      camera.getWorldDirection(_scratchCamDir);

      let bestTarget = null;
      let minDistancePx = 75; // Generous 75-pixel click and hover radius

      // 1. Check all 8 planets and their names FIRST
      for (let i = 0; i < animatedPlanets.length; i++) {
        const p = animatedPlanets[i];
        // Planet center in world space
        p.mesh.getWorldPosition(_scratchWorldPos);
        _scratchDiff.subVectors(_scratchWorldPos, camera.position);
        if (_scratchDiff.dot(_scratchCamDir) > 0) {
          _scratchScreen.copy(_scratchWorldPos).project(camera);
          const px = ((_scratchScreen.x + 1) / 2) * window.innerWidth;
          const py = ((-_scratchScreen.y + 1) / 2) * window.innerHeight;
          const dPlanet = Math.hypot(clientX - px, clientY - py);
          if (dPlanet < minDistancePx) {
            minDistancePx = dPlanet;
            bestTarget = p.name;
          }

          // Planet floating name label in world space
          if (p.labelSprite) {
            p.labelSprite.getWorldPosition(_scratchWorldPos);
            _scratchDiff.subVectors(_scratchWorldPos, camera.position);
            if (_scratchDiff.dot(_scratchCamDir) > 0) {
              _scratchScreen.copy(_scratchWorldPos).project(camera);
              const lx = ((_scratchScreen.x + 1) / 2) * window.innerWidth;
              const ly = ((-_scratchScreen.y + 1) / 2) * window.innerHeight;
              const dLabel = Math.hypot(clientX - lx, clientY - ly);
              if (dLabel < minDistancePx) {
                minDistancePx = dLabel;
                bestTarget = p.name;
              }
            }
          }
        }
      }

      // 2. Check Sun if click is not closer to any planet
      sunMesh.getWorldPosition(_scratchWorldPos);
      _scratchDiff.subVectors(_scratchWorldPos, camera.position);
      if (_scratchDiff.dot(_scratchCamDir) > 0) {
        _scratchScreen.copy(_scratchWorldPos).project(camera);
        const sx = ((_scratchScreen.x + 1) / 2) * window.innerWidth;
        const sy = ((-_scratchScreen.y + 1) / 2) * window.innerHeight;
        const dSun = Math.hypot(clientX - sx, clientY - sy);
        if (dSun < Math.min(minDistancePx, 48)) {
          minDistancePx = dSun;
          bestTarget = 'Sun';
        }
      }

      return bestTarget;
    };

    const onCanvasClick = (e) => {
      // Ignore clicks on official header (y < 72)
      if (e.clientY < 72) return;
      // If clicking inside the planet showcase panel itself, ignore
      if (e.target && e.target.closest && e.target.closest('.planet-showcase-card')) return;

      const target = getPlanetAtScreenPos(e.clientX, e.clientY);
      if (target && onSelectPlanetRef.current) {
        onSelectPlanetRef.current(target);
      }
    };

    let pointerMoveRaf = null;
    let pendingPointerX = 0;
    let pendingPointerY = 0;

    const onPointerMove = (e) => {
      if (currentSolarZoom < 0.15 || e.clientY < 72) {
        renderer.domElement.style.cursor = 'default';
        return;
      }
      if (e.target && e.target.closest && e.target.closest('.planet-showcase-card')) {
        renderer.domElement.style.cursor = 'default';
        return;
      }

      pendingPointerX = e.clientX;
      pendingPointerY = e.clientY;
      if (!pointerMoveRaf) {
        pointerMoveRaf = requestAnimationFrame(() => {
          const target = getPlanetAtScreenPos(pendingPointerX, pendingPointerY);
          renderer.domElement.style.cursor = target ? 'pointer' : 'default';
          pointerMoveRaf = null;
        });
      }
    };

    // ------------------------------------------------------------
    // 8. Earth 3D Interactive Manual Drag Rotation (Stage 6)
    // ------------------------------------------------------------
    let isDraggingEarth = false;
    let prevPointerX = 0;
    let prevPointerY = 0;

    const onEarthPointerDown = (e) => {
      if (currentSolarZoom < 0.90 || currentSolarZoom > 1.85) return;
      if (e.target && e.target.closest && e.target.closest('.earth-hero-stage')) {
        return;
      }
      isDraggingEarth = true;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
      renderer.domElement.style.cursor = 'grabbing';
    };

    const onEarthPointerMove = (e) => {
      if (currentSolarZoom < 0.90 || currentSolarZoom > 1.85) return;
      if (!isDraggingEarth) {
        if (e.clientX > window.innerWidth * 0.35) {
          renderer.domElement.style.cursor = 'grab';
        } else {
          renderer.domElement.style.cursor = 'default';
        }
        return;
      }
      const dx = e.clientX - prevPointerX;
      const dy = e.clientY - prevPointerY;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;

      if (earthGlbInteractionGroup) {
        earthGlbInteractionGroup.rotation.y += dx * 0.010;
        earthGlbInteractionGroup.rotation.x += dy * 0.008;
      }
    };

    const onEarthPointerUp = () => {
      isDraggingEarth = false;
      if (currentSolarZoom >= 0.90 && currentSolarZoom <= 1.85) {
        renderer.domElement.style.cursor = 'grab';
      } else {
        renderer.domElement.style.cursor = 'default';
      }
    };

    window.addEventListener('pointerdown', onEarthPointerDown);
    window.addEventListener('pointermove', onEarthPointerMove);
    window.addEventListener('pointerup', onEarthPointerUp);

    window.addEventListener('click', onCanvasClick);
    window.addEventListener('pointermove', onPointerMove);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      if (pointerMoveRaf) cancelAnimationFrame(pointerMoveRaf);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', onCanvasClick);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onEarthPointerDown);
      window.removeEventListener('pointermove', onEarthPointerMove);
      window.removeEventListener('pointerup', onEarthPointerUp);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="milkyway-galaxy-canvas-container"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        overflow: 'hidden'
      }}
    />
  );
}
