import React, { FormEvent, useEffect, useState } from 'react';
import { MapPin, X } from 'lucide-react';
import { useKoi } from '../context/KoiContext';
import type { RoomProfile } from '../types/room';

const timeZones = (() => {
  const intl = Intl as typeof Intl & { supportedValuesOf?: (key: 'timeZone') => string[] };
  return intl.supportedValuesOf?.('timeZone') ?? [
    'Africa/Cairo', 'America/Los_Angeles', 'America/New_York', 'Asia/Dubai',
    'Asia/Kolkata', 'Asia/Tokyo', 'Australia/Sydney', 'Europe/London',
    'Europe/Paris', 'UTC'
  ];
})();

export const RoomProfileModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { activePartner, updateMyProfile } = useKoi();
  const [profile, setProfile] = useState<RoomProfile>({
    name: activePartner.name,
    city: activePartner.city,
    country: activePartner.country,
    timezone: activePartner.timezone
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await updateMyProfile(profile);
      onClose();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not update your side.');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof RoomProfile, value: string) => {
    setProfile(current => ({ ...current, [field]: value }));
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section role="dialog" aria-modal="true" aria-labelledby="edit-side-title" className="w-full max-w-md rounded-3xl border border-pink-400/25 bg-slate-950 p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-pink-300">
              <MapPin className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Your room profile</span>
            </div>
            <h2 id="edit-side-title" className="text-xl font-bold text-white">Edit my side</h2>
            <p className="mt-1 text-sm text-slate-400">Choose the name shown for your side. Your name, location and local clock are shared with your person.</p>
          </div>
          <button type="button" aria-label="Close" onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-200">Name shown for your side</span>
            <input required maxLength={40} value={profile.name} onChange={(event) => updateField('name', event.target.value)} placeholder="Choose a name or nickname" className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-pink-400/60" />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-200">City</span>
              <input required maxLength={60} value={profile.city} onChange={(event) => updateField('city', event.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-pink-400/60" />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-200">Country</span>
              <input required maxLength={60} value={profile.country} onChange={(event) => updateField('country', event.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-pink-400/60" />
            </label>
          </div>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-200">Time zone</span>
            <input required list="thanuverse-profile-timezones" value={profile.timezone} onChange={(event) => updateField('timezone', event.target.value)} placeholder="e.g. Asia/Kolkata" className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-pink-400/60" />
            <datalist id="thanuverse-profile-timezones">
              {timeZones.map(zone => <option key={zone} value={zone} />)}
            </datalist>
          </label>

          {error && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5">Cancel</button>
            <button type="submit" disabled={saving} className="rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">
              {saving ? 'Saving…' : 'Save my side'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
