import React from 'react';
import { useKoi } from '../../context/KoiContext';
import { Heart, Sparkles, X, Mail, Send } from 'lucide-react';

export const EmotionalOverlays: React.FC = () => {
  const {
    activeOverlay,
    overlaySender,
    dismissOverlay,
    partners,
    selectedNote,
    closeNote,
    currentPerspective,
    sendNewNote
  } = useKoi();

  const [replyText, setReplyText] = React.useState('');
  const [isReplying, setIsReplying] = React.useState(false);

  const senderName = overlaySender ? partners[overlaySender].name : 'Your love';
  const senderCity = overlaySender ? partners[overlaySender].city : '';

  return (
    <>
      {/* VIRTUAL HUG OVERLAY */}
      {activeOverlay === 'hug' && (
        <div
          onClick={dismissOverlay}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md cursor-pointer transition-opacity duration-500 animate-fadeIn"
        >
          <div className="relative flex flex-col items-center p-8 max-w-md mx-4 text-center">
            {/* Glowing Aura Ring */}
            <div className="absolute -inset-10 rounded-full bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-rose-500/30 blur-3xl animate-pulse-slow" />

            {/* Hug Avatar / Arms Animation */}
            <div className="relative w-36 h-36 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-pink-400/60 animate-ping opacity-40" />
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 p-1 shadow-[0_0_50px_rgba(255,117,151,0.8)] flex items-center justify-center">
                <Heart className="w-16 h-16 text-white fill-white animate-heartbeat" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-rose-100 to-pink-300 font-sans tracking-wide">
              {senderName} is wrapping you in a warm hug
            </h3>
            <p className="text-pink-200/90 mt-2 text-sm max-w-xs font-light">
              Distance can’t stop warmth. From {senderCity} across {9712} kilometers straight to your heart.
            </p>

            <span className="mt-6 text-xs text-pink-300/60 border border-pink-400/30 px-3 py-1 rounded-full">
              Tap anywhere to hold this feeling
            </span>
          </div>
        </div>
      )}

      {/* VIRTUAL KISS OVERLAY */}
      {activeOverlay === 'kiss' && (
        <div
          onClick={dismissOverlay}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md cursor-pointer transition-opacity duration-500"
        >
          <div className="relative flex flex-col items-center p-8 max-w-md mx-4 text-center">
            <div className="absolute -inset-8 rounded-full bg-rose-500/20 blur-2xl animate-pulse" />

            <div className="relative flex items-center justify-center mb-6">
              <div className="text-7xl animate-bounce">💋</div>
              <Sparkles className="absolute -top-3 -right-3 w-8 h-8 text-yellow-300 animate-spin" />
              <Sparkles className="absolute -bottom-2 -left-4 w-6 h-6 text-pink-300 animate-pulse" />
            </div>

            <h3 className="text-3xl font-handwriting font-bold text-pink-200 tracking-wider">
              A tender kiss from {senderName}
            </h3>
            <p className="text-pink-100/80 mt-2 text-sm italic">
              "Until our foreheads touch again under the stars."
            </p>
          </div>
        </div>
      )}

      {/* I MISS YOU OVERLAY */}
      {activeOverlay === 'missyou' && (
        <div
          onClick={dismissOverlay}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <div className="relative flex flex-col items-center bg-slate-900/90 border border-pink-500/50 rounded-3xl p-6 shadow-[0_0_60px_rgba(255,105,180,0.5)] backdrop-blur-xl animate-float">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-pink-500/20 border border-pink-400 flex items-center justify-center">
                <Heart className="w-6 h-6 text-pink-400 fill-pink-400 animate-ping" />
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold uppercase tracking-wider text-pink-400">
                  Love Pulse Received
                </div>
                <div className="text-lg font-bold text-white">
                  {senderName} is missing you right now! ❤️
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs text-pink-200/70">
              Your hearts are synchronized across the ocean
            </div>
          </div>
        </div>
      )}

      {/* LOVE NOTE READER MODAL */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="relative w-full max-w-lg bg-gradient-to-b from-[#251733] to-[#120d20] border-2 border-pink-400/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(244,114,182,0.3)]">
            {/* Close Button */}
            <button
              onClick={closeNote}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-pink-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Note Header */}
            <div className="flex items-center justify-between border-b border-pink-500/20 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-500/20 border border-pink-400/40 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-pink-300" />
                </div>
                <div>
                  <h4 className="font-semibold text-pink-100 text-sm">
                    Letter from {partners[selectedNote.fromId].name}
                  </h4>
                  <span className="text-xs text-pink-300/70">{selectedNote.date}</span>
                </div>
              </div>

              {/* Wax Seal */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shadow-lg border-2 border-white/30 text-xs font-bold text-white"
                style={{ backgroundColor: selectedNote.waxColor }}
                title="Wax Seal"
              >
                ❦
              </div>
            </div>

            {/* Note Parchment Body */}
            <div className="bg-[#1b152b]/80 border border-pink-500/20 rounded-2xl p-6 relative overflow-hidden shadow-inner">
              <div className="absolute top-2 right-3 text-3xl opacity-10 select-none">🌸</div>
              <h3 className="text-xl font-bold text-pink-200 font-sans mb-3">
                {selectedNote.title}
              </h3>
              <div className="font-handwriting text-2xl text-pink-100/95 leading-relaxed whitespace-pre-line tracking-wide">
                {selectedNote.content}
              </div>
            </div>

            {/* Reply Drawer */}
            <div className="mt-5">
              {!isReplying ? (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-pink-300/60 italic">
                    "Distance separates places, not hearts."
                  </span>
                  <button
                    onClick={() => setIsReplying(true)}
                    className="px-4 py-2 rounded-xl bg-pink-500/30 hover:bg-pink-500/50 border border-pink-400/50 text-pink-100 text-xs font-semibold flex items-center gap-2 transition-all shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" /> Write Reply Note
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write your sweet words back..."
                    rows={3}
                    className="w-full bg-black/40 border border-pink-400/40 rounded-xl p-3 text-sm text-pink-100 placeholder-pink-300/40 focus:outline-none focus:border-pink-400 font-handwriting text-lg"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsReplying(false)}
                      className="px-3 py-1.5 text-xs text-pink-300 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (replyText.trim()) {
                          sendNewNote(`Reply: ${selectedNote.title}`, replyText);
                          setReplyText('');
                          setIsReplying(false);
                          closeNote();
                        }
                      }}
                      className="px-4 py-1.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-semibold rounded-xl shadow-lg hover:brightness-110 flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" /> Send Letter
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
