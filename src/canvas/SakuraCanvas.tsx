import React, { useEffect, useRef } from 'react';

interface SakuraCanvasProps {
  weather?: 'sakura' | 'rain' | 'snow' | 'stars';
  intensity?: 'gentle' | 'normal' | 'dreamy';
}

export const SakuraCanvas: React.FC<SakuraCanvasProps> = ({
  weather = 'sakura',
  intensity = 'normal'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Petal particles
    const petalCount = intensity === 'gentle' ? 25 : intensity === 'dreamy' ? 65 : 42;
    const petals: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      rotation: number;
      rotSpeed: number;
      flip: number;
      flipSpeed: number;
      opacity: number;
      color: string;
    }> = [];

    const colors = [
      'rgba(255, 183, 197, ', // Classic cherry blossom pink
      'rgba(255, 209, 220, ', // Pastel sakura
      'rgba(255, 154, 178, ', // Deeper romantic rose
      'rgba(244, 187, 211, '  // Lavender pink
    ];

    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 7 + Math.random() * 8,
        speedX: 0.8 + Math.random() * 1.5,
        speedY: 1.0 + Math.random() * 1.8,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        flip: Math.random() * Math.PI,
        flipSpeed: 0.02 + Math.random() * 0.03,
        opacity: 0.4 + Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    // Twinkling stars
    const stars: Array<{ x: number; y: number; r: number; alpha: number; speed: number }> = [];
    for (let i = 0; i < 70; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.7,
        r: Math.random() * 1.6 + 0.4,
        alpha: Math.random(),
        speed: 0.005 + Math.random() * 0.015
      });
    }

    // Meteors
    let meteor: { x: number; y: number; length: number; speed: number; angle: number; alpha: number } | null = null;
    let meteorCooldown = 150;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render stars
      stars.forEach(star => {
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0.2) star.speed = -star.speed;
        ctx.fillStyle = `rgba(240, 240, 255, ${Math.max(0.1, star.alpha * 0.8)})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render shooting star
      if (meteor) {
        ctx.save();
        const endX = meteor.x - Math.cos(meteor.angle) * meteor.length;
        const endY = meteor.y - Math.sin(meteor.angle) * meteor.length;
        const grad = ctx.createLinearGradient(meteor.x, meteor.y, endX, endY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${meteor.alpha})`);
        grad.addColorStop(0.4, `rgba(216, 180, 254, ${meteor.alpha * 0.7})`);
        grad.addColorStop(1, 'rgba(192, 132, 252, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.restore();

        meteor.x += Math.cos(meteor.angle) * meteor.speed;
        meteor.y += Math.sin(meteor.angle) * meteor.speed;
        meteor.alpha -= 0.015;

        if (meteor.alpha <= 0 || meteor.x > width || meteor.y > height) {
          meteor = null;
          meteorCooldown = 200 + Math.floor(Math.random() * 300);
        }
      } else {
        meteorCooldown--;
        if (meteorCooldown <= 0) {
          meteor = {
            x: Math.random() * width * 0.7,
            y: Math.random() * height * 0.3,
            length: 80 + Math.random() * 70,
            speed: 12 + Math.random() * 8,
            angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
            alpha: 1.0
          };
        }
      }

      // Render Petals / Weather
      if (weather === 'sakura' || weather === 'stars') {
        petals.forEach(p => {
          p.x += p.speedX + Math.sin(p.flip) * 0.8;
          p.y += p.speedY;
          p.rotation += p.rotSpeed;
          p.flip += p.flipSpeed;

          if (p.y > height + 20) {
            p.y = -20;
            p.x = Math.random() * width;
          }
          if (p.x > width + 20) {
            p.x = -20;
          }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.scale(Math.sin(p.flip), 1);

          ctx.fillStyle = `${p.color}${p.opacity})`;
          ctx.beginPath();
          // Natural curved sakura petal shape
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(p.size / 2, -p.size / 2, p.size, -p.size / 3, p.size, p.size / 2);
          ctx.bezierCurveTo(p.size, p.size, 0, p.size * 1.4, 0, 0);
          ctx.fill();

          ctx.restore();
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [weather, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-10 w-full h-full"
      style={{ opacity: 0.9 }}
    />
  );
};
