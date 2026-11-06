import React, { useState } from 'react';
import { useKoi } from '../../context/KoiContext';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  Plane, 
  Heart, 
  Plus, 
  CheckCircle2, 
  Circle,
  MapPin, 
  Luggage,
  Sparkles
} from 'lucide-react';

export const OurTimeCalendar: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    partnerA,
    partnerB,
    timeStats,
    calendarEvents,
    addCalendarEvent
  } = useKoi();

  const [activeTab, setActiveTab] = useState<'countdown' | 'calendar' | 'packing'>('countdown');

  // Form states
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventType, setEventType] = useState<'date-night' | 'call' | 'flight' | 'anniversary'>('date-night');
  const [eventNotes, setEventNotes] = useState('');

  // Packing list state
  const [packingItems, setPackingItems] = useState([
    { id: 1, text: 'Passport & Flight AF272 boarding pass', checked: true },
    { id: 2, text: `${partnerA.name}’s cream wool scarf & warm gloves`, checked: true },
    { id: 3, text: 'Handwritten love letters bundle in ribbon', checked: true },
    { id: 4, text: 'Power adapter (EU to Japan type A)', checked: false },
    { id: 5, text: 'Favorite French almond tea for our kotatsu', checked: false },
    { id: 6, text: 'Instant polaroid camera with extra film', checked: true }
  ]);

  if (activeModal !== 'calendar') return null;

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    addCalendarEvent({
      title: eventTitle.trim(),
      date: eventDate || new Date().toISOString(),
      type: eventType,
      notes: eventNotes.trim()
    });

    setEventTitle('');
    setEventDate('');
    setEventNotes('');
    setActiveTab('calendar');
  };

  const togglePacking = (id: number) => {
    setPackingItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-950/95 border-2 border-yellow-500/40 rounded-3xl overflow-hidden flex flex-col shadow-[0_0_100px_rgba(254,240,138,0.2)] max-h-[92vh]">
        
        {/* HEADER */}
        <div className="p-4 bg-gradient-to-r from-yellow-950/60 via-slate-950/90 to-amber-950/60 border-b border-yellow-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 p-0.5 shadow-lg">
              <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-yellow-400" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span>Our Time &amp; Reunion Planner</span>
                <span className="text-[10px] bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-2 py-0.5 rounded-full font-mono">
                  +8h Timezone Bridge
                </span>
              </h3>
              <p className="text-xs text-yellow-200/70 font-mono">
                When you wake up, I watch the stars &bull; Counting down to Haneda
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 bg-slate-900 border border-yellow-500/30 rounded-xl text-xs">
              <button
                onClick={() => setActiveTab('countdown')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'countdown' ? 'bg-yellow-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Reunion
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'calendar' ? 'bg-yellow-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Calendar
              </button>
              <button
                onClick={() => setActiveTab('packing')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'packing' ? 'bg-yellow-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Packing
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

        {/* TAB 1: REUNION COUNTDOWN & TIME CLOCKS */}
        {activeTab === 'countdown' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950">
            {/* Main Big Countdown Box */}
            <div className="relative rounded-3xl p-6 bg-gradient-to-br from-yellow-950/40 via-slate-900/90 to-amber-950/40 border border-yellow-500/30 text-center shadow-xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-semibold mb-3">
                <Plane className="w-4 h-4" />
                <span>Next Meeting: Flight AF272</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Reunion at Arrival Gate B 🌸
              </h2>
              <p className="text-xs text-yellow-200/70 mt-1">
                "No more screens, no more time zones. Just us."
              </p>

              {/* Countdown Digits */}
              <div className="grid grid-cols-4 gap-3 max-w-md mx-auto my-6 font-mono">
                <div className="bg-yellow-950/80 border border-yellow-500/40 rounded-2xl p-3 shadow-lg">
                  <div className="text-3xl sm:text-4xl font-extrabold text-yellow-200">
                    {timeStats.nextMeetingCountdown.days}
                  </div>
                  <div className="text-[10px] text-yellow-400 uppercase tracking-widest mt-1">Days</div>
                </div>
                <div className="bg-yellow-950/80 border border-yellow-500/40 rounded-2xl p-3 shadow-lg">
                  <div className="text-3xl sm:text-4xl font-extrabold text-yellow-200">
                    {timeStats.nextMeetingCountdown.hours}
                  </div>
                  <div className="text-[10px] text-yellow-400 uppercase tracking-widest mt-1">Hours</div>
                </div>
                <div className="bg-yellow-950/80 border border-yellow-500/40 rounded-2xl p-3 shadow-lg">
                  <div className="text-3xl sm:text-4xl font-extrabold text-yellow-200">
                    {timeStats.nextMeetingCountdown.minutes}
                  </div>
                  <div className="text-[10px] text-yellow-400 uppercase tracking-widest mt-1">Mins</div>
                </div>
                <div className="bg-yellow-950/80 border border-yellow-500/40 rounded-2xl p-3 shadow-lg">
                  <div className="text-3xl sm:text-4xl font-extrabold text-yellow-200">
                    {timeStats.nextMeetingCountdown.seconds}
                  </div>
                  <div className="text-[10px] text-yellow-400 uppercase tracking-widest mt-1">Secs</div>
                </div>
              </div>

              <div className="text-xs text-yellow-200/60 italic">
                Destination: Haneda Airport Terminal 3 (edit this event in your calendar)
              </div>
            </div>

            {/* Dual Timezones & Overlap Hours */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-sky-500/30 rounded-2xl p-4">
                <div className="flex items-center justify-between text-xs text-sky-300 font-mono">
                  <span>{partnerA.city}, {partnerA.country} ({partnerA.name})</span>
                  <span className="font-bold">{partnerA.timezone}</span>
                </div>
                <div className="text-2xl font-mono font-bold text-white mt-1">
                  {timeStats.partnerATime}
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  {partnerA.name} is stargazing from the balcony or reviewing the day.
                </p>
              </div>

              <div className="bg-slate-900 border border-pink-500/30 rounded-2xl p-4">
                <div className="flex items-center justify-between text-xs text-pink-300 font-mono">
                  <span>{partnerB.city}, {partnerB.country} ({partnerB.name})</span>
                  <span className="font-bold">{partnerB.timezone}</span>
                </div>
                <div className="text-2xl font-mono font-bold text-white mt-1">
                  {timeStats.partnerBTime}
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  {partnerB.name} is enjoying a quiet moment in {partnerB.city}.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CALENDAR & VIRTUAL DATES */}
        {activeTab === 'calendar' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-950">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white text-sm">Upcoming Couple Events</h4>
              <button
                onClick={() => {
                  setEventTitle('Surprise Date Call ☕');
                  setEventDate('Tomorrow, 21:00');
                }}
                className="text-xs text-yellow-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Quick Add Event
              </button>
            </div>

            <div className="space-y-3">
              {calendarEvents.map(ev => (
                <div
                  key={ev.id}
                  className="bg-slate-900 border border-slate-800 hover:border-yellow-500/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/20 border border-yellow-400/40 flex items-center justify-center shrink-0">
                      <CalendarIcon className="w-5 h-5 text-yellow-300" />
                    </div>
                    <div>
                      <h5 className="font-bold text-white text-sm">{ev.title}</h5>
                      <div className="text-xs text-yellow-300 font-mono mt-0.5">
                        {ev.date} {ev.time && `&bull; ${ev.time}`}
                      </div>
                      {ev.notes && <p className="text-xs text-slate-400 mt-1">{ev.notes}</p>}
                    </div>
                  </div>

                  {ev.countdown && (
                    <span className="text-xs bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full border border-yellow-500/30 font-semibold self-start sm:self-center">
                      Top Priority Reunion
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PACKING LIST */}
        {activeTab === 'packing' && (
          <div className="flex-1 overflow-y-auto p-6 bg-slate-950 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Luggage className="w-4 h-4 text-yellow-400" />
                  <span>Reunion Suitcase Checklist</span>
                </h4>
                <p className="text-xs text-slate-400">Everything you need for your next reunion</p>
              </div>
              <span className="text-xs text-yellow-300 font-mono bg-yellow-500/20 px-2.5 py-1 rounded-full border border-yellow-500/30">
                {packingItems.filter(i => i.checked).length} / {packingItems.length} packed
              </span>
            </div>

            <div className="space-y-2">
              {packingItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => togglePacking(item.id)}
                  className={`cursor-pointer p-3.5 rounded-2xl border transition-all flex items-center gap-3 ${
                    item.checked
                      ? 'bg-yellow-950/30 border-yellow-500/30 text-yellow-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {item.checked ? (
                    <CheckCircle2 className="w-5 h-5 text-yellow-400 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-600 shrink-0" />
                  )}
                  <span className={`text-sm ${item.checked ? 'line-through text-yellow-200/60' : 'text-slate-200'}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
