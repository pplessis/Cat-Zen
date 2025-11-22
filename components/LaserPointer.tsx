import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Settings } from 'lucide-react';

const LaserPointer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(5);
  
  // Ref to store mutable animation state
  const stateRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    targetX: 0,
    targetY: 0,
    radius: 15,
    lastTime: 0
  });

  const animationFrameRef = useRef<number>();

  const initLaser = () => {
    if (canvasRef.current) {
      const { width, height } = canvasRef.current;
      stateRef.current.x = width / 2;
      stateRef.current.y = height / 2;
      pickNewTarget(width, height);
    }
  };

  const pickNewTarget = (w: number, h: number) => {
    // Padding to keep dot somewhat within bounds
    const padding = 50;
    stateRef.current.targetX = padding + Math.random() * (w - padding * 2);
    stateRef.current.targetY = padding + Math.random() * (h - padding * 2);
  };

  const update = (time: number) => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvasRef.current;
    const state = stateRef.current;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Calculate movement towards target
    const dx = state.targetX - state.x;
    const dy = state.targetY - state.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // If close to target, pick a new one
    if (distance < 20) {
      pickNewTarget(width, height);
    }

    // Move logic (smooth pursuit)
    // Use current speed setting
    const moveSpeed = speed * (distance > 100 ? 1.5 : 0.8); // Accelerate if far
    
    const angle = Math.atan2(dy, dx);
    state.vx = Math.cos(angle) * moveSpeed;
    state.vy = Math.sin(angle) * moveSpeed;

    // Add some jitter/wobble to make it look organic (like a human hand)
    state.vx += (Math.random() - 0.5) * 2;
    state.vy += (Math.random() - 0.5) * 2;

    state.x += state.vx;
    state.y += state.vy;

    // Boundary checks
    if (state.x < state.radius) state.x = state.radius;
    if (state.x > width - state.radius) state.x = width - state.radius;
    if (state.y < state.radius) state.y = state.radius;
    if (state.y > height - state.radius) state.y = height - state.radius;

    // Draw Laser Dot
    // Outer glow
    const gradient = ctx.createRadialGradient(state.x, state.y, 0, state.x, state.y, state.radius * 2);
    gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
    gradient.addColorStop(0.5, 'rgba(255, 0, 0, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(state.x, state.y, state.radius * 2, 0, Math.PI * 2);
    ctx.fill();

    // Inner core
    ctx.fillStyle = '#ffcccc';
    ctx.beginPath();
    ctx.arc(state.x, state.y, state.radius * 0.3, 0, Math.PI * 2);
    ctx.fill();

    if (isRunning) {
      animationFrameRef.current = requestAnimationFrame(update);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight - 100; // Leave space for dock
        initLaser();
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isRunning) {
      animationFrameRef.current = requestAnimationFrame(update);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, speed]);

  return (
    <div className="relative w-full h-full bg-black flex flex-col items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="cursor-none" />
      
      {/* Controls Overlay */}
      <div className="absolute top-4 right-4 flex gap-2 bg-mac-window/80 backdrop-blur-md p-2 rounded-full border border-white/10 transition-opacity duration-500 hover:opacity-100 opacity-30">
        <button 
          onClick={() => setIsRunning(!isRunning)}
          className={`p-3 rounded-full transition-colors ${isRunning ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}
        >
          {isRunning ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
        </button>
        
        <div className="flex items-center gap-2 px-2 border-l border-white/10">
          <Settings size={16} className="text-gray-400" />
          <input 
            type="range" 
            min="1" 
            max="15" 
            value={speed} 
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-24 accent-red-500"
          />
        </div>
      </div>
      
      {!isRunning && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/50 backdrop-blur-sm p-6 rounded-2xl border border-white/10 text-center">
            <h2 className="text-2xl font-bold mb-2">Mode Chasse Laser</h2>
            <p className="text-gray-400">Appuyez sur Play pour activer le point rouge.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaserPointer;
