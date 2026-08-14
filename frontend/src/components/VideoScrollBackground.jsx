import React, { useEffect, useRef, useState } from 'react';

export default function VideoScrollBackground() {
  const canvasRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });

    const video = document.createElement('video');
    video.src = '/bg_video.mp4';
    video.playsInline = true;
    video.muted = true;
    video.preload = 'auto';

    let animationFrameId;
    let targetProgress = 0;
    let currentProgress = 0;
    let isSeeking = false;

    // Handle high DPI crisp canvas sizing
    const updateSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // Precise scroll progress calculation
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
      targetProgress = progress;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Render loop with smooth easing dampening
    const render = () => {
      currentProgress += (targetProgress - currentProgress) * 0.05;

      if (video.duration && video.readyState >= 2) {
        const targetTime = currentProgress * video.duration;

        if (Math.abs(video.currentTime - targetTime) > 0.03 && !isSeeking) {
          isSeeking = true;
          video.currentTime = targetTime;
        }

        const scale = Math.max(
          canvas.width / (video.videoWidth || 1920),
          canvas.height / (video.videoHeight || 1080)
        );
        const vw = (video.videoWidth || 1920) * scale;
        const vh = (video.videoHeight || 1080) * scale;
        const vx = (canvas.width - vw) / 2;
        const vy = (canvas.height - vh) / 2;

        ctx.save();
        ctx.drawImage(video, vx, vy, vw, vh);

        const vignette = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          Math.min(canvas.width, canvas.height) * 0.35,
          canvas.width / 2,
          canvas.height / 2,
          Math.max(canvas.width, canvas.height) * 0.75
        );
        vignette.addColorStop(0, 'rgba(2, 5, 16, 0.1)');
        vignette.addColorStop(0.65, 'rgba(2, 5, 16, 0.5)');
        vignette.addColorStop(1, 'rgba(2, 5, 16, 0.92)');

        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    video.onseeked = () => {
      isSeeking = false;
    };

    video.onloadedmetadata = () => {
      render();
    };

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('scroll', handleScroll);
      video.onseeked = null;
      video.onloadedmetadata = null;
    };
  }, []);

  // Compute blur amount: 4px blur across content sections, smooth fade out to 0px at the last section (> 82% scroll)
  const isLastSection = scrollProgress > 0.82;
  const blurAmount = isLastSection 
    ? Math.max(0, (1 - (scrollProgress - 0.82) / 0.18) * 4) 
    : 4;

  return (
    <div className="fixed inset-0 w-vw h-vh pointer-events-none z-0 overflow-hidden bg-slate-950">
      <canvas
        ref={canvasRef}
        className="w-full h-full block transition-all duration-300 ease-out"
        style={{
          filter: `blur(${blurAmount}px) brightness(95%) contrast(110%) saturate(110%)`,
          transform: 'scale(1.02)'
        }}
      />
    </div>
  );
}

