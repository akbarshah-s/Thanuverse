import React, { useState } from 'react';
import { useKoi } from '../context/KoiContext';
import { 
  Heart, 
  Sparkles, 
  Moon, 
  Video, 
  Phone, 
  Film, 
  Music, 
  Mail, 
  Image as ImageIcon, 
  Calendar, 
  Coffee, 
  Flame, 
  MessageCircle, 
  Maximize2, 
  Minimize2, 
  Palette,
  CloudRain,
  Eye,
  Send,
  BookHeart,
  HelpCircle,
  MapPin
} from 'lucide-react';

export const RoomUniverse: React.FC = () => {
  const {
    currentPerspective,
    setPerspective,
    viewMode,
    setViewMode,
    partnerA,
    partnerB,
    activePartner,
    otherPartner,
    distanceKm,
    distanceMiles,
    timeStats,
    isMoonConnected,
    connectMoon,
    isHeartbeatActive,
    heartbeatBpm,
    triggerHeartbeat,
    stopHeartbeat,
    sendVirtualHug,
    sendVirtualKiss,
    sendMissYou,
    loveNotes,
    openNote,
    isPlayingMusic,
    toggleMusic,
    currentTrack,
    setActiveModal,
    setIsChatOpen
  } = useKoi();

  // Avatar expressions
  const [renExpression, setRenExpression] = useState<'gentle' | 'blush' | 'smile' | 'tea'>('gentle');
  const [aoiExpression, setAoiExpression] = useState<'smile' | 'blush' | 'sleepy' | 'tea'>('smile');

  // Interactive room theme backgrounds (using user's uploaded images!)
  const [partnerATheme, setPartnerATheme] = useState<string>('/assets/balcony_galaxy.jpg');
  const [partnerBTheme, setPartnerBTheme] = useState<string>('/assets/split_cities.png');

  // Hotspot hovered states
  const [hoveredObject, setHoveredObject] = useState<string | null>(null);

  return (
    <div className="relative min-h-[calc(100vh-65px)] w-full overflow-hidden flex flex-col justify-between p-3 sm:p-6 select-none">
      {/* ROOM TOP HEADER BAR */}
      <div className="relative z-30 flex flex-wrap items-center justify-between gap-3 bg-slate-950/70 border border-pink-500/30 rounded-2xl p-3 backdrop-blur-xl shadow-2xl">
        {/* Left: Couple Status & Duration */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3 items-center">
            <img
              src={partnerA.avatar}
              alt={partnerA.name}
              className="w-10 h-10 rounded-full border-2 border-sky-400 object-cover shadow-md"
            />
            <div className="w-5 h-5 rounded-full bg-pink-500 border border-white flex items-center justify-center text-[10px] z-10 shadow">
              ❤️
            </div>
            <img
              src={partnerB.avatar}
              alt={partnerB.name}
              className="w-10 h-10 rounded-full border-2 border-pink-400 object-cover shadow-md"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-white text-sm sm:text-base">
                {partnerA.name.split(' ')[0]} &amp; {partnerB.name.split(' ')[0]}'s Shared Universe
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Connected
              </span>
            </div>
            <p className="text-xs text-pink-200/70 font-mono">
              Together {timeStats.relationshipDuration.days} days, {timeStats.relationshipDuration.hours} hours &bull; {distanceKm.toLocaleString()} km
            </p>
          </div>
        </div>

        {/* Center: Moon Connection Status */}
        <div 
          onClick={connectMoon}
          className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-sky-500/20 via-purple-500/30 to-pink-500/20 border border-pink-400/50 shadow-md hover:brightness-125 transition-all"
        >
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-sky-400 to-pink-400 shadow-[0_0_8px_#fff]" />
          <span className="text-xs font-semibold text-pink-100">
            Moon Connection: <span className="text-yellow-300">Synchronized</span>
          </span>
        </div>

        {/* Right: Quick Room Activity Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveModal('video-call')}
            className="px-3 py-1.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-pink-500/25 active:scale-95 transition-all"
          >
            <Video className="w-4 h-4" />
            <span className="hidden sm:inline">Start Call</span>
          </button>
          <button
            onClick={() => setActiveModal('watch-together')}
            className="p-2 bg-slate-900 border border-purple-500/40 hover:bg-purple-500/20 text-purple-200 rounded-xl text-xs"
            title="Watch Anime Together"
          >
            <Film className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveModal('activity')}
            className="p-2 bg-slate-900 border border-pink-500/40 hover:bg-pink-500/20 text-pink-200 rounded-xl text-xs"
            title="Shared Couple Activities & Doodles"
          >
            <Palette className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode(viewMode === 'split' ? 'perspective' : 'split')}
            className={`p-2 rounded-xl text-xs border ${
              viewMode === 'split'
                ? 'bg-pink-500/30 border-pink-400 text-pink-100'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Toggle Two Worlds Split View"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CENTRAL EXPERIENCE: TWO WORLDS CONNECTED INTO ONE UNIVERSE */}
      <div className="relative z-20 my-4 flex-1 flex items-stretch rounded-3xl overflow-hidden border-2 border-purple-500/30 shadow-[0_0_80px_rgba(192,132,252,0.15)] min-h-[520px]">
        {/* WORLD A */}
        <div
          className={`relative flex-1 bg-cover bg-center transition-all duration-700 flex flex-col justify-between p-6 ${
            viewMode === 'perspective' && currentPerspective === 'aoi' ? 'hidden md:flex opacity-40 blur-[1px]' : 'opacity-100'
          }`}
          style={{
            backgroundImage: `url('${partnerATheme}')`,
          }}
        >
          {/* Subtle dark gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

          {/* Partner one's location */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-sky-400/40 shadow-lg">
              <MapPin className="h-4 w-4 text-sky-300" />
              <div>
                <div className="text-xs font-bold text-sky-200">{partnerA.name} &bull; {partnerA.city}, {partnerA.country}</div>
                <div className="text-[10px] text-sky-300/80 font-mono">{partnerA.timezone} &bull; {timeStats.partnerATime}</div>
              </div>
            </div>

            {/* Expression Switcher for partner one */}
            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md p-1 rounded-full border border-sky-500/30">
              <button
                onClick={() => setRenExpression('gentle')}
                className={`px-2 py-0.5 rounded-full text-[11px] ${renExpression === 'gentle' ? 'bg-sky-500/40 text-white' : 'text-slate-400'}`}
                title="Gentle Stargazing"
              >
                💌
              </button>
              <button
                onClick={() => setRenExpression('blush')}
                className={`px-2 py-0.5 rounded-full text-[11px] ${renExpression === 'blush' ? 'bg-sky-500/40 text-white' : 'text-slate-400'}`}
                title="Blushing"
              >
                🥰
              </button>
              <button
                onClick={() => setRenExpression('tea')}
                className={`px-2 py-0.5 rounded-full text-[11px] ${renExpression === 'tea' ? 'bg-sky-500/40 text-white' : 'text-slate-400'}`}
                title="Warm Tea"
              >
                🍵
              </button>
            </div>
          </div>

          {/* Virtual Window Hotspot / Japanese Veranda Elements */}
          <div className="relative z-10 flex flex-col items-start gap-3 mt-auto pb-4">
            {/* Love Letter Hotspot */}
            <div
              onClick={() => openNote(loveNotes[0])}
              onMouseEnter={() => setHoveredObject(`${partnerA.name}'s Love Letter`)}
              onMouseLeave={() => setHoveredObject(null)}
              className="cursor-pointer group flex items-center gap-2.5 bg-slate-900/80 hover:bg-sky-950/90 border border-sky-400/40 hover:border-sky-300 rounded-2xl px-4 py-2.5 backdrop-blur-md shadow-xl transition-all hover:scale-105"
            >
              <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-400 flex items-center justify-center text-sky-300 group-hover:animate-bounce">
                <Mail className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
                  Glowing Letter on Balcony
                </div>
                <div className="text-[10px] text-sky-200/70">Tap to unfold {partnerA.name}’s letter</div>
              </div>
            </div>

            {/* Partner one's status quote */}
            <div className="max-w-xs bg-black/60 backdrop-blur-md border border-sky-500/20 rounded-2xl p-3 text-xs text-sky-100 shadow-md">
              <span className="text-sky-400 font-semibold block mb-0.5">{partnerA.name}’s Window:</span>
              "{partnerA.currentStatus}"
            </div>
          </div>
        </div>

        {/* CENTER DIVIDER: CELESTIAL MOON CONNECTION PORTAL (Inspired by Image 3) */}
        <div className="relative z-20 w-16 sm:w-28 flex flex-col items-center justify-center bg-gradient-to-b from-purple-950/80 via-slate-950/90 to-purple-950/80 border-x border-pink-400/40 backdrop-blur-xl shadow-2xl">
          {/* Vertical Connecting Light Ray */}
          <div className="absolute inset-y-0 w-[2px] bg-gradient-to-b from-transparent via-pink-400 to-transparent animate-pulse" />

          {/* THE MOON CONNECTION */}
          <div 
            onClick={connectMoon}
            className="cursor-pointer relative flex flex-col items-center group"
            title="Click to trigger celestial Moon Harmonization"
          >
            {/* Outer Stardust Ring */}
            <div className="w-20 h-20 rounded-full border border-pink-300/40 animate-spin flex items-center justify-center" style={{ animationDuration: '30s' }}>
              <div className="w-2 h-2 rounded-full bg-yellow-200 absolute -top-1" />
            </div>

            {/* Split Harmonious Moon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full overflow-hidden shadow-[0_0_35px_rgba(254,240,138,0.8)] border border-yellow-200/60 flex group-hover:scale-110 transition-transform">
                {/* Left Moon Half (Tokyo Twilight Blue) */}
                <div className="w-1/2 h-full bg-gradient-to-br from-sky-200 via-sky-400 to-indigo-600 opacity-90" />
                {/* Right Moon Half (Paris Sunset Pink) */}
                <div className="w-1/2 h-full bg-gradient-to-bl from-pink-200 via-rose-400 to-purple-600 opacity-90" />
              </div>
            </div>

            <span className="mt-2 text-[10px] uppercase font-bold text-pink-300 tracking-wider text-center">
              Shared<br />Moon
            </span>
          </div>

          {/* HEARTBEAT TOUCHPAD */}
          <div className="mt-8 flex flex-col items-center">
            <button
              onMouseDown={triggerHeartbeat}
              onMouseUp={stopHeartbeat}
              onTouchStart={triggerHeartbeat}
              onTouchEnd={stopHeartbeat}
              className={`w-14 h-14 rounded-full flex flex-col items-center justify-center transition-all select-none ${
                isHeartbeatActive
                  ? 'bg-rose-500 shadow-[0_0_35px_rgba(244,63,94,1)] scale-125 ring-4 ring-rose-200'
                  : 'bg-rose-500/20 hover:bg-rose-500/40 border border-rose-400/50'
              }`}
              title="Hold to pulse synchronized heartbeat"
            >
              <Heart className={`w-7 h-7 text-rose-300 fill-rose-300 ${isHeartbeatActive ? 'animate-ping' : 'animate-heartbeat'}`} />
            </button>
            <span className="mt-1 text-[9px] text-rose-300/80 font-mono text-center">
              {isHeartbeatActive ? `${heartbeatBpm} BPM` : 'Hold'}
            </span>
          </div>

          {/* Sakura Wind Icon */}
          <div className="mt-8 text-pink-400/70 text-sm animate-bounce">
            🌸
          </div>
        </div>

        {/* WORLD B (AOI'S SIDE - PARIS STARLIGHT TERRACE / COZY BEDROOM) */}
        <div
          className={`relative flex-1 bg-cover bg-center transition-all duration-700 flex flex-col justify-between p-6 ${
            viewMode === 'perspective' && currentPerspective === 'ren' ? 'hidden md:flex opacity-40 blur-[1px]' : 'opacity-100'
          }`}
          style={{
            backgroundImage: `url('${partnerBTheme}')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

          {/* Partner two's location */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-pink-400/40 shadow-lg">
              <MapPin className="h-4 w-4 text-pink-300" />
              <div>
                <div className="text-xs font-bold text-pink-200">{partnerB.name} &bull; {partnerB.city}, {partnerB.country}</div>
                <div className="text-[10px] text-pink-300/80 font-mono">{partnerB.timezone} &bull; {timeStats.partnerBTime}</div>
              </div>
            </div>

            {/* Expression Switcher for partner two */}
            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md p-1 rounded-full border border-pink-500/30">
              <button
                onClick={() => setAoiExpression('smile')}
                className={`px-2 py-0.5 rounded-full text-[11px] ${aoiExpression === 'smile' ? 'bg-pink-500/40 text-white' : 'text-slate-400'}`}
                title="Happy Smile"
              >
                🥰
              </button>
              <button
                onClick={() => setAoiExpression('blush')}
                className={`px-2 py-0.5 rounded-full text-[11px] ${aoiExpression === 'blush' ? 'bg-pink-500/40 text-white' : 'text-slate-400'}`}
                title="Blushing"
              >
                😳
              </button>
              <button
                onClick={() => setAoiExpression('tea')}
                className={`px-2 py-0.5 rounded-full text-[11px] ${aoiExpression === 'tea' ? 'bg-pink-500/40 text-white' : 'text-slate-400'}`}
                title="Croissant & Tea"
              >
                🥐
              </button>
            </div>
          </div>

          {/* Virtual Window Hotspot / Paris Fairy Light Elements */}
          <div className="relative z-10 flex flex-col items-end gap-3 mt-auto pb-4">
            {/* Record Player Hotspot */}
            <div
              onClick={() => setActiveModal('music')}
              onMouseEnter={() => setHoveredObject("Together Music Vinyl")}
              onMouseLeave={() => setHoveredObject(null)}
              className="cursor-pointer group flex items-center gap-2.5 bg-slate-900/80 hover:bg-pink-950/90 border border-pink-400/40 hover:border-pink-300 rounded-2xl px-4 py-2.5 backdrop-blur-md shadow-xl transition-all hover:scale-105"
            >
              <div className={`w-8 h-8 rounded-full bg-pink-500/20 border border-pink-400 flex items-center justify-center text-pink-300 ${isPlayingMusic ? 'animate-spin' : ''}`}>
                <Music className="w-4 h-4" />
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-white group-hover:text-pink-300 transition-colors">
                  Shared Vinyl Player
                </div>
                <div className="text-[10px] text-pink-200/70 font-mono">
                  {isPlayingMusic ? `Playing: ${currentTrack.title}` : 'Tap to start music'}
                </div>
              </div>
            </div>

            {/* Partner two's status quote */}
            <div className="max-w-xs bg-black/60 backdrop-blur-md border border-pink-500/20 rounded-2xl p-3 text-xs text-pink-100 shadow-md text-right">
              <span className="text-pink-400 font-semibold block mb-0.5">{partnerB.name}’s Balcony:</span>
              "{partnerB.currentStatus}"
            </div>
          </div>
        </div>
      </div>

      {/* ROOM BOTTOM ACTION DOCK: Activities, Memories, Diary, Calendar, Hugs */}
      <div className="relative z-30 flex flex-wrap items-center justify-between gap-3 bg-slate-950/80 border border-pink-500/30 rounded-2xl p-3 backdrop-blur-xl shadow-2xl">
        {/* Navigation Quick Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveModal('memories')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-pink-500/20 border border-pink-500/30 text-pink-200 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <ImageIcon className="w-4 h-4 text-pink-400" />
            <span>Memory Wall</span>
          </button>
          <button
            onClick={() => setActiveModal('notes')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-purple-500/20 border border-purple-500/30 text-purple-200 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <Mail className="w-4 h-4 text-purple-400" />
            <span>Love Letters ({loveNotes.length})</span>
          </button>
          <button
            onClick={() => setActiveModal('diary')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-sky-500/20 border border-sky-500/30 text-sky-200 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <BookHeart className="w-4 h-4 text-sky-400" />
            <span>Secret Diary</span>
          </button>
          <button
            onClick={() => setActiveModal('calendar')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-200 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <Calendar className="w-4 h-4 text-yellow-400" />
            <span>Our Time ({timeStats.nextMeetingCountdown.days}d to reunion)</span>
          </button>
          <button
            onClick={() => setActiveModal('activity')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-rose-500/20 border border-rose-500/30 text-rose-200 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <HelpCircle className="w-4 h-4 text-rose-400" />
            <span>Activities &amp; Wishes</span>
          </button>
        </div>

        {/* Big Romantic Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={sendVirtualHug}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_0_20px_rgba(255,117,151,0.4)] active:scale-95 transition-all"
          >
            <Heart className="w-4 h-4 fill-white text-white" />
            <span>Send Warm Hug</span>
          </button>
          <button
            onClick={sendVirtualKiss}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_0_20px_rgba(192,132,252,0.4)] active:scale-95 transition-all"
          >
            <span>💋 Send Kiss</span>
          </button>
          <button
            onClick={() => setIsChatOpen(true)}
            className="p-2.5 rounded-xl bg-slate-900 border border-pink-400/40 text-pink-300 hover:text-white hover:bg-pink-500/20"
            title="Open Couple Messages"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
