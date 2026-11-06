import React, { useRef, useState, useEffect } from 'react';
import { Pencil, Eraser, Trash2, Heart, Download, Palette } from 'lucide-react';

interface DoodleCanvasProps {
  currentPartnerName: string;
  onSave?: (dataUrl: string) => void;
}

export const DoodleCanvas: React.FC<DoodleCanvasProps> = ({ currentPartnerName, onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ff7597');
  const [brushSize, setBrushSize] = useState(4);
  const [mode, setMode] = useState<'draw' | 'erase'>('draw');

  const colors = [
    '#ff7597', // Koi Pink
    '#ff4d6d', // Rose
    '#c084fc', // Lavender
    '#38bdf8', // Starlight Sky
    '#fef08a', // Moon Yellow
    '#ffffff', // Pure Star
    '#4ade80', // Mint
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Default romantic warm dark background
    ctx.fillStyle = '#111322';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Initial romantic prompt doodle
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 2;
    ctx.font = '20px Caveat, cursive';
    ctx.fillStyle = '#fda4af';
    ctx.fillText('✨ Draw a heart or write a sweet note here together... ✨', 40, 50);

    // Cute initial heart
    drawHeart(ctx, 320, 160, 24, '#ff7597');
  }, []);

  const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, fill: string) => {
    ctx.save();
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-size / 2, -size / 2, -size, size / 3, 0, size);
    ctx.bezierCurveTo(size, size / 3, size / 2, -size / 2, 0, 0);
    ctx.fillStyle = fill;
    ctx.shadowColor = fill;
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.restore();
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (mode === 'erase') {
      ctx.strokeStyle = '#111322';
      ctx.lineWidth = brushSize * 4;
      ctx.shadowBlur = 0;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#111322';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const addQuickHeart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rx = 100 + Math.random() * (canvas.width - 200);
    const ry = 80 + Math.random() * (canvas.height - 160);
    drawHeart(ctx, rx, ry, 20 + Math.random() * 15, color);
  };

  const downloadArtwork = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `thanuverse-doodle-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    if (onSave) onSave(canvas.toDataURL());
  };

  return (
    <div className="flex flex-col items-center bg-slate-900/80 border border-pink-500/30 rounded-2xl p-4 backdrop-blur-md shadow-2xl">
      <div className="flex flex-wrap items-center justify-between w-full pb-3 border-b border-pink-500/20 gap-3">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-pink-400" />
          <span className="font-medium text-pink-200 text-sm">
            Doodling as <strong className="text-white">{currentPartnerName}</strong>
          </span>
        </div>

        {/* Color Palette */}
        <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-pink-500/20">
          {colors.map(c => (
            <button
              key={c}
              onClick={() => { setColor(c); setMode('draw'); }}
              className={`w-6 h-6 rounded-full transition-transform ${color === c && mode === 'draw' ? 'scale-125 ring-2 ring-white shadow-lg' : 'hover:scale-110'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        {/* Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('draw')}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1 ${mode === 'draw' ? 'bg-pink-500/30 border-pink-400 text-pink-100' : 'bg-slate-800/60 border-slate-700 text-slate-300'}`}
          >
            <Pencil className="w-4 h-4" /> Draw
          </button>
          <button
            onClick={() => setMode('erase')}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1 ${mode === 'erase' ? 'bg-pink-500/30 border-pink-400 text-pink-100' : 'bg-slate-800/60 border-slate-700 text-slate-300'}`}
          >
            <Eraser className="w-4 h-4" /> Erase
          </button>
          <button
            onClick={addQuickHeart}
            className="p-2 rounded-lg bg-pink-600/40 hover:bg-pink-600/60 border border-pink-400/40 text-pink-200 text-xs flex items-center gap-1"
            title="Stamp a glowing heart"
          >
            <Heart className="w-4 h-4 fill-pink-400 text-pink-400" /> Heart
          </button>
          <button
            onClick={clearCanvas}
            className="p-2 rounded-lg bg-slate-800/60 hover:bg-red-500/20 border border-slate-700 text-slate-400 hover:text-red-300 text-xs"
            title="Clear"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={downloadArtwork}
            className="p-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs flex items-center gap-1 shadow-lg"
            title="Save to Memories"
          >
            <Download className="w-4 h-4" /> Save
          </button>
        </div>
      </div>

      <div className="relative mt-3 rounded-xl overflow-hidden border border-purple-500/30 shadow-inner">
        <canvas
          ref={canvasRef}
          width={640}
          height={380}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="cursor-crosshair bg-[#111322] block max-w-full"
        />
      </div>

      <div className="w-full flex items-center justify-between mt-3 text-xs text-slate-400 px-2">
        <span>Draw together in real-time • Both partners share this canvas</span>
        <div className="flex items-center gap-2">
          <span>Brush Size:</span>
          <input
            type="range"
            min="1"
            max="16"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-24 accent-pink-500"
          />
        </div>
      </div>
    </div>
  );
};
