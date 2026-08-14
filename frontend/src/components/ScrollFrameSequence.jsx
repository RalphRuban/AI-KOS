import React, { useEffect, useRef, useState } from 'react';

export default function ScrollFrameSequence({ 
  totalFrames = 101, 
  framePrefix = 'ezgif-frame-', 
  frameExtension = '.jpg',
  opacity = 0.95 
}) {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);

  // Preload video frame image sequence
  useEffect(() => {
    const loadedImages = [];
    let isMounted = true;

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const paddedIndex = String(i).padStart(3, '0');
      img.src = `/frames/${framePrefix}${paddedIndex}${frameExtension}`;
      img.onload = () => {
        if (isMounted) setImages([...loadedImages]);
      };
      loadedImages.push(img);
    }
    setImages(loadedImages);

    return () => {
      isMounted = false;
    };
  }, [totalFrames, framePrefix, frameExtension]);

  // Handle Canvas Render on Page Scroll
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let currentFrameIndex = 0;
    let targetFrameIndex = 0;

    // Full viewport canvas sizing
    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Track full page scroll progress
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const scrollFraction = Math.min(1, Math.max(0, scrollY / maxScroll));
      targetFrameIndex = scrollFraction * (totalFrames - 1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger initial scroll calculation
    handleScroll();

    // Render loop with ultra-smooth lerp frame interpolation
    const render = () => {
      // Ultra-smooth lerp (0.08 coefficient for silky smooth response)
      currentFrameIndex += (targetFrameIndex - currentFrameIndex) * 0.08;
      
      const frameToDraw = Math.min(
        totalFrames - 1,
        Math.max(0, Math.round(currentFrameIndex))
      );

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const img = images[frameToDraw];
      if (img && img.complete && img.naturalWidth > 0) {
        // High quality aspect ratio cover math
        const scale = Math.max(
          canvas.width / img.naturalWidth,
          canvas.height / img.naturalHeight
        );
        const x = (canvas.width - img.naturalWidth * scale) / 2;
        const y = (canvas.height - img.naturalHeight * scale) / 2;

        ctx.save();
        ctx.globalAlpha = opacity;
        
        // Draw crisp frame
        ctx.drawImage(
          img,
          x,
          y,
          img.naturalWidth * scale,
          img.naturalHeight * scale
        );

        // Subtle peripheral dark vignette to keep text highly legible
        const vignette = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          Math.min(canvas.width, canvas.height) * 0.35,
          canvas.width / 2,
          canvas.height / 2,
          Math.max(canvas.width, canvas.height) * 0.8
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

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [images, totalFrames, opacity]);

  return (
    <div className="fixed inset-0 w-vw h-vh pointer-events-none z-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
}



