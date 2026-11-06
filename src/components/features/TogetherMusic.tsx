import React, { useState } from 'react';
import { useKoi } from '../../context/KoiContext';
import { 
  X, 
  Music, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Heart, 
  Sparkles, 
  CloudRain, 
  Disc, 
  Headphones,
  Send
} from 'lucide-react';

export const TogetherMusic: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    playlist,
    currentTrack,
    selectTrack,
    isPlayingMusic,
    toggleMusic,
    isRainPlaying,
    toggleRain,
    isCricketsPlaying,
    toggleCrickets,
    isMuted,
    toggleMute,
    dedicateTrack,
    currentPerspective,
    partners,
    partnerA,
    partnerB
  } = useKoi();

  const [dedicationNote, setDedicationNote] = useState('');
  const [dedicatingTrackId, setDedicatingTrackId] = useState<string | null>(null);

  if (activeModal !== 'music') return null;

  const handleDedicate = (trackId: string) => {
    if (!dedicationNote.trim()) return;
    dedicateTrack(trackId, dedicationNote.trim());
    setDedicationNote('');
    setDedicatingTrackId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-950/95 border-2 border-pink-500/40 rounded-3xl overflow-hidden flex flex-col shadow-[0_0_80px_rgba(255,117,151,0.3)] max-h-[90vh]">
        
        {/* HEADER */}
        <div className="p-4 bg-gradient-to-r from-purple-950/80 via-slate-950/80 to-pink-950/80 border-b border-pink-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-0.5 shadow-lg">
              <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                <Music className="w-5 h-5 text-pink-400" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span>Together Music</span>
                <span className="text-[10px] bg-pink-500/20 text-pink-300 border border-pink-500/30 px-2 py-0.5 rounded-full">
                  Synced Listening
                </span>
              </h3>
              <p className="text-xs text-pink-200/70 font-mono">
                Both listening together in real-time across the ocean
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

        {/* CURRENT TRACK HERO BANNER */}
        <div className="p-6 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-pink-500/20 flex flex-col sm:flex-row items-center gap-6">
          {/* Spinning Vinyl Record Visual */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            <div
              className={`w-36 h-36 rounded-full bg-slate-900 border-4 border-slate-800 shadow-[0_0_30px_rgba(0,0,0,0.8)] flex items-center justify-center relative overflow-hidden ${
                isPlayingMusic ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '8s' }}
            >
              {/* Vinyl Grooves */}
              <div className="absolute inset-2 rounded-full border border-slate-700/50" />
              <div className="absolute inset-5 rounded-full border border-slate-700/40" />
              <div className="absolute inset-8 rounded-full border border-slate-700/30" />
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="w-16 h-16 rounded-full object-cover border-2 border-pink-400 shadow-md"
              />
              <div className="w-4 h-4 rounded-full bg-slate-950 border-2 border-white absolute center" />
            </div>
          </div>

          {/* Track Details & Playback */}
          <div className="flex-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[11px] font-semibold mb-2">
              <Headphones className="w-3.5 h-3.5" />
              <span>Now Playing for {partnerA.name} &amp; {partnerB.name}</span>
            </div>
            <h4 className="text-xl font-bold text-white">{currentTrack.title}</h4>
            <p className="text-sm text-pink-300/80">{currentTrack.artist}</p>

            {/* Dedicated Note Banner */}
            {currentTrack.dedicatedNote && (
              <div className="mt-2 text-xs bg-pink-500/10 border border-pink-400/30 rounded-xl p-2.5 text-pink-200 italic flex items-center gap-2">
                <Heart className="w-4 h-4 fill-pink-400 text-pink-400 shrink-0" />
                <span>"{currentTrack.dedicatedNote}"</span>
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-center sm:justify-start gap-4 mt-4">
              <button
                onClick={toggleMusic}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white flex items-center justify-center shadow-lg shadow-pink-500/30 active:scale-95 transition-all"
              >
                {isPlayingMusic ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              <button
                onClick={toggleRain}
                className={`p-2.5 rounded-xl border text-xs flex items-center gap-1.5 transition-all ${
                  isRainPlaying ? 'bg-sky-500/30 border-sky-400 text-sky-200' : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
                title="Blend cozy rain sound"
              >
                <CloudRain className="w-4 h-4" />
                <span>Rain Sound</span>
              </button>

              <button
                onClick={toggleCrickets}
                className={`p-2.5 rounded-xl border text-xs flex items-center gap-1.5 transition-all ${
                  isCricketsPlaying ? 'bg-purple-500/30 border-purple-400 text-purple-200' : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
                title="Blend night crickets"
              >
                <Sparkles className="w-4 h-4" />
                <span>Night Breeze</span>
              </button>
            </div>
          </div>
        </div>

        {/* SHARED PLAYLIST */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
            Shared Playlist ({playlist.length} tracks)
          </div>

          {playlist.map(track => {
            const isSelected = track.id === currentTrack.id;

            return (
              <div
                key={track.id}
                className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-pink-950/40 border-pink-400 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 hover:border-pink-500/30'
                }`}
              >
                <div
                  onClick={() => selectTrack(track)}
                  className="flex items-center gap-3 cursor-pointer flex-1"
                >
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-12 h-12 rounded-xl object-cover border border-white/20"
                  />
                  <div>
                    <h5 className="font-semibold text-white text-sm flex items-center gap-2">
                      <span>{track.title}</span>
                      {track.dedicatedBy && (
                        <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-1.5 py-0.2 rounded-md">
                          Dedicated by {partners[track.dedicatedBy].name} ❤️
                        </span>
                      )}
                    </h5>
                    <p className="text-xs text-slate-400">{track.artist} &bull; {track.duration}</p>
                  </div>
                </div>

                {/* Dedicate Song Action */}
                <div className="flex items-center gap-2 justify-end">
                  {dedicatingTrackId === track.id ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={dedicationNote}
                        onChange={(e) => setDedicationNote(e.target.value)}
                        placeholder="Write a sweet dedication..."
                        className="bg-black/60 border border-pink-400 rounded-lg px-2.5 py-1 text-xs text-white"
                      />
                      <button
                        onClick={() => handleDedicate(track.id)}
                        className="px-2.5 py-1 bg-pink-600 text-white rounded-lg text-xs font-semibold"
                      >
                        Dedicate
                      </button>
                      <button
                        onClick={() => setDedicatingTrackId(null)}
                        className="text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDedicatingTrackId(track.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-pink-500/20 border border-slate-700 text-pink-300 text-xs flex items-center gap-1"
                    >
                      <Heart className="w-3.5 h-3.5" /> Dedicate
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
