
import React, { useState, useRef, useEffect } from 'react';

const PLAYLIST = [
  { name: 'Windows XP Startup', url: 'https://archive.org/download/winxp-sounds/startup.mp3' },
  { name: 'Like Humans Do (Beck)', url: 'https://www.winhistory.de/more/winxp/beck.mp3' },
  { name: 'Nostalgia Beats', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { name: 'Windows XP Error Remix', url: 'https://archive.org/download/winxp-sounds/error.mp3' }
];

export const MediaPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentIndex(prev => (prev + 1) % PLAYLIST.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentIndex(prev => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full bg-[#121E31] text-white font-[Tahoma] overflow-hidden">
      <audio 
        ref={audioRef}
        src={PLAYLIST[currentIndex].url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
      />

      <div className="bg-gradient-to-b from-[#4A6EB3] to-[#2B4C8C] p-1 flex justify-between items-center text-[10px] border-b border-[#121E31]">
        <div className="flex items-center gap-2 pl-1">
          <img src="https://win98icons.alexmeub.com/icons/png/mmsys_cp-0.png" className="w-3.5 h-3.5" alt="" />
          <span>Windows Media Player</span>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center relative bg-black/40 shadow-inner">
        <div className="w-full h-full absolute opacity-30 bg-[radial-gradient(circle_at_center,_#3B8CF8_0%,_transparent_70%)]"></div>
        
        <div className="flex gap-1 h-32 items-end mb-4 relative z-10">
          {[...Array(15)].map((_, i) => (
            <div 
              key={i} 
              className={`w-2 bg-blue-500 rounded-t-sm transition-all duration-300 ${isPlaying ? 'animate-bounce' : 'h-2'}`}
              style={{ 
                animationDelay: `${i * 0.1}s`, 
                height: isPlaying ? `${Math.random() * 80 + 20}%` : '10%' 
              }}
            ></div>
          ))}
        </div>
        
        <div className="text-sm font-bold text-blue-100 relative z-10 drop-shadow-md text-center px-4">
          {PLAYLIST[currentIndex].name}
        </div>
        <div className="text-[10px] text-gray-400 relative z-10 mt-1">XP Professional Collection</div>
      </div>

      <div className="bg-gradient-to-t from-[#2B4C8C] to-[#4A6EB3] p-4 flex flex-col gap-3 border-t border-[#121E31]">
        <div className="flex items-center gap-3">
           <span className="text-[9px] text-blue-100">{formatTime(currentTime)}</span>
           <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/10 relative">
              <div 
                className="h-full bg-[#3B8CF8] shadow-[0_0_5px_#3B8CF8] transition-all duration-300"
                style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
              ></div>
           </div>
           <span className="text-[9px] text-blue-100">{formatTime(duration || 0)}</span>
        </div>
        
        <div className="flex justify-center items-center gap-6">
          <button onClick={prevTrack} className="text-blue-100 hover:text-white transform active:scale-90 text-xl">⏮</button>
          <button 
            onClick={togglePlay} 
            className="w-12 h-12 rounded-full bg-gradient-to-b from-[#3B8CF8] to-[#1e52b7] border-2 border-blue-300/50 flex items-center justify-center shadow-lg hover:brightness-110 active:brightness-90 transition-all"
          >
            <span className="text-white text-lg drop-shadow-md">{isPlaying ? '⏸' : '▶'}</span>
          </button>
          <button onClick={nextTrack} className="text-blue-100 hover:text-white transform active:scale-90 text-xl">⏭</button>
        </div>
      </div>
    </div>
  );
};
