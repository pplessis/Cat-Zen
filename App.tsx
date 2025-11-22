import React, { useState } from 'react';
import { Cat, Crosshair, Music, MessageCircle } from 'lucide-react';
import LaserPointer from './components/LaserPointer';
import SoundBoard from './components/SoundBoard';
import ZenSage from './components/ZenSage';
import { AppMode } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);

  const renderContent = () => {
    switch (mode) {
      case AppMode.LASER:
        return <LaserPointer />;
      case AppMode.SOUNDS:
        return <SoundBoard />;
      case AppMode.ZEN_SAGE:
        return <ZenSage />;
      case AppMode.HOME:
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gradient-to-br from-gray-900 to-black">
            <div className="mb-8 p-8 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl animate-pulse">
               <Cat size={120} className="text-gray-200" strokeWidth={0.5} />
            </div>
            <h1 className="text-5xl font-thin text-white mb-4 tracking-widest">CHAT ZEN</h1>
            <p className="text-gray-400 text-lg max-w-md font-light">
              L'expérience ultime de relaxation pour votre félin sur macOS.
            </p>
            <div className="mt-12 flex flex-wrap justify-center gap-4">
                <button 
                    onClick={() => setMode(AppMode.LASER)}
                    className="px-6 py-3 bg-red-500/20 border border-red-500/50 rounded-lg hover:bg-red-500/30 text-red-100 transition-all"
                >
                    Jouer (Laser)
                </button>
                <button 
                    onClick={() => setMode(AppMode.SOUNDS)}
                    className="px-6 py-3 bg-blue-500/20 border border-blue-500/50 rounded-lg hover:bg-blue-500/30 text-blue-100 transition-all"
                >
                    Relaxer (Sons)
                </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen w-screen bg-black flex flex-col overflow-hidden font-sans select-none">
      
      {/* Main Content Window */}
      <main className="flex-1 relative overflow-hidden">
        {renderContent()}
      </main>

      {/* macOS Style Dock */}
      <div className="h-24 w-full flex items-center justify-center bg-transparent pb-4 pointer-events-none fixed bottom-0 z-50">
        <div className="pointer-events-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 flex gap-4 shadow-2xl transform transition-all hover:scale-105">
          
          <DockItem 
            active={mode === AppMode.HOME} 
            onClick={() => setMode(AppMode.HOME)} 
            icon={<Cat size={28} />} 
            label="Accueil" 
            color="bg-gray-500"
          />
          
          <div className="w-px h-10 bg-white/20 self-center mx-1" />

          <DockItem 
            active={mode === AppMode.LASER} 
            onClick={() => setMode(AppMode.LASER)} 
            icon={<Crosshair size={28} />} 
            label="Laser" 
            color="bg-red-500"
          />
          
          <DockItem 
            active={mode === AppMode.SOUNDS} 
            onClick={() => setMode(AppMode.SOUNDS)} 
            icon={<Music size={28} />} 
            label="Sons" 
            color="bg-blue-500"
          />
          
          <DockItem 
            active={mode === AppMode.ZEN_SAGE} 
            onClick={() => setMode(AppMode.ZEN_SAGE)} 
            icon={<MessageCircle size={28} />} 
            label="Sage" 
            color="bg-amber-500"
          />
        
        </div>
      </div>
    </div>
  );
};

interface DockItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  color: string;
  onClick: () => void;
}

const DockItem: React.FC<DockItemProps> = ({ icon, label, active, color, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="group relative flex flex-col items-center justify-center w-12 h-12 transition-all duration-300 hover:-translate-y-2"
    >
      <div className={`
        w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg transition-all duration-300
        ${active ? `${color} scale-110 ring-2 ring-white/30` : 'bg-gray-700/50 hover:bg-gray-600/80'}
      `}>
        {icon}
      </div>
      
      {/* Dot indicator for active app */}
      <div className={`absolute -bottom-2 w-1 h-1 rounded-full bg-white transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0'}`} />

      {/* Tooltip */}
      <span className="absolute -top-10 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10 whitespace-nowrap">
        {label}
      </span>
    </button>
  );
};

export default App;
