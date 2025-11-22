import React, { useState, useRef } from 'react';
import { Volume2, VolumeX, CloudRain, Music, Wind, Bird } from 'lucide-react';
import { SoundTrack } from '../types';

// Placeholder public domain/creative commons sound links
const SOUNDS: SoundTrack[] = [
  {
    id: 'purr',
    title: 'Ronronnement',
    icon: 'cat',
    src: 'https://cdn.pixabay.com/download/audio/2022/10/30/audio_7c25e2f1b6.mp3?filename=cat-purring-122659.mp3' 
  },
  {
    id: 'rain',
    title: 'Pluie Douce',
    icon: 'rain',
    src: 'https://cdn.pixabay.com/download/audio/2022/02/18/audio_74d8984e4e.mp3?filename=light-rain-ambient-114354.mp3'
  },
  {
    id: 'birds',
    title: 'Oiseaux',
    icon: 'bird',
    src: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_75329f54cc.mp3?filename=birds-in-forest-19937.mp3'
  },
  {
    id: 'forest',
    title: 'Forêt Calme',
    icon: 'wind',
    src: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=forest-wind-and-birds-6881.mp3'
  }
];

const SoundBoard: React.FC = () => {
  const [playing, setPlaying] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleSound = (sound: SoundTrack) => {
    if (playing === sound.id) {
      audioRef.current?.pause();
      setPlaying(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(sound.src);
      audio.loop = true;
      audio.volume = volume;
      audio.play().catch(e => console.error("Audio play failed", e));
      audioRef.current = audio;
      setPlaying(sound.id);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = Number(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const getIcon = (iconName: string) => {
    switch(iconName) {
      case 'rain': return <CloudRain size={32} />;
      case 'bird': return <Bird size={32} />;
      case 'wind': return <Wind size={32} />;
      default: return <Music size={32} />;
    }
  };

  return (
    <div className="h-full w-full p-8 flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
      <h2 className="text-3xl font-light text-white mb-8 tracking-wide">Ambiance Sonore</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {SOUNDS.map((sound) => (
          <button
            key={sound.id}
            onClick={() => toggleSound(sound)}
            className={`
              flex flex-col items-center justify-center w-32 h-32 rounded-2xl backdrop-blur-xl border 
              transition-all duration-300 transform hover:scale-105
              ${playing === sound.id 
                ? 'bg-blue-500/20 border-blue-400 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}
            `}
          >
            <div className="mb-3">{getIcon(sound.icon)}</div>
            <span className="text-sm font-medium">{sound.title}</span>
            {playing === sound.id && (
              <div className="flex gap-1 mt-2">
                <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Master Volume Control */}
      <div className="w-full max-w-md bg-black/30 rounded-xl p-4 flex items-center gap-4 backdrop-blur-md border border-white/5">
        <button onClick={() => setVolume(0)} className="text-gray-400 hover:text-white">
          {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <span className="text-xs text-gray-500 font-mono w-8 text-right">{Math.round(volume * 100)}%</span>
      </div>
    </div>
  );
};

export default SoundBoard;
