import React, { useState } from 'react';
import { useKoi } from '../../context/KoiContext';
import { X, BookHeart, Plus, Heart, Send, Sparkles, MessageCircle } from 'lucide-react';

export const SecretDiary: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    diaryEntries,
    addDiaryEntry,
    addDiaryReply,
    currentPerspective,
    partners
  } = useKoi();

  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<'Missing You' | 'Happy' | 'Warm & Cozy' | 'Counting Days' | 'Dreamy'>('Missing You');
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  if (activeModal !== 'diary') return null;

  const moods: Array<{ label: typeof mood; emoji: string }> = [
    { label: 'Missing You', emoji: '🌙' },
    { label: 'Counting Days', emoji: '✈️' },
    { label: 'Warm & Cozy', emoji: '🍵' },
    { label: 'Happy', emoji: '🌸' },
    { label: 'Dreamy', emoji: '✨' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addDiaryEntry({
      authorId: currentPerspective,
      date: 'Today',
      mood,
      moodEmoji: moods.find(m => m.label === mood)?.emoji || '❤️',
      title: title.trim(),
      content: content.trim(),
      replies: []
    });

    setTitle('');
    setContent('');
    setIsAdding(false);
  };

  const handleReply = (diaryId: string) => {
    const text = replyInputs[diaryId];
    if (!text || !text.trim()) return;

    addDiaryReply(diaryId, text.trim());
    setReplyInputs(prev => ({ ...prev, [diaryId]: '' }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-950/95 border-2 border-sky-500/40 rounded-3xl overflow-hidden flex flex-col shadow-[0_0_100px_rgba(56,189,248,0.25)] max-h-[92vh]">
        
        {/* HEADER */}
        <div className="p-4 bg-gradient-to-r from-sky-950/60 via-slate-950/90 to-indigo-950/60 border-b border-sky-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-600 p-0.5 shadow-lg">
              <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                <BookHeart className="w-5 h-5 text-sky-400" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span>Our Secret Couple Diary</span>
                <span className="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded-full">
                  Private &bull; Just for Two
                </span>
              </h3>
              <p className="text-xs text-sky-200/70 font-mono">
                Longing thoughts, bedtime reflections, and warm whispers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>{isAdding ? 'View Entries' : 'Write Entry'}</span>
            </button>
            <button
              onClick={() => setActiveModal('none')}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950">
          {/* Write New Entry */}
          {isAdding && (
            <form onSubmit={handleSubmit} className="bg-slate-900 border border-sky-500/30 rounded-3xl p-5 space-y-4">
              <h4 className="font-bold text-white text-sm">
                Dear THANUVERSE Diary... (as {partners[currentPerspective].name})
              </h4>

              {/* Mood selector */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">Today's Heart Mood</label>
                <div className="flex flex-wrap gap-2">
                  {moods.map(m => (
                    <button
                      key={m.label}
                      type="button"
                      onClick={() => setMood(m.label)}
                      className={`px-3 py-1.5 rounded-xl border text-xs flex items-center gap-1.5 transition-all ${
                        mood === m.label
                          ? 'bg-sky-500/30 border-sky-400 text-sky-100 font-semibold shadow'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      <span>{m.emoji}</span>
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Entry Title (e.g. The way the dusk felt tonight)"
                  className="w-full bg-slate-950 border border-sky-500/30 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Spill your heart out... what are you feeling across the miles?"
                  className="w-full bg-slate-950 border border-sky-500/30 rounded-xl px-3.5 py-2 text-sm text-white font-handwriting text-xl focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-md hover:brightness-110"
                >
                  Save to Our Diary
                </button>
              </div>
            </form>
          )}

          {/* Entries list */}
          <div className="space-y-4">
            {diaryEntries.map(entry => {
              const author = partners[entry.authorId];

              return (
                <div
                  key={entry.id}
                  className="bg-slate-900/80 border border-slate-800 hover:border-sky-500/30 rounded-3xl p-5 shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={author.avatar}
                        alt={author.name}
                        className="w-8 h-8 rounded-full object-cover border border-sky-400/40"
                      />
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{author.name}</span>
                          <span className="text-[10px] text-slate-400 font-normal">&bull; {entry.date}</span>
                        </div>
                      </div>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-semibold flex items-center gap-1">
                      <span>{entry.moodEmoji}</span>
                      <span>{entry.mood}</span>
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white mb-2">{entry.title}</h4>
                  <p className="font-handwriting text-xl text-sky-100/90 leading-relaxed whitespace-pre-line mb-4">
                    {entry.content}
                  </p>

                  {/* Replies thread */}
                  {entry.replies && entry.replies.length > 0 && (
                    <div className="space-y-2 border-t border-slate-800 pt-3">
                      {entry.replies.map((reply, idx) => {
                        const replyAuthor = partners[reply.authorId];
                        return (
                          <div key={idx} className="bg-slate-950/60 rounded-xl p-3 border border-pink-500/20 flex items-start gap-2.5">
                            <img
                              src={replyAuthor.avatar}
                              alt={replyAuthor.name}
                              className="w-6 h-6 rounded-full object-cover border border-pink-400/30"
                            />
                            <div>
                              <div className="text-[11px] font-bold text-pink-300">
                                {replyAuthor.name} <span className="font-normal text-slate-500 text-[10px]">&bull; {reply.date}</span>
                              </div>
                              <p className="font-handwriting text-base text-slate-200 mt-0.5">
                                "{reply.text}"
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Add reply inline */}
                  <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-800/60">
                    <input
                      type="text"
                      value={replyInputs[entry.id] || ''}
                      onChange={(e) => setReplyInputs(prev => ({ ...prev, [entry.id]: e.target.value }))}
                      placeholder={`Reply as ${partners[currentPerspective].name.split(' ')[0]}...`}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                    />
                    <button
                      onClick={() => handleReply(entry.id)}
                      className="p-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white"
                      title="Send Reply"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
