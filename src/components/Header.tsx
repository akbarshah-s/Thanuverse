import React from 'react';
import { useKoi } from '../context/KoiContext';
import { 
  Heart, 
  Volume2, 
  VolumeX, 
  CloudRain, 
  Sparkles, 
  Radio, 
  Music, 
  MessageCircleHeart, 
  Video, 
  Film, 
  BookOpen, 
  Calendar, 
  Image as ImageIcon,
  Flame,
  Globe2,
  Send
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentPerspective,
    setPerspective,
    viewMode,
    setViewMode,
    activeScreen,
    setActiveScreen,
    partnerA,
    partnerB,
    activePartner,
    otherPartner,
    distanceKm,
    timeStats,
    isPlayingMusic,
    toggleMusic,
    isRainPlaying,
    toggleRain,
    isCricketsPlaying,
    toggleCrickets,
    isMuted,
    toggleMute,
    currentTrack,
    sendMissYou,
    sendVirtualHug,
    sendVirtualKiss,
    isHeartbeatActive,
    triggerHeartbeat,
    stopHeartbeat,
    isChatOpen,
    setIsChatOpen,
    setActiveModal
  } = useKoi();

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-pink-500/20 px-4 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Brand & Distance */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <button 
            onClick={() => setActiveScreen('welcome')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-sky-400 p-[2px] shadow-[0_0_15px_rgba(255,117,151,0.5)] group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-pink-400 fill-pink-400/40 group-hover:fill-pink-400 transition-colors animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-sky-300 font-sans">
                  THANUVERSE
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  LDR
                </span>
              </div>
              <p className="text-[11px] text-pink-200/60 font-japanese">愛の宇宙 • Two Worlds, One Universe</p>
            </div>
          </button>

          {/* Distance Counter Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-purple-500/30 text-xs text-slate-300 shadow-inner">
            <Globe2 className="w-3.5 h-3.5 text-sky-400 animate-spin" style={{ animationDuration: '20s' }} />
            <span>
              <strong className="text-pink-300 font-semibold">{distanceKm.toLocaleString()} km</strong> apart
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-purple-300 italic">One shared sky</span>
          </div>
        </div>

        {/* Center: Dual Local Clocks & Perspective Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto">
          {/* Dual Clocks */}
          <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-xl border border-pink-500/20 text-xs">
            <div className={`flex items-center gap-1.5 ${currentPerspective === 'ren' ? 'text-sky-300 font-bold' : 'text-slate-400'}`}>
              <span>{partnerA.city}:</span>
              <span className="font-mono">{timeStats.partnerATime}</span>
            </div>
            <span className="text-pink-400/50">|</span>
            <div className={`flex items-center gap-1.5 ${currentPerspective === 'aoi' ? 'text-pink-300 font-bold' : 'text-slate-400'}`}>
              <span>{partnerB.city}:</span>
              <span className="font-mono">{timeStats.partnerBTime}</span>
            </div>
            <span className="bg-pink-500/20 text-pink-300 text-[10px] px-1.5 py-0.5 rounded-md font-mono">
              {timeStats.timeDifferenceHours === 0
                ? 'Same time'
                : `${timeStats.timeDifferenceHours > 0 ? '+' : ''}${timeStats.timeDifferenceHours}h`}
            </span>
          </div>

          {/* Perspective Switcher */}
          <div className="flex items-center p-0.5 bg-slate-900 border border-pink-500/30 rounded-xl text-xs">
            <button
              onClick={() => { setPerspective('ren'); setViewMode('perspective'); }}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                currentPerspective === 'ren' && viewMode === 'perspective'
                  ? 'bg-gradient-to-r from-sky-600 to-sky-500 text-white shadow-md font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{partnerA.name.split(' ')[0]}</span>
            </button>
            <button
              onClick={() => { setPerspective('aoi'); setViewMode('perspective'); }}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                currentPerspective === 'aoi' && viewMode === 'perspective'
                  ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-md font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{partnerB.name.split(' ')[0]}</span>
            </button>
            <button
              onClick={() => setViewMode(viewMode === 'split' ? 'perspective' : 'split')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                viewMode === 'split'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Split View: See both rooms side-by-side"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Split</span>
            </button>
          </div>
        </div>

        {/* Right: Soundscape & Quick Love Actions */}
        <div className="flex items-center gap-2 justify-end w-full md:w-auto">
          {/* Ambient Audio Controls */}
          <div className="flex items-center gap-1 bg-slate-900/80 border border-purple-500/20 px-2 py-1 rounded-xl">
            <button
              onClick={toggleMusic}
              className={`p-1.5 rounded-lg transition-colors ${
                isPlayingMusic ? 'text-pink-400 bg-pink-500/20 animate-pulse' : 'text-slate-400 hover:text-white'
              }`}
              title={isPlayingMusic ? 'Pause Lo-Fi Piano' : 'Play Lo-Fi Piano'}
            >
              <Music className="w-4 h-4" />
            </button>
            <button
              onClick={toggleRain}
              className={`p-1.5 rounded-lg transition-colors ${
                isRainPlaying ? 'text-sky-400 bg-sky-500/20' : 'text-slate-400 hover:text-white'
              }`}
              title="Toggle Cozy Rain Sound"
            >
              <CloudRain className="w-4 h-4" />
            </button>
            <button
              onClick={toggleMute}
              className={`p-1.5 rounded-lg transition-colors ${
                isMuted ? 'text-red-400' : 'text-slate-400 hover:text-white'
              }`}
              title="Mute All Audio"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Quick Love Actions */}
          <button
            onClick={sendMissYou}
            className="px-3 py-1.5 bg-pink-500/20 hover:bg-pink-500/40 text-pink-200 border border-pink-400/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(255,117,151,0.25)] hover:shadow-[0_0_20px_rgba(255,117,151,0.5)] active:scale-95"
          >
            <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400 animate-heartbeat" />
            <span>I Miss You</span>
          </button>

          {/* Heartbeat Sync Button */}
          <button
            onMouseDown={triggerHeartbeat}
            onMouseUp={stopHeartbeat}
            onTouchStart={triggerHeartbeat}
            onTouchEnd={stopHeartbeat}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all select-none ${
              isHeartbeatActive
                ? 'bg-rose-600 border-rose-300 text-white shadow-[0_0_25px_rgba(244,63,94,0.8)] scale-105'
                : 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border-rose-400/40'
            }`}
            title="Press and hold to sync heartbeats"
          >
            <Flame className={`w-3.5 h-3.5 ${isHeartbeatActive ? 'text-white animate-bounce' : 'text-rose-400'}`} />
            <span className="hidden sm:inline">Hold Heartbeat</span>
          </button>

          {/* Chat Toggle */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="relative p-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/40 border border-purple-400/40 text-purple-200 transition-all"
            title="Open Couple Chat"
          >
            <MessageCircleHeart className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-pink-500 border border-slate-950 animate-ping" />
          </button>
        </div>
      </div>
    </header>
  );
};
