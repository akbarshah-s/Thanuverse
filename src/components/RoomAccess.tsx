import React, { FormEvent, useEffect, useState } from 'react';
import { Heart, LockKeyhole, UsersRound } from 'lucide-react';
import type { PartnerId } from '../types';
import type { RoomProfile, RoomSession } from '../types/room';

interface RoomAccessProps {
  onAuthenticated: (session: RoomSession) => void;
}

interface SessionResponse {
  authenticated: boolean;
  roomId?: string;
  perspective?: PartnerId;
  displayName?: string;
  profile?: RoomProfile;
}

const timeZones = (() => {
  const intl = Intl as typeof Intl & { supportedValuesOf?: (key: 'timeZone') => string[] };
  return intl.supportedValuesOf?.('timeZone') ?? [
    'Africa/Cairo', 'America/Los_Angeles', 'America/New_York', 'Asia/Dubai',
    'Asia/Kolkata', 'Asia/Tokyo', 'Australia/Sydney', 'Europe/London', 'Europe/Paris',
    Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC', 'UTC'
  ];
})();

export const RoomAccess: React.FC<RoomAccessProps> = ({ onAuthenticated }) => {
  const [mode, setMode] = useState<'create' | 'join'>(() =>
    new URLSearchParams(window.location.search).has('room') ? 'join' : 'create'
  );
  const [roomId, setRoomId] = useState(
    new URLSearchParams(window.location.search).get('room')?.toUpperCase() ?? ''
  );
  const [displayName, setDisplayName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [timezone, setTimezone] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
  const perspective: PartnerId = mode === 'create' ? 'ren' : 'aoi';
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;

    fetch('/api/session')
      .then(async (response) => {
        if (!response.ok) throw new Error('Could not check the room session.');
        return response.json() as Promise<SessionResponse>;
      })
      .then((session) => {
        if (active && session?.authenticated && session.roomId && session.perspective && session.profile) {
          onAuthenticated({
            roomId: session.roomId,
            perspective: session.perspective,
            displayName: session.profile.name,
            profile: session.profile
          });
        }
      })
      .catch(() => {
        if (active) setError('Could not reach the room server. Please try again in a moment.');
      });

    return () => {
      active = false;
    };
  }, [onAuthenticated]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      const response = await fetch(`/api/rooms/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, perspective, name: displayName, city, country, timezone })
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? 'Could not open the room.');
      }

      if (mode === 'create') {
        const url = new URL(window.location.href);
        url.searchParams.set('room', result.roomId);
        window.history.replaceState(null, '', url);
      }

      onAuthenticated({
        roomId: result.roomId,
        perspective: result.perspective,
        displayName: result.profile.name,
        profile: result.profile
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not open the room.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#090a16] px-4 py-10 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.18),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(236,72,153,0.12),transparent_50%)]" />
      <section className="relative mx-auto flex min-h-[80vh] max-w-lg flex-col justify-center">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-pink-300/30 bg-pink-500/10 shadow-[0_0_40px_rgba(236,72,153,0.2)]">
            <Heart className="h-8 w-8 fill-pink-300/20 text-pink-300" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-[0.18em] text-pink-100">THANUVERSE</h1>
          <p className="mt-2 text-sm text-slate-400">A private little universe, shared between two.</p>
        </div>

        <div className="rounded-3xl border border-pink-400/20 bg-slate-950/75 p-6 shadow-2xl shadow-purple-950/30 backdrop-blur-xl sm:p-8">
          <div className="mb-6 grid grid-cols-2 rounded-xl border border-white/10 bg-black/30 p-1">
            <button
              type="button"
              onClick={() => { setMode('create'); setRoomId(''); setError(''); }}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${mode === 'create' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Create our room
            </button>
            <button
              type="button"
              onClick={() => { setMode('join'); setError(''); }}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${mode === 'join' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Join a room
            </button>
          </div>

          <div className="mb-5 flex items-start gap-3 rounded-xl border border-sky-300/15 bg-sky-300/5 p-3 text-xs leading-relaxed text-sky-100/80">
            <UsersRound className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" />
            <p>
              {mode === 'create'
                ? 'Add your name and location, then share the room code or invite link with your person.'
                : 'Enter your name and location, then use the room code or invite link shared with you.'}
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-200">Name shown for your side</span>
              <input
                autoComplete="name"
                required
                maxLength={40}
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Choose a name or nickname"
                className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-pink-400/60"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-slate-200">City</span>
                <input required maxLength={60} value={city} onChange={(event) => setCity(event.target.value)} placeholder="City" className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none focus:border-pink-400/60" />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-slate-200">Country</span>
                <input required maxLength={60} value={country} onChange={(event) => setCountry(event.target.value)} placeholder="Country" className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none focus:border-pink-400/60" />
              </label>
            </div>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-200">Time zone</span>
              <input
                required
                list="thanuverse-timezones"
                value={timezone}
                onChange={(event) => setTimezone(event.target.value)}
                placeholder="Start typing, e.g. Asia/Kolkata"
                className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none focus:border-pink-400/60"
              />
              <datalist id="thanuverse-timezones">
                {timeZones.map(zone => <option key={zone} value={zone} />)}
              </datalist>
              <span className="block text-xs text-slate-500">Choose an IANA zone from the suggestions for an accurate local clock.</span>
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-200">
                {mode === 'create' ? 'Choose your room code' : 'Room code'}
              </span>
              <input
                autoComplete="off"
                autoCapitalize="characters"
                required
                minLength={8}
                maxLength={18}
                pattern="[A-Za-z0-9]{8,18}"
                value={roomId}
                onChange={(event) => setRoomId(event.target.value.toUpperCase())}
                placeholder={mode === 'create' ? 'Choose 8–18 letters or numbers' : 'Enter the room code'}
                className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-pink-400/60"
              />
              {mode === 'create' && (
                <span className="block text-xs text-slate-500">
                  Pick a unique code and share it with your person. Anyone with the code can join.
                </span>
              )}
            </label>

            <div className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3">
              <span className="text-xs text-slate-400">Your side</span>
              <p className="mt-0.5 text-sm font-semibold text-slate-100">
                {displayName.trim() || `Side ${mode === 'create' ? '1' : '2'}`}
              </p>
            </div>

            {error && (
              <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-3 font-bold shadow-lg shadow-pink-950/30 transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60"
            >
              <LockKeyhole className="h-4 w-4" />
              {busy ? 'Opening your room…' : mode === 'create' ? 'Create private room' : 'Join room'}
            </button>
          </form>

          <p className="mt-5 text-center text-[11px] leading-relaxed text-slate-500">
            Anyone with the room code or invite link can join. Share it only with your person.
          </p>
        </div>
      </section>
    </main>
  );
};
