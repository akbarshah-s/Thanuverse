import React, { useState, useEffect, useRef } from 'react';
import { useKoi } from '../../context/KoiContext';
import { 
  X, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Heart, 
  Sparkles, 
  Camera, 
  Maximize, 
  Volume2, 
  Film,
  Smile,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LiveTogetherModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    partnerA,
    partnerB,
    timeStats,
    currentPerspective,
    sendVirtualHug,
    sendVirtualKiss
  } = useKoi();

  const isVideo = activeModal === 'video-call';
  const isVoice = activeModal === 'voice-call';
  const isOpen = isVideo || isVoice;

  const [callDuration, setCallDuration] = useState(0);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'normal' | 'anime-glow' | 'sakura-warmth' | 'lofi-grain'>('anime-glow');
  const [hasRealCam, setHasRealCam] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState<Array<{ id: number; emoji: string; x: number }>>([]);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Call timer
  useEffect(() => {
    if (!isOpen) {
      setCallDuration(0);
      return;
    }
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  // Request real camera if available
  useEffect(() => {
    if (isOpen && isVideo && !isVideoMuted) {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: false })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setHasRealCam(true);
          }
        })
        .catch(() => {
          setHasRealCam(false);
        });
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, [isOpen, isVideo, isVideoMuted]);

  if (!isOpen) return null;

  const formatCallTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const popReaction = (emoji: string) => {
    const id = Date.now() + Math.random();
    setFloatingEmojis(prev => [...prev, { id, emoji, x: 20 + Math.random() * 60 }]);
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(e => e.id !== id));
    }, 2500);

    confetti({
      particleCount: 20,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-2 sm:p-4 animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[750px] bg-slate-950/90 border border-pink-500/40 rounded-3xl overflow-hidden flex flex-col shadow-[0_0_100px_rgba(255,117,151,0.3)]">
        
        {/* Floating Call Reactions Overlay */}
        <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
          {floatingEmojis.map(item => (
            <div
              key={item.id}
              className="absolute text-4xl animate-float"
              style={{
                left: `${item.x}%`,
                bottom: '15%',
                transition: 'all 2.5s ease-out',
                animationDuration: '2.5s'
              }}
            >
              {item.emoji}
            </div>
          ))}
        </div>

        {/* TOP STATUS BAR */}
        <div className="flex items-center justify-between p-4 bg-slate-900/80 border-b border-pink-500/20 z-20">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">
                  {partnerA.name.split(' ')[0]} &amp; {partnerB.name.split(' ')[0]}
                </span>
                <span className="text-[10px] bg-pink-500/20 text-pink-300 border border-pink-500/40 px-2 py-0.5 rounded-full font-mono">
                  {isVideo ? 'HD Video Call' : 'Encrypted Voice Call'}
                </span>
              </div>
              <div className="text-xs text-pink-200/60 font-mono mt-0.5">
                Duration: <strong className="text-white">{formatCallTime(callDuration)}</strong> &bull; Distance: 9,712 km
              </div>
            </div>
          </div>

          {/* Filter selector */}
          {isVideo && (
            <div className="hidden sm:flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-xl border border-purple-500/30 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-pink-300" />
              <span className="text-slate-400">Filter:</span>
              <button
                onClick={() => setActiveFilter('anime-glow')}
                className={`px-2 py-0.5 rounded-md ${activeFilter === 'anime-glow' ? 'bg-pink-500/40 text-pink-200' : 'text-slate-400'}`}
              >
                Anime Glow
              </button>
              <button
                onClick={() => setActiveFilter('sakura-warmth')}
                className={`px-2 py-0.5 rounded-md ${activeFilter === 'sakura-warmth' ? 'bg-pink-500/40 text-pink-200' : 'text-slate-400'}`}
              >
                Sakura Warmth
              </button>
              <button
                onClick={() => setActiveFilter('lofi-grain')}
                className={`px-2 py-0.5 rounded-md ${activeFilter === 'lofi-grain' ? 'bg-pink-500/40 text-pink-200' : 'text-slate-400'}`}
              >
                Lo-Fi Film
              </button>
            </div>
          )}

          <button
            onClick={() => setActiveModal('none')}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CALL VIEWPORT: DUAL SCREENS */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 p-3 relative overflow-hidden bg-slate-950">
          
          {/* SCREEN 1: PARTNER A (TOKYO) */}
          <div className="relative rounded-2xl overflow-hidden border border-sky-500/30 bg-slate-900 flex items-center justify-center shadow-inner group">
            {/* Background Stream Video / Anime Feed */}
            {hasRealCam && currentPerspective === 'ren' && !isVideoMuted ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${activeFilter === 'anime-glow' ? 'brightness-110 contrast-105 saturate-125' : ''}`}
              />
            ) : (
              <div 
                className="w-full h-full bg-cover bg-center flex flex-col justify-between p-4"
                style={{
                  backgroundImage: `url('/assets/balcony_galaxy.jpg')`,
                  filter: activeFilter === 'anime-glow' ? 'brightness(1.05) saturate(1.2)' : 'none'
                }}
              >
                <div className="flex justify-between items-start">
                  <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-sky-200 border border-sky-400/30">
                    {partnerA.name} &bull; {partnerA.city} ({timeStats.partnerATime})
                  </span>
                  <div className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md text-[10px] text-emerald-400 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Connected
                  </div>
                </div>

                {/* Animated Voice Waves if voice call */}
                {isVoice && (
                  <div className="flex items-center justify-center gap-1 my-auto">
                    {[12, 24, 38, 52, 28, 44, 20, 32, 16].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-sky-400 rounded-full animate-pulse"
                        style={{ height: `${h}px`, animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                )}

                <div className="bg-black/60 backdrop-blur-md p-2.5 rounded-xl border border-sky-500/20 text-xs text-sky-200 max-w-xs">
                  "Seeing your smile across the ocean makes every busy day melt away."
                </div>
              </div>
            )}
          </div>

          {/* SCREEN 2: PARTNER B (PARIS) */}
          <div className="relative rounded-2xl overflow-hidden border border-pink-500/30 bg-slate-900 flex items-center justify-center shadow-inner group">
            {hasRealCam && currentPerspective === 'aoi' && !isVideoMuted ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${activeFilter === 'anime-glow' ? 'brightness-110 contrast-105 saturate-125' : ''}`}
              />
            ) : (
              <div 
                className="w-full h-full bg-cover bg-center flex flex-col justify-between p-4"
                style={{
                  backgroundImage: `url('/assets/split_cities.png')`,
                  filter: activeFilter === 'anime-glow' ? 'brightness(1.05) saturate(1.2)' : 'none'
                }}
              >
                <div className="flex justify-between items-start">
                  <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-pink-200 border border-pink-400/30">
                    {partnerB.name} &bull; {partnerB.city} ({timeStats.partnerBTime})
                  </span>
                  <div className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md text-[10px] text-emerald-400 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Connected
                  </div>
                </div>

                {isVoice && (
                  <div className="flex items-center justify-center gap-1 my-auto">
                    {[16, 32, 48, 20, 56, 36, 42, 22, 14].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-pink-400 rounded-full animate-pulse"
                        style={{ height: `${h}px`, animationDelay: `${i * 0.12}s` }}
                      />
                    ))}
                  </div>
                )}

                <div className="bg-black/60 backdrop-blur-md p-2.5 rounded-xl border border-pink-500/20 text-xs text-pink-200 max-w-xs ml-auto text-right">
                  "Only 18 more days until we don't have to look through glass."
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM CALL CONTROLS */}
        <div className="p-4 bg-slate-900/90 border-t border-pink-500/20 flex flex-wrap items-center justify-between gap-3 z-20">
          {/* Reaction Bar */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-pink-300 hidden sm:inline">Floating reactions:</span>
            {['❤️', '💋', '🌸', '✨', '☕', '💌'].map(emoji => (
              <button
                key={emoji}
                onClick={() => popReaction(emoji)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-pink-500/30 flex items-center justify-center text-lg transition-transform hover:scale-125 active:scale-95 border border-white/10"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Primary Action Buttons */}
          <div className="flex items-center gap-3 mx-auto sm:mx-0">
            {/* Mic Toggle */}
            <button
              onClick={() => setIsMicMuted(!isMicMuted)}
              className={`p-3.5 rounded-2xl border transition-all ${
                isMicMuted 
                  ? 'bg-red-500/30 border-red-400 text-red-200' 
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-white'
              }`}
              title={isMicMuted ? 'Unmute Mic' : 'Mute Mic'}
            >
              {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Video Toggle */}
            {isVideo && (
              <button
                onClick={() => setIsVideoMuted(!isVideoMuted)}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isVideoMuted 
                    ? 'bg-red-500/30 border-red-400 text-red-200' 
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-white'
                }`}
                title={isVideoMuted ? 'Turn Camera On' : 'Turn Camera Off'}
              >
                {isVideoMuted ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>
            )}

            {/* Hug button */}
            <button
              onClick={sendVirtualHug}
              className="p-3.5 rounded-2xl bg-pink-500/30 hover:bg-pink-500/50 border border-pink-400 text-pink-200 transition-all shadow-md"
              title="Send Warm Hug overlay"
            >
              <Heart className="w-5 h-5 fill-pink-400 text-pink-400" />
            </button>

            {/* End Call Button */}
            <button
              onClick={() => setActiveModal('none')}
              className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-rose-600/40 active:scale-95 transition-all"
            >
              <PhoneOff className="w-5 h-5" />
              <span>End Call</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
