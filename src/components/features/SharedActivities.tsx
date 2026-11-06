import React, { useState } from 'react';
import { useKoi } from '../../context/KoiContext';
import { 
  X, 
  Sparkles, 
  Flame, 
  HelpCircle, 
  Palette, 
  Send, 
  Heart,
  Moon,
  ChevronRight
} from 'lucide-react';
import { DoodleCanvas } from '../../canvas/DoodleCanvas';
import { COUPLE_QUESTIONS } from '../../data/mockData';

export const SharedActivities: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    wishLanterns,
    releaseWishLantern,
    currentPerspective,
    partners,
    addMemory
  } = useKoi();

  const [activeTab, setActiveTab] = useState<'lanterns' | 'questions' | 'doodle'>('lanterns');

  // Wish Lantern form state
  const [wishText, setWishText] = useState('');
  const [lanternColor, setLanternColor] = useState('#ff7597');

  // Question index state
  const [currentQIndex, setCurrentQIndex] = useState(0);

  if (activeModal !== 'activity') return null;

  const currentQ = COUPLE_QUESTIONS[currentQIndex % COUPLE_QUESTIONS.length];

  const handleReleaseWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishText.trim()) return;
    releaseWishLantern(wishText.trim(), lanternColor);
    setWishText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-950/95 border-2 border-rose-500/40 rounded-3xl overflow-hidden flex flex-col shadow-[0_0_100px_rgba(244,63,94,0.3)] max-h-[92vh]">
        
        {/* HEADER */}
        <div className="p-4 bg-gradient-to-r from-rose-950/70 via-slate-950/90 to-purple-950/70 border-b border-rose-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-purple-600 p-0.5 shadow-lg">
              <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-rose-400" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span>Shared Activities &amp; Starlight Wishes</span>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full">
                  Interactive Together
                </span>
              </h3>
              <p className="text-xs text-rose-200/70 font-mono">
                Floating lanterns, intimacy prompts, and shared love canvas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 bg-slate-900 border border-rose-500/30 rounded-xl text-xs">
              <button
                onClick={() => setActiveTab('lanterns')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'lanterns' ? 'bg-rose-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Wish Lanterns
              </button>
              <button
                onClick={() => setActiveTab('questions')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'questions' ? 'bg-rose-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Questions for Us
              </button>
              <button
                onClick={() => setActiveTab('doodle')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'doodle' ? 'bg-rose-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Love Doodle
              </button>
            </div>

            <button
              onClick={() => setActiveModal('none')}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TAB 1: WISH LANTERNS */}
        {activeTab === 'lanterns' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950">
            {/* Input Form */}
            <form onSubmit={handleReleaseWish} className="bg-slate-900/90 border border-rose-500/30 rounded-3xl p-5 shadow-lg">
              <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold mb-2">
                <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
                <span>Light a Sky Lantern from {partners[currentPerspective].name.split(' ')[0]}</span>
              </div>

              <input
                type="text"
                value={wishText}
                onChange={(e) => setWishText(e.target.value)}
                placeholder="Write your secret wish for our future..."
                className="w-full bg-slate-950 border border-rose-500/30 rounded-2xl px-4 py-3 text-sm text-white placeholder-rose-200/40 focus:outline-none focus:border-rose-400 font-handwriting text-xl"
              />

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Lantern Glow:</span>
                  {['#ff7597', '#c084fc', '#38bdf8', '#fef08a'].map(col => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setLanternColor(col)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${
                        lanternColor === col ? 'scale-125 border-white shadow-lg' : 'border-transparent opacity-70'
                      }`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={!wishText.trim()}
                  className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-400 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-500/30 disabled:opacity-40 flex items-center gap-2 active:scale-95 transition-all"
                >
                  <Flame className="w-4 h-4" />
                  <span>Release into Night Sky</span>
                </button>
              </div>
            </form>

            {/* Released Lanterns List in Shared Sky */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2">
                Floating Lanterns in Our Shared Sky ({wishLanterns.length})
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {wishLanterns.map(wish => (
                  <div
                    key={wish.id}
                    className="relative bg-slate-900/80 border rounded-2xl p-4 shadow-lg overflow-hidden animate-float"
                    style={{ borderColor: `${wish.color}60` }}
                  >
                    <div
                      className="absolute -right-4 -top-4 w-16 h-16 rounded-full blur-xl opacity-30"
                      style={{ backgroundColor: wish.color }}
                    />
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="font-semibold" style={{ color: wish.color }}>
                        {partners[wish.authorId].name.split(' ')[0]}’s Lantern
                      </span>
                      <span className="font-mono text-[10px]">{wish.createdAt}</span>
                    </div>
                    <p className="font-handwriting text-xl text-white/95 leading-relaxed">
                      "{wish.text}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: QUESTIONS FOR US */}
        {activeTab === 'questions' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950">
            <div className="bg-gradient-to-br from-purple-950/40 via-slate-900 to-pink-950/40 border border-purple-500/30 rounded-3xl p-6 text-center shadow-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-3">
                <HelpCircle className="w-4 h-4" />
                <span>Today's Intimacy Prompt</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white max-w-xl mx-auto leading-relaxed">
                "{currentQ.question}"
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mt-6">
                <div className="bg-slate-950/70 border border-sky-500/30 rounded-2xl p-4">
                  <div className="text-xs font-bold text-sky-400 mb-1">
                    {partners.ren.name.split(' ')[0]}’s Answer:
                  </div>
                  <p className="font-handwriting text-lg text-sky-100">
                    "{currentQ.renAnswer}"
                  </p>
                </div>

                <div className="bg-slate-950/70 border border-pink-500/30 rounded-2xl p-4">
                  <div className="text-xs font-bold text-pink-400 mb-1">
                    {partners.aoi.name.split(' ')[0]}’s Answer:
                  </div>
                  <p className="font-handwriting text-lg text-pink-100">
                    "{currentQ.aoiAnswer}"
                  </p>
                </div>
              </div>

              <button
                onClick={() => setCurrentQIndex(prev => prev + 1)}
                className="mt-6 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-all"
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: LOVE DOODLE CANVAS */}
        {activeTab === 'doodle' && (
          <div className="flex-1 overflow-y-auto p-4 bg-slate-950 flex flex-col items-center">
            <DoodleCanvas
              currentPartnerName={partners[currentPerspective].name}
              onSave={(dataUrl) => {
                addMemory({
                  title: 'Shared Love Doodle',
                  date: 'Today',
                  location: 'THANUVERSE Live Canvas',
                  imageUrl: dataUrl,
                  description: 'Doodled together while talking on late night call ❤️',
                  category: 'call',
                  pinned: true,
                  tags: ['Doodle', 'Art', 'Love']
                });
              }}
            />
          </div>
        )}

      </div>
    </div>
  );
};
