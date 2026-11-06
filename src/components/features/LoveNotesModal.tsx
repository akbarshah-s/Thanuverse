import React, { useState } from 'react';
import { useKoi } from '../../context/KoiContext';
import { X, Mail, Plus, Heart, Send, Sparkles, Star } from 'lucide-react';

export const LoveNotesModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    loveNotes,
    openNote,
    sendNewNote,
    currentPerspective,
    partners
  } = useKoi();

  const [isComposing, setIsComposing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [paperStyle, setPaperStyle] = useState<'sakura' | 'parchment' | 'midnight' | 'lavender'>('sakura');

  if (activeModal !== 'notes') return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    sendNewNote(title.trim(), content.trim(), paperStyle);
    setTitle('');
    setContent('');
    setIsComposing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-950/95 border-2 border-pink-500/40 rounded-3xl overflow-hidden flex flex-col shadow-[0_0_100px_rgba(255,117,151,0.3)] max-h-[92vh]">
        
        {/* HEADER */}
        <div className="p-4 bg-gradient-to-r from-pink-950/70 via-slate-950/90 to-purple-950/70 border-b border-pink-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 p-0.5 shadow-lg">
              <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-pink-400" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span>Love Letters &amp; Wax Seals</span>
                <span className="text-[10px] bg-pink-500/20 text-pink-300 border border-pink-500/30 px-2 py-0.5 rounded-full">
                  {loveNotes.length} Letters
                </span>
              </h3>
              <p className="text-xs text-pink-200/70 font-mono">
                Folded with care &bull; Across 9,712 kilometers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsComposing(!isComposing)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>{isComposing ? 'Inbox' : 'Write Letter'}</span>
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
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-950">
          {isComposing ? (
            <form onSubmit={handleSend} className="bg-slate-900 border border-pink-500/30 rounded-3xl p-6 space-y-4">
              <h4 className="font-bold text-white text-sm">
                Write a Sealed Letter (from {partners[currentPerspective].name})
              </h4>

              {/* Stationery selector */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">Stationery Style</label>
                <div className="flex gap-2">
                  {(['sakura', 'parchment', 'midnight', 'lavender'] as const).map(style => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setPaperStyle(style)}
                      className={`px-3 py-1.5 rounded-xl border text-xs capitalize ${
                        paperStyle === style
                          ? 'bg-pink-500/30 border-pink-400 text-pink-200 font-bold'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      {style}
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
                  placeholder="Letter Title (e.g. When the first cherry blossom blooms)"
                  className="w-full bg-slate-950 border border-pink-500/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-400"
                />
              </div>

              <div>
                <textarea
                  rows={6}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="My dearest..."
                  className="w-full bg-slate-950 border border-pink-500/30 rounded-xl px-4 py-3 text-sm text-white font-handwriting text-2xl leading-relaxed focus:outline-none focus:border-pink-400"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsComposing(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-pink-500/30 flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Seal with Wax &amp; Send</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {loveNotes.map(note => {
                const author = partners[note.fromId];

                return (
                  <div
                    key={note.id}
                    onClick={() => openNote(note)}
                    className="cursor-pointer bg-slate-900/80 border border-pink-500/20 hover:border-pink-400/60 rounded-3xl p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={author.avatar}
                          alt={author.name}
                          className="w-7 h-7 rounded-full object-cover border border-pink-400/40"
                        />
                        <span className="text-xs text-slate-300">
                          From <strong>{author.name.split(' ')[0]}</strong>
                        </span>
                      </div>

                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs text-white shadow"
                        style={{ backgroundColor: note.waxColor }}
                        title="Wax Seal"
                      >
                        ❦
                      </div>
                    </div>

                    <h4 className="font-bold text-white text-base group-hover:text-pink-300 transition-colors">
                      {note.title}
                    </h4>

                    <p className="mt-2 text-xs text-pink-200/80 font-handwriting text-lg line-clamp-3">
                      "{note.content}"
                    </p>

                    <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-800">
                      <span>{note.date}</span>
                      <span className="text-pink-400 font-semibold group-hover:underline">
                        Open &bull; Read Letter 💌
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
