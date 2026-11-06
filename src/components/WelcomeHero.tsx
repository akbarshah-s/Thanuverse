import React from 'react';
import { useKoi } from '../context/KoiContext';
import { 
  Heart, 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  Mail, 
  ArrowRight, 
  Compass, 
  Plane, 
  Music, 
  Flame, 
  Gift, 
  Moon,
  MessageCircle,
  Video
} from 'lucide-react';

export const WelcomeHero: React.FC = () => {
  const {
    activePartner,
    otherPartner,
    partners,
    distanceKm,
    distanceMiles,
    timeStats,
    setActiveScreen,
    loveNotes,
    openNote,
    sendVirtualHug,
    sendVirtualKiss,
    sendMissYou,
    setActiveModal,
    isMoonConnected,
    connectMoon
  } = useKoi();

  const dailyNote = loveNotes.find(n => n.isDailySpecial) || loveNotes[0];

  return (
    <div className="relative min-h-[calc(100vh-65px)] flex flex-col justify-between p-4 sm:p-8 max-w-7xl mx-auto z-20">
      {/* Background Anime Ambience Overlay */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center opacity-30 pointer-events-none transition-all duration-1000"
        style={{
          backgroundImage: `url('/assets/balcony_galaxy.jpg')`,
          filter: 'blur(3px)'
        }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#090a16]/80 via-[#101229]/90 to-[#090a16] pointer-events-none" />

      {/* TOP SECTION: Hero Headline & Core Product Message */}
      <div className="relative z-10 text-center max-w-3xl mx-auto pt-4 sm:pt-8 animate-fadeIn">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-sky-500/20 border border-pink-400/40 text-xs sm:text-sm font-semibold text-pink-200 mb-4 shadow-[0_0_20px_rgba(255,117,151,0.25)]">
          <Moon className="w-4 h-4 text-yellow-300 animate-pulse" />
          <span>THANUVERSE • Virtual Sanctuary for Long-Distance Love</span>
        </div>

        {/* The Exact Required Welcome Quote */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white font-sans leading-tight">
          Even though you're <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-pink-400 to-purple-400">miles apart</span>,<br />
          this is where you meet.
        </h1>

        {/* Product Message */}
        <p className="mt-4 text-base sm:text-xl text-pink-200/80 font-light max-w-2xl mx-auto">
          "Distance separates places, not hearts."
        </p>

        {/* Live Relationship Duration Counter */}
        <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 bg-slate-900/80 border border-pink-500/30 rounded-2xl px-5 py-3 shadow-[0_0_30px_rgba(192,132,252,0.15)] backdrop-blur-md">
          <div className="flex items-center gap-2 text-pink-300 font-medium text-xs sm:text-sm">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400 animate-heartbeat" />
            <span>Together for:</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-sm sm:text-base font-bold text-white">
            <span className="bg-pink-950/60 border border-pink-500/40 px-2 py-0.5 rounded-lg text-pink-300">
              {timeStats.relationshipDuration.days}d
            </span>
            <span className="bg-purple-950/60 border border-purple-500/40 px-2 py-0.5 rounded-lg text-purple-300">
              {timeStats.relationshipDuration.hours}h
            </span>
            <span className="bg-indigo-950/60 border border-indigo-500/40 px-2 py-0.5 rounded-lg text-indigo-300">
              {timeStats.relationshipDuration.minutes}m
            </span>
            <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-lg text-slate-300 w-10 text-center">
              {String(timeStats.relationshipDuration.seconds).padStart(2, '0')}s
            </span>
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION: Connected Partner Cards & Big CTA */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 my-8 items-center">
        {/* Partner A Card */}
        <div className="md:col-span-4 bg-slate-900/70 border border-sky-500/30 rounded-3xl p-6 backdrop-blur-xl shadow-xl hover:border-sky-400/60 transition-all group">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={activePartner.avatar}
                alt={activePartner.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-sky-400/50 shadow-lg group-hover:scale-105 transition-transform"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold text-white">{activePartner.name}</span>
              </div>
              <p className="text-xs text-sky-300 font-mono flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" /> {activePartner.city}, {activePartner.country}
              </p>
              <div className="text-xs text-slate-300 font-mono mt-1 bg-black/40 px-2 py-0.5 rounded-md inline-block">
                🕒 Local: {activePartner.id === 'ren' ? timeStats.partnerATime : timeStats.partnerBTime}
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-300/80 italic line-clamp-2">
            "{activePartner.currentStatus}"
          </p>
        </div>

        {/* Center: Glowing "Enter Our Room" Gateway */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center px-2">
          {/* Moon Connection Gateway Indicator */}
          <div 
            onClick={connectMoon}
            className="cursor-pointer mb-4 flex items-center gap-2 bg-gradient-to-r from-sky-500/20 via-purple-500/30 to-pink-500/20 border border-pink-400/50 px-4 py-2 rounded-full shadow-[0_0_25px_rgba(255,117,151,0.3)] hover:scale-105 transition-all"
            title="Click to harmonize the Moon Connection"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-sky-300 to-pink-300 shadow-[0_0_12px_#fff]" />
            <span className="text-xs font-semibold text-pink-100">
              Moon Connection: <strong className="text-yellow-300">Synchronized 🌙</strong>
            </span>
          </div>

          {/* MAIN CTA BUTTON: ENTER OUR ROOM */}
          <button
            onClick={() => setActiveScreen('room')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-400 hover:via-rose-400 hover:to-purple-500 text-white font-bold text-lg sm:text-xl shadow-[0_0_40px_rgba(255,77,109,0.6)] hover:shadow-[0_0_60px_rgba(255,77,109,0.9)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 border border-pink-200/40"
          >
            <span>Enter Our Room</span>
            <ArrowRight className="w-6 h-6 animate-pulse" />
          </button>
          <span className="mt-2 text-[11px] text-pink-300/70 tracking-wide">
            Your private 3D anime sanctuary awaits
          </span>

          {/* Quick Action Badges */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={sendVirtualHug}
              className="p-2 rounded-xl bg-pink-500/20 hover:bg-pink-500/40 border border-pink-400/30 text-pink-200 text-xs flex items-center gap-1 shadow-sm"
            >
              <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" /> Hug
            </button>
            <button
              onClick={sendVirtualKiss}
              className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 border border-rose-400/30 text-rose-200 text-xs flex items-center gap-1 shadow-sm"
            >
              💋 Kiss
            </button>
            <button
              onClick={() => setActiveModal('video-call')}
              className="p-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/40 border border-purple-400/30 text-purple-200 text-xs flex items-center gap-1 shadow-sm"
            >
              <Video className="w-3.5 h-3.5 text-purple-300" /> Video Call
            </button>
          </div>
        </div>

        {/* Partner B Card */}
        <div className="md:col-span-4 bg-slate-900/70 border border-pink-500/30 rounded-3xl p-6 backdrop-blur-xl shadow-xl hover:border-pink-400/60 transition-all group">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={otherPartner.avatar}
                alt={otherPartner.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-pink-400/50 shadow-lg group-hover:scale-105 transition-transform"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold text-white">{otherPartner.name}</span>
              </div>
              <p className="text-xs text-pink-300 font-mono flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" /> {otherPartner.city}, {otherPartner.country}
              </p>
              <div className="text-xs text-slate-300 font-mono mt-1 bg-black/40 px-2 py-0.5 rounded-md inline-block">
                🕒 Local: {otherPartner.id === 'ren' ? timeStats.partnerATime : timeStats.partnerBTime}
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-300/80 italic line-clamp-2">
            "{otherPartner.currentStatus}"
          </p>
        </div>
      </div>

      {/* BOTTOM SECTION: Today's Love Note & Next Meeting Countdown */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
        {/* Today's Love Note Card */}
        <div 
          onClick={() => openNote(dailyNote)}
          className="cursor-pointer bg-gradient-to-br from-[#1f162e]/90 to-[#140f22]/90 border border-pink-500/30 hover:border-pink-400/60 rounded-3xl p-6 backdrop-blur-xl shadow-lg transition-all duration-300 hover:-translate-y-1 group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-pink-500/20 border border-pink-400/40 flex items-center justify-center">
                <Mail className="w-4 h-4 text-pink-300" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-pink-300">
                Today's Love Note
              </span>
            </div>
            <div className="w-7 h-7 rounded-full bg-rose-600 flex items-center justify-center text-xs text-white shadow-md">
              ❦
            </div>
          </div>

          <h3 className="text-lg font-bold text-pink-100 group-hover:text-pink-300 transition-colors">
            {dailyNote.title}
          </h3>
          <p className="mt-2 text-sm text-pink-200/80 font-handwriting text-xl line-clamp-2">
            "{dailyNote.content.split('\n')[2] || dailyNote.content}"
          </p>

          <div className="mt-4 flex items-center justify-between text-xs text-pink-300/70 border-t border-pink-500/20 pt-3">
            <span>Written with love by {partners[dailyNote.fromId].name} 💌</span>
            <span className="text-pink-400 font-semibold group-hover:underline flex items-center gap-1">
              Read Letter <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Next Meeting Countdown Card */}
        <div 
          onClick={() => setActiveModal('calendar')}
          className="cursor-pointer bg-gradient-to-br from-[#141d33]/90 to-[#0e1626]/90 border border-sky-500/30 hover:border-sky-400/60 rounded-3xl p-6 backdrop-blur-xl shadow-lg transition-all duration-300 hover:-translate-y-1 group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-400/40 flex items-center justify-center">
                <Plane className="w-4 h-4 text-sky-300" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-300">
                Our Next Meeting
              </span>
            </div>
            <span className="text-xs text-sky-300/70 font-mono">Flight AF272</span>
          </div>

          <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
            Haneda Airport Terminal 3 Reunion 🌸
          </h3>

          <div className="mt-3 grid grid-cols-4 gap-2 text-center font-mono">
            <div className="bg-sky-950/60 border border-sky-500/30 rounded-xl p-2">
              <div className="text-xl sm:text-2xl font-bold text-sky-200">
                {timeStats.nextMeetingCountdown.days}
              </div>
              <div className="text-[10px] text-sky-400 uppercase">Days</div>
            </div>
            <div className="bg-sky-950/60 border border-sky-500/30 rounded-xl p-2">
              <div className="text-xl sm:text-2xl font-bold text-sky-200">
                {timeStats.nextMeetingCountdown.hours}
              </div>
              <div className="text-[10px] text-sky-400 uppercase">Hours</div>
            </div>
            <div className="bg-sky-950/60 border border-sky-500/30 rounded-xl p-2">
              <div className="text-xl sm:text-2xl font-bold text-sky-200">
                {timeStats.nextMeetingCountdown.minutes}
              </div>
              <div className="text-[10px] text-sky-400 uppercase">Mins</div>
            </div>
            <div className="bg-sky-950/60 border border-sky-500/30 rounded-xl p-2">
              <div className="text-xl sm:text-2xl font-bold text-sky-200">
                {timeStats.nextMeetingCountdown.seconds}
              </div>
              <div className="text-[10px] text-sky-400 uppercase">Secs</div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-sky-300/70 border-t border-sky-500/20 pt-3">
            <span>Countdown to our longest hug yet</span>
            <span className="text-sky-400 font-semibold group-hover:underline flex items-center gap-1">
              View Itinerary <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
