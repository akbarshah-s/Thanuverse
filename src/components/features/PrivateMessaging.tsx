import React, { useState, useRef, useEffect } from 'react';
import { useKoi } from '../../context/KoiContext';
import { 
  X, 
  Send, 
  Smile, 
  Image as ImageIcon, 
  Mic, 
  MicOff, 
  Heart, 
  Sparkles, 
  Play, 
  Pause,
  CheckCheck,
  Paperclip
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PrivateMessaging: React.FC = () => {
  const {
    isChatOpen,
    setIsChatOpen,
    chatMessages,
    sendMessage,
    toggleReaction,
    currentPerspective,
    partners,
    sendVirtualHug,
    sendVirtualKiss
  } = useKoi();

  const [inputVal, setInputVal] = useState('');
  const [showStickers, setShowStickers] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [chatMessages, isChatOpen]);

  // Voice recording timer
  useEffect(() => {
    let interval: any;
    if (isRecordingVoice) {
      interval = setInterval(() => {
        setVoiceSeconds(s => s + 1);
      }, 1000);
    } else {
      setVoiceSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecordingVoice]);

  if (!isChatOpen) return null;

  const handleSend = () => {
    if (!inputVal.trim()) return;
    sendMessage(inputVal.trim(), 'text');
    setInputVal('');
    setShowStickers(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const stopVoiceAndSend = () => {
    setIsRecordingVoice(false);
    sendMessage(`Voice Note (${voiceSeconds || 4}s) 🎙️`, 'voice');
  };

  const animeStickers = [
    { emoji: '🐱❤️', title: 'Kitty Love' },
    { emoji: '🍙✨', title: 'Onigiri date' },
    { emoji: '🌸🥰', title: 'Sakura Blush' },
    { emoji: '🌙💤', title: 'Goodnight Moon' },
    { emoji: '☕🥐', title: 'Morning Coffee' },
    { emoji: '✈️🗼', title: 'Countdown Flight' },
    { emoji: '💌🕊️', title: 'Love Letter' },
    { emoji: '🥺👉👈', title: 'Shy cuddle' }
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm sm:max-w-md h-[550px] bg-slate-950/95 border-2 border-pink-500/40 rounded-3xl shadow-[0_0_50px_rgba(255,117,151,0.35)] backdrop-blur-2xl flex flex-col overflow-hidden animate-fadeIn">
      {/* HEADER */}
      <div className="p-3.5 bg-gradient-to-r from-pink-950/60 via-purple-950/60 to-slate-950/80 border-b border-pink-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <img
              src={partners[currentPerspective === 'ren' ? 'aoi' : 'ren'].avatar}
              alt="Partner"
              className="w-9 h-9 rounded-full object-cover border-2 border-pink-400"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-950" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
              <span>{partners[currentPerspective === 'ren' ? 'aoi' : 'ren'].name}</span>
              <span className="text-[10px] text-pink-300">
                {partners[currentPerspective === 'ren' ? 'aoi' : 'ren'].city}, {partners[currentPerspective === 'ren' ? 'aoi' : 'ren'].country}
              </span>
            </h4>
            <div className="text-[11px] text-pink-200/60 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Read with love</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={sendVirtualHug}
            className="p-1.5 rounded-lg hover:bg-pink-500/20 text-pink-300 text-xs flex items-center gap-1"
            title="Send Hug"
          >
            <Heart className="w-4 h-4 fill-pink-400 text-pink-400" />
          </button>
          <button
            onClick={() => setIsChatOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* MESSAGES SCROLL AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0a0c1a]/90">
        {chatMessages.map(msg => {
          const isMe = msg.senderId === currentPerspective;
          const sender = partners[msg.senderId];

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group`}
            >
              <div className="flex items-end gap-1.5 max-w-[85%]">
                {!isMe && (
                  <img
                    src={sender.avatar}
                    alt={sender.name}
                    className="w-6 h-6 rounded-full object-cover border border-pink-400/40 mb-1"
                  />
                )}

                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm shadow-md transition-all ${
                    isMe
                      ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-br-none'
                      : 'bg-slate-900 border border-purple-500/30 text-purple-100 rounded-bl-none'
                  }`}
                >
                  {/* Photo Message */}
                  {msg.type === 'photo' && msg.mediaUrl && (
                    <div className="mb-2 rounded-xl overflow-hidden border border-white/20">
                      <img src={msg.mediaUrl} alt="Shared" className="w-full max-h-48 object-cover" />
                    </div>
                  )}

                  {/* Hug or Heart message style */}
                  {msg.type === 'hug' && (
                    <div className="flex items-center gap-2 font-semibold text-pink-200">
                      <Heart className="w-4 h-4 fill-pink-300 text-pink-300 animate-bounce" />
                      <span>{msg.text}</span>
                    </div>
                  )}

                  {msg.type !== 'hug' && <div>{msg.text}</div>}

                  {/* Time & Read status */}
                  <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-white/60">
                    <span>{msg.timestamp}</span>
                    {isMe && <CheckCheck className="w-3.5 h-3.5 text-pink-200" />}
                  </div>
                </div>
              </div>

              {/* Reactions Bar */}
              {msg.reactions && (
                <div className="flex items-center gap-1 mt-1 px-2">
                  {Object.entries(msg.reactions).map(([emoji, count]) => (
                    <span
                      key={emoji}
                      onClick={() => toggleReaction(msg.id, emoji)}
                      className="cursor-pointer bg-black/40 border border-pink-500/20 px-1.5 py-0.5 rounded-full text-xs hover:scale-110"
                    >
                      {emoji} {count}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* STICKER PICKER DRAWER */}
      {showStickers && (
        <div className="p-3 bg-slate-900 border-t border-pink-500/20 grid grid-cols-4 gap-2">
          {animeStickers.map(s => (
            <button
              key={s.title}
              onClick={() => {
                sendMessage(`${s.emoji} (${s.title})`, 'sticker');
                setShowStickers(false);
              }}
              className="p-2 rounded-xl bg-black/40 hover:bg-pink-500/30 border border-pink-500/20 flex flex-col items-center gap-1 transition-transform hover:scale-110"
            >
              <span className="text-2xl">{s.emoji}</span>
              <span className="text-[10px] text-pink-200/70">{s.title}</span>
            </button>
          ))}
        </div>
      )}

      {/* INPUT BAR */}
      <div className="p-3 bg-slate-950 border-t border-pink-500/20">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowStickers(!showStickers)}
            className={`p-2 rounded-xl border ${
              showStickers
                ? 'bg-pink-500/30 border-pink-400 text-pink-200'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Anime Stickers"
          >
            <Smile className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sendMessage("Here is a view from my window right now 🌸", 'photo', '/assets/split_cities.png');
            }}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
            title="Share Photo"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          {isRecordingVoice ? (
            <div className="flex-1 flex items-center justify-between bg-red-950/40 border border-red-500/40 px-3 py-1.5 rounded-xl">
              <div className="flex items-center gap-2 text-red-300 text-xs">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>Recording voice: {voiceSeconds}s</span>
              </div>
              <button
                onClick={stopVoiceAndSend}
                className="px-2.5 py-1 bg-red-600 text-white rounded-lg text-xs font-semibold"
              >
                Send
              </button>
            </div>
          ) : (
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Send words of love..."
              className="flex-1 bg-slate-900 border border-pink-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-pink-200/40 focus:outline-none focus:border-pink-400"
            />
          )}

          {!isRecordingVoice && (
            <button
              onClick={() => setIsRecordingVoice(true)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
              title="Record Voice Note"
            >
              <Mic className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleSend}
            disabled={!inputVal.trim()}
            className="p-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white disabled:opacity-40 shadow-md transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
