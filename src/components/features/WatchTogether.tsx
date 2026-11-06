import React, { useState } from 'react';
import { useKoi } from '../../context/KoiContext';
import { X, Film, Play, Pause, Sparkles, Heart, Popcorn, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const WatchTogether: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    partnerA,
    partnerB
  } = useKoi();

  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState({
    title: "Makoto Shinkai's Twilight Skies & Stargazing",
    source: "https://assets.mixkit.co/videos/preview/mixkit-starry-night-sky-with-silhouette-trees-41487-large.mp4",
    duration: "Looping Ambience",
    backdrop: "/assets/balcony_galaxy.jpg"
  });

  const [reactions, setReactions] = useState<Array<{ id: number; emoji: string }>>([]);

  if (activeModal !== 'watch-together') return null;

  const movies = [
    {
      title: "Makoto Shinkai's Twilight Skies & Stargazing",
      source: "https://assets.mixkit.co/videos/preview/mixkit-starry-night-sky-with-silhouette-trees-41487-large.mp4",
      duration: "Looping Ambience",
      backdrop: "/assets/balcony_galaxy.jpg"
    },
    {
      title: "Tokyo Shinjuku Rainy Evening Lo-Fi",
      source: "https://assets.mixkit.co/videos/preview/mixkit-rain-falling-on-the-water-of-a-lake-seen-up-close-18312-large.mp4",
      duration: "Relaxing Rain",
      backdrop: "/assets/split_cities.png"
    },
    {
      title: "Paris Starlight & Eiffel Tower Sparkle",
      source: "https://assets.mixkit.co/videos/preview/mixkit-starry-night-sky-with-silhouette-trees-41487-large.mp4",
      duration: "Romantic Lights",
      backdrop: "/assets/moon_connection.jpg"
    }
  ];

  const popReaction = (emoji: string) => {
    const id = Date.now() + Math.random();
    setReactions(prev => [...prev, { id, emoji }]);
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== id));
    }, 2000);

    confetti({
      particleCount: 15,
      spread: 50,
      origin: { y: 0.8 }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-950/95 border-2 border-purple-500/40 rounded-3xl overflow-hidden flex flex-col shadow-[0_0_100px_rgba(192,132,252,0.3)] max-h-[92vh]">
        
        {/* HEADER */}
        <div className="p-4 bg-slate-900/90 border-b border-purple-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 p-0.5 shadow-lg">
              <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                <Film className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span>Couple Cinema Room</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-mono">
                  Synchronized Theater
                </span>
              </h3>
              <p className="text-xs text-purple-200/70">
                Watching together: {partnerA.name.split(' ')[0]} &amp; {partnerB.name.split(' ')[0]}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal('none')}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CINEMA SCREEN VIEWPORT */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
          {/* Reaction Overlay */}
          <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
            {reactions.map(r => (
              <div
                key={r.id}
                className="absolute text-5xl animate-float"
                style={{
                  left: `${30 + Math.random() * 40}%`,
                  bottom: '20%'
                }}
              >
                {r.emoji}
              </div>
            ))}
          </div>

          {/* Video Player */}
          <video
            src={selectedMovie.source}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Ambient Cinema Lighting at edges */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]" />

          {/* Seat Indicators */}
          <div className="absolute bottom-4 left-6 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-sky-400/40 text-xs text-sky-200">
            <span>Seat 1:</span>
            <strong>{partnerA.name.split(' ')[0]} ({partnerA.city})</strong>
          </div>

          <div className="absolute bottom-4 right-6 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-pink-400/40 text-xs text-pink-200">
            <span>Seat 2:</span>
            <strong>{partnerB.name.split(' ')[0]} ({partnerB.city})</strong>
          </div>
        </div>

        {/* PLAYBACK BAR & POPCORN REACTIONS */}
        <div className="p-4 bg-slate-900 border-t border-purple-500/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white shadow-md active:scale-95"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <div>
              <div className="text-sm font-bold text-white">{selectedMovie.title}</div>
              <div className="text-xs text-purple-300/70 font-mono">Synced for both screens &bull; {selectedMovie.duration}</div>
            </div>
          </div>

          {/* Popcorn & Floating Theater Reactions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => popReaction('🍿')}
              className="px-3 py-2 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/40 border border-yellow-400/40 text-yellow-200 text-xs font-semibold flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95"
            >
              <span>🍿 Throw Popcorn</span>
            </button>
            <button
              onClick={() => popReaction('❤️')}
              className="px-3 py-2 rounded-xl bg-pink-500/20 hover:bg-pink-500/40 border border-pink-400/40 text-pink-200 text-xs font-semibold flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95"
            >
              <span>❤️ Send Heart</span>
            </button>
            <button
              onClick={() => popReaction('✨')}
              className="px-3 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/40 border border-purple-400/40 text-purple-200 text-xs font-semibold flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95"
            >
              <span>✨ Stardust</span>
            </button>
          </div>
        </div>

        {/* SELECT MOVIE LIST */}
        <div className="p-4 bg-slate-950 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-purple-500/20">
          {movies.map(m => (
            <div
              key={m.title}
              onClick={() => setSelectedMovie(m)}
              className={`cursor-pointer p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                selectedMovie.title === m.title
                  ? 'bg-purple-950/50 border-purple-400 shadow-md'
                  : 'bg-slate-900/60 border-slate-800 hover:border-purple-500/30'
              }`}
            >
              <img src={m.backdrop} alt={m.title} className="w-12 h-12 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white truncate">{m.title}</div>
                <div className="text-[10px] text-purple-300/70">{m.duration}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
