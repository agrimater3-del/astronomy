import React, { useEffect, useRef } from 'react';

export default function CosmicBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };
    window.addEventListener('resize', handleResize);

    // Star collection
    let stars = [];
    const STAR_COUNT = 320;

    const initStars = () => {
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.8 + 0.4,
          baseAlpha: Math.random() * 0.7 + 0.3,
          alpha: Math.random() * 0.7 + 0.3,
          twinkleSpeed: Math.random() * 0.03 + 0.008,
          phase: Math.random() * Math.PI * 2,
          color: Math.random() > 0.8 ? '#93c5fd' : (Math.random() > 0.6 ? '#fde047' : '#ffffff')
        });
      }
    };
    initStars();

    // Shooting stars
    const meteors = [];
    const maybeSpawnMeteor = () => {
      if (Math.random() < 0.015 && meteors.length < 3) {
        meteors.push({
          x: Math.random() * width * 0.8,
          y: Math.random() * height * 0.4,
          len: Math.random() * 100 + 60,
          speed: Math.random() * 10 + 12,
          angle: (Math.PI / 4) + (Math.random() - 0.5) * 0.2,
          alpha: 1.0,
          decay: Math.random() * 0.02 + 0.015
        });
      }
    };

    let animId;
    let t = 0;

    const render = () => {
      t += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Deep space nebula radial gradients
      const grad1 = ctx.createRadialGradient(
        width * 0.2, height * 0.3, 50,
        width * 0.2, height * 0.3, width * 0.5
      );
      grad1.addColorStop(0, 'rgba(30, 27, 75, 0.4)');
      grad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const grad2 = ctx.createRadialGradient(
        width * 0.8, height * 0.7, 50,
        width * 0.8, height * 0.7, width * 0.6
      );
      grad2.addColorStop(0, 'rgba(15, 23, 42, 0.45)');
      grad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Render stars
      for (const s of stars) {
        s.alpha = s.baseAlpha + Math.sin(t * s.twinkleSpeed * 10 + s.phase) * 0.3;
        ctx.fillStyle = s.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, s.alpha));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Meteors / Shooting stars
      maybeSpawnMeteor();
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;
        m.alpha -= m.decay;

        if (m.alpha <= 0 || m.x > width || m.y > height) {
          meteors.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.strokeStyle = `rgba(255, 255, 255, ${m.alpha})`;
        ctx.lineWidth = 1.6;
        ctx.shadowColor = '#60a5fa';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(
          m.x - Math.cos(m.angle) * m.len,
          m.y - Math.sin(m.angle) * m.len
        );
        ctx.stroke();
        ctx.restore();
      }

      ctx.globalAlpha = 1.0;
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="cosmic-bg-canvas" />;
}
