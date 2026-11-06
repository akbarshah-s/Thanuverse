import React, { useState } from 'react';
import { useKoi } from '../../context/KoiContext';
import { 
  X, 
  Image as ImageIcon, 
  Plus, 
  Calendar, 
  MapPin, 
  Tag, 
  Heart, 
  Sparkles, 
  Pin,
  Upload
} from 'lucide-react';

export const OurMemories: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    memories,
    addMemory
  } = useKoi();

  const [activeTab, setActiveTab] = useState<'wall' | 'timeline' | 'add'>('wall');

  // Form states for new memory
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('/assets/balcony_galaxy.jpg');
  const [category, setCategory] = useState<'trip' | 'call' | 'milestone' | 'letter'>('trip');

  if (activeModal !== 'memories') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addMemory({
      title: title.trim(),
      date: date || 'Today',
      location: location || 'Our Shared Sky',
      description: description.trim() || 'A cherished moment in our universe.',
      imageUrl: imageUrl || '/assets/balcony_galaxy.jpg',
      category,
      pinned: true,
      tags: [category, 'Love', 'THANUVERSE']
    });

    setTitle('');
    setDate('');
    setLocation('');
    setDescription('');
    setActiveTab('wall');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-950/95 border-2 border-pink-500/40 rounded-3xl overflow-hidden flex flex-col shadow-[0_0_100px_rgba(255,117,151,0.3)] max-h-[92vh]">
        
        {/* HEADER */}
        <div className="p-4 bg-gradient-to-r from-pink-950/80 via-slate-950/90 to-purple-950/80 border-b border-pink-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 p-0.5 shadow-lg">
              <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-pink-400" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span>Our Memories &amp; Anime Wall</span>
                <span className="text-[10px] bg-pink-500/20 text-pink-300 border border-pink-500/30 px-2 py-0.5 rounded-full">
                  {memories.length} Moments Saved
                </span>
              </h3>
              <p className="text-xs text-pink-200/70 font-mono">
                Every polaroid, late-night call, and flight ticket we cherish
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tabs */}
            <div className="flex items-center p-1 bg-slate-900 border border-pink-500/30 rounded-xl text-xs">
              <button
                onClick={() => setActiveTab('wall')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'wall' ? 'bg-pink-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Memory Wall
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'timeline' ? 'bg-pink-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => setActiveTab('add')}
                className={`px-3 py-1 rounded-lg flex items-center gap-1 transition-all ${
                  activeTab === 'add' ? 'bg-pink-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Polaroid</span>
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

        {/* TAB 1: MEMORY WALL (FAIRY LIGHTS CORKBOARD / POLAROID WALL) */}
        {activeTab === 'wall' && (
          <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-[#131024] to-[#0b0a14]">
            {/* Fairy Lights string graphic across top */}
            <div className="flex justify-around mb-6 pointer-events-none opacity-80">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-300 shadow-[0_0_12px_#fef08a] animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                  <div className="w-[1px] h-3 bg-yellow-100/30" />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {memories.map(mem => (
                <div
                  key={mem.id}
                  className="group relative bg-[#1c1833] border border-pink-400/30 rounded-2xl p-3 shadow-xl hover:shadow-[0_0_30px_rgba(255,117,151,0.3)] transition-all duration-300 hover:-translate-y-1.5"
                >
                  {/* Washi Tape at Top */}
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 h-5 bg-pink-400/50 backdrop-blur-sm border border-white/40 -rotate-2 rounded-sm shadow-sm z-10" />

                  {/* Polaroid Frame */}
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 mb-3 bg-black">
                    <img
                      src={mem.imageUrl}
                      alt={mem.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] text-pink-300 font-mono">
                      {mem.date}
                    </div>
                  </div>

                  <h4 className="font-bold text-pink-100 text-sm group-hover:text-pink-300 transition-colors">
                    {mem.title}
                  </h4>
                  <p className="text-xs text-sky-300 font-mono flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {mem.location}
                  </p>
                  <p className="mt-2 text-xs text-pink-100/80 font-handwriting text-base leading-snug">
                    "{mem.description}"
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-pink-500/20">
                    {mem.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-[10px] bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
            <div className="relative border-l-2 border-pink-500/40 ml-4 sm:ml-8 space-y-8 py-4">
              {memories.map((mem, index) => (
                <div key={mem.id} className="relative pl-6 sm:pl-8 group">
                  {/* Timeline Node Dot */}
                  <div className="absolute -left-2.5 top-1.5 w-5 h-5 rounded-full bg-pink-600 border-4 border-slate-950 shadow-[0_0_12px_rgba(255,117,151,0.8)] group-hover:scale-125 transition-transform" />

                  <div className="bg-slate-900/80 border border-pink-500/30 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-lg max-w-xl">
                    <div className="flex items-center justify-between text-xs text-pink-400 font-mono mb-1">
                      <span>{mem.date}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {mem.location}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white mb-2">{mem.title}</h4>
                    <p className="text-sm text-pink-100/90 font-handwriting text-lg leading-relaxed mb-3">
                      {mem.description}
                    </p>

                    <div className="rounded-xl overflow-hidden border border-white/20 max-h-48">
                      <img src={mem.imageUrl} alt={mem.title} className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ADD NEW POLAROID */}
        {activeTab === 'add' && (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 bg-slate-950 space-y-4 max-w-xl mx-auto w-full">
            <h4 className="font-bold text-pink-200 text-base mb-2">Pin a New Memory to Our Wall</h4>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Memory Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 4 AM Video Call Under the Same Stars"
                className="w-full bg-slate-900 border border-pink-500/30 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-pink-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="e.g. November 2026"
                  className="w-full bg-slate-900 border border-pink-500/30 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-pink-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Tokyo & Paris Horizon"
                  className="w-full bg-slate-900 border border-pink-500/30 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-pink-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Story / Note</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write what made this moment unforgettable..."
                className="w-full bg-slate-900 border border-pink-500/30 rounded-xl px-3.5 py-2 text-sm text-white font-handwriting text-lg focus:outline-none focus:border-pink-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Choose Anime Aesthetic Photo</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { url: '/assets/balcony_galaxy.jpg', name: 'Balcony Galaxy' },
                  { url: '/assets/split_cities.png', name: 'Two Rooms' },
                  { url: '/assets/moon_connection.jpg', name: 'Moon Connection' }
                ].map(img => (
                  <div
                    key={img.url}
                    onClick={() => setImageUrl(img.url)}
                    className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                      imageUrl === img.url ? 'border-pink-400 ring-2 ring-pink-500/50' : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={img.name} className="w-full h-16 object-cover" />
                    <div className="text-[10px] text-center p-1 bg-black/60 text-slate-300 truncate">{img.name}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-pink-500/30 transition-all active:scale-95"
              >
                Pin Polaroid to Memory Wall ✨
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
