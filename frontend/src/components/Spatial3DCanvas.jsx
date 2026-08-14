import React, { useEffect, useRef } from 'react';

export default function Spatial3DCanvas({ interactive = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // 1. Dynamic 3D Particle Swarm (Quantum Galaxy Lattice)
    const particleCount = 120;
    const particles = Array.from({ length: particleCount }, () => {
      const distance = Math.random() * 160 + 30;
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1);

      return {
        distance,
        angle,
        speed,
        z: (Math.random() - 0.5) * 300,
        size: Math.random() * 2.8 + 1,
        color: Math.random() > 0.4 ? 'rgba(56, 189, 248, ' : 'rgba(129, 140, 248, ',
        pulseOffset: Math.random() * Math.PI * 2,
      };
    });

    // Mouse Interaction Vector
    let targetMouseX = width * 0.75;
    let targetMouseY = height * 0.5;
    let mouseX = width * 0.75;
    let mouseY = height * 0.5;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.015;

      // Smooth inertia mouse tracking
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

      const isMobile = width < 768;
      const coreX = isMobile ? width * 0.5 : width * 0.78;
      const coreY = height * 0.5;
      const baseRadius = Math.min(width, height) * (isMobile ? 0.28 : 0.22);

      // 2. Central Pulsar Energy Core
      const coreGlowRadius = baseRadius * (0.8 + Math.sin(time * 3) * 0.08);
      const coreGrad = ctx.createRadialGradient(
        coreX,
        coreY,
        0,
        coreX,
        coreY,
        coreGlowRadius * 1.5
      );
      coreGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      coreGrad.addColorStop(0.2, 'rgba(56, 189, 248, 0.9)');
      coreGrad.addColorStop(0.5, 'rgba(37, 99, 235, 0.5)');
      coreGrad.addColorStop(0.8, 'rgba(129, 140, 248, 0.2)');
      coreGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');

      ctx.beginPath();
      ctx.arc(coreX, coreY, coreGlowRadius * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // 3. Multi-Axis Holographic Orbital Rings
      const renderOrbitalRing = (rotAngle, rx, ry, color, lineWidth = 2, dash = []) => {
        ctx.save();
        ctx.translate(coreX, coreY);
        ctx.rotate(rotAngle);
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        if (dash.length) ctx.setLineDash(dash);
        ctx.stroke();
        ctx.restore();
      };

      // Ring 1 (Cyan Fast Orbit)
      renderOrbitalRing(time * 0.8, baseRadius * 1.6, baseRadius * 0.55, 'rgba(34, 211, 238, 0.65)', 2);

      // Ring 2 (Indigo Reverse Orbit)
      renderOrbitalRing(-time * 0.6 + Math.PI / 4, baseRadius * 1.35, baseRadius * 0.45, 'rgba(129, 140, 248, 0.55)', 1.5, [6, 6]);

      // Ring 3 (Bright Blue Tilt Orbit)
      renderOrbitalRing(time * 0.4 - Math.PI / 3, baseRadius * 1.8, baseRadius * 0.7, 'rgba(56, 189, 248, 0.45)', 1);

      // 4. Render Dynamic Swarm Particles with Mouse Forcefield Physics
      const renderedParticles = [];

      particles.forEach((p) => {
        p.angle += p.speed;

        // Calculate 3D position relative to core
        const x3d = Math.cos(p.angle) * p.distance;
        const y3d = Math.sin(p.angle) * (p.distance * 0.4);
        const z3d = p.z + Math.sin(time + p.angle) * 30;

        // Perspective Projection
        const scale = 350 / (350 + z3d);
        let px = coreX + x3d * scale;
        let py = coreY + y3d * scale;

        // Interactive Mouse Gravitational Forcefield
        const dx = mouseX - px;
        const dy = mouseY - py;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        if (distToMouse < 150) {
          const force = (1 - distToMouse / 150) * 20;
          px -= (dx / distToMouse) * force;
          py -= (dy / distToMouse) * force;
        }

        const alpha = Math.max(0.2, (z3d + 150) / 300) * (0.6 + Math.sin(time * 4 + p.pulseOffset) * 0.4);
        const currentSize = p.size * scale;

        renderedParticles.push({ px, py, scale, z: z3d, alpha, currentSize, color: p.color });
      });

      // Sort for 3D depth rendering
      renderedParticles.sort((a, b) => b.z - a.z);

      // Render Connection Lines between close particles
      for (let i = 0; i < renderedParticles.length; i++) {
        for (let j = i + 1; j < renderedParticles.length; j++) {
          const p1 = renderedParticles[i];
          const p2 = renderedParticles[j];
          const dx = p1.px - p2.px;
          const dy = p1.py - p2.py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 65) {
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            const lineAlpha = (1 - dist / 65) * 0.25 * Math.min(p1.alpha, p2.alpha);
            ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Render Individual Swarm Nodes with Glowing Aura
      renderedParticles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.px, p.py, p.currentSize, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();

        if (p.z > 0) {
          ctx.beginPath();
          ctx.arc(p.px, p.py, p.currentSize * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${p.alpha * 0.3})`;
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (interactive) window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [interactive]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-95"
    />
  );
}



