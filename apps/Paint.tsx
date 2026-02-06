
import React, { useRef, useState, useEffect, useCallback } from 'react';

type Tool = 'pencil' | 'brush' | 'eraser' | 'bucket' | 'picker' | 'text';

export const Paint: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [secondaryColor, setSecondaryColor] = useState('#FFFFFF');
  const [tool, setTool] = useState<Tool>('pencil');
  const [brushSize, setBrushSize] = useState(2);

  // Load persistence
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Fill white background first
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const saved = localStorage.getItem('xp_paint_autosave');
    if (saved) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = saved;
    }
  }, []);

  const saveToStorage = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      localStorage.setItem('xp_paint_autosave', canvas.toDataURL());
    }
  }, []);

  const getPos = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const floodFill = (startX: number, startY: number, fillColor: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const targetR = data[(startY * canvas.width + startX) * 4];
    const targetG = data[(startY * canvas.width + startX) * 4 + 1];
    const targetB = data[(startY * canvas.width + startX) * 4 + 2];

    const fillR = parseInt(fillColor.slice(1, 3), 16);
    const fillG = parseInt(fillColor.slice(3, 5), 16);
    const fillB = parseInt(fillColor.slice(5, 7), 16);

    if (targetR === fillR && targetG === fillG && targetB === fillB) return;

    const stack: [number, number][] = [[startX, startY]];
    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;
      
      const pos = (y * canvas.width + x) * 4;
      if (data[pos] !== targetR || data[pos + 1] !== targetG || data[pos + 2] !== targetB) continue;

      data[pos] = fillR;
      data[pos + 1] = fillG;
      data[pos + 2] = fillB;
      data[pos + 3] = 255;

      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
    ctx.putImageData(imageData, 0, 0);
    saveToStorage();
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const { x, y } = getPos(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    if (tool === 'picker') {
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`;
      setColor(hex);
      setTool('pencil');
      return;
    }

    if (tool === 'bucket') {
      floodFill(Math.floor(x), Math.floor(y), color);
      return;
    }

    if (tool === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        ctx.font = `${brushSize * 5 + 10}px Tahoma`;
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
        saveToStorage();
      }
      return;
    }

    setIsDrawing(true);
    canvas.setPointerCapture(e.pointerId);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = tool === 'eraser' ? brushSize * 10 : brushSize * 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    const { x, y } = getPos(e);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDrawing) {
      setIsDrawing(false);
      canvasRef.current?.releasePointerCapture(e.pointerId);
      saveToStorage();
    }
  };

  const handleNew = () => {
    if (!confirm('Discard current drawing?')) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      localStorage.removeItem('xp_paint_autosave');
    }
  };

  const handleSave = (asName?: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const name = asName ? prompt('Save as:', 'untitled.png') : 'untitled.png';
    if (!name) return;
    const link = document.createElement('a');
    link.download = name.endsWith('.png') ? name : `${name}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const tools = [
    { id: 'pencil', icon: 'https://win98icons.alexmeub.com/icons/png/paint_pencil-0.png', label: 'Pencil' },
    { id: 'brush', icon: 'https://win98icons.alexmeub.com/icons/png/paint_brush-0.png', label: 'Brush' },
    { id: 'eraser', icon: 'https://win98icons.alexmeub.com/icons/png/paint_eraser-0.png', label: 'Eraser' },
    { id: 'bucket', icon: 'https://win98icons.alexmeub.com/icons/png/paint_bucket-0.png', label: 'Fill' },
    { id: 'picker', icon: 'https://win98icons.alexmeub.com/icons/png/paint_color_picker-0.png', label: 'Pick' },
    { id: 'text', icon: 'https://win98icons.alexmeub.com/icons/png/paint_text-0.png', label: 'Text' },
  ];

  const colors = [
    '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080', '#808040', '#004040', '#0080FF', '#004080', '#4000FF', '#804000',
    '#FFFFFF', '#C0C0C0', '#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF', '#FFFF80', '#00FF80', '#80FFFF', '#8080FF', '#FF0080', '#FF8040'
  ];

  return (
    <div className="flex flex-col h-full bg-[#ece9d8] select-none touch-none">
      <div className="flex gap-3 px-2 py-0.5 text-[11px] bg-[#ece9d8] border-b border-gray-400">
        <span className="px-1 hover:bg-[#0A246A] hover:text-white cursor-default">File</span>
        <span className="px-1 hover:bg-[#0A246A] hover:text-white cursor-default">Edit</span>
        <span className="px-1 hover:bg-[#0A246A] hover:text-white cursor-default">View</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-14 bg-[#ece9d8] border-r border-gray-400 p-1 flex flex-wrap content-start gap-px shadow-inner">
          {tools.map(t => (
            <button
              key={t.id}
              onClick={() => setTool(t.id as Tool)}
              className={`w-6 h-6 border flex items-center justify-center ${
                tool === t.id ? 'bg-white border-gray-600 shadow-inner' : 'bg-[#ece9d8] border-gray-100 border-b-gray-600 border-r-gray-600 active:bg-gray-200'
              }`}
            >
              <img src={t.icon} className="w-4 h-4" alt={t.label} />
            </button>
          ))}
          <div className="w-full mt-4 flex flex-col items-center gap-1">
             <input type="range" min="1" max="15" value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))} className="w-10 h-1 accent-blue-600" />
             <div className="w-6 h-6 border border-gray-400 bg-white flex items-center justify-center mt-1">
                <div style={{ width: brushSize, height: brushSize, backgroundColor: color, borderRadius: '50%' }}></div>
             </div>
          </div>
        </div>

        <div className="flex-1 bg-[#808080] p-4 flex items-start justify-start overflow-auto xp-scrollbar">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="bg-white shadow-[2px_2px_10px_rgba(0,0,0,0.5)] cursor-crosshair touch-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          />
        </div>
      </div>

      <div className="bg-[#ece9d8] border-t border-gray-400 p-1.5 flex items-center gap-4 h-14">
        <div className="w-10 h-10 border-2 border-inset border-gray-600 bg-white flex items-center justify-center relative">
          <div className="absolute top-1 left-1 w-5 h-5 border border-black z-10" style={{ backgroundColor: color }}></div>
          <div className="absolute bottom-1 right-1 w-5 h-5 border border-black z-0" style={{ backgroundColor: secondaryColor }}></div>
        </div>
        <div className="flex flex-wrap gap-px h-full w-[280px]">
          {colors.map(c => (
            <div key={c} className="w-4 h-4 border border-gray-500 cursor-pointer" style={{ backgroundColor: c }} onPointerDown={() => setColor(c)} />
          ))}
        </div>
      </div>
    </div>
  );
};
