import React, { useCallback, useState } from 'react';
import { KoiProvider, useKoi } from './context/KoiContext';
import { SakuraCanvas } from './canvas/SakuraCanvas';
import { Header } from './components/Header';
import { WelcomeHero } from './components/WelcomeHero';
import { RoomUniverse } from './components/RoomUniverse';
import { EmotionalOverlays } from './components/overlays/EmotionalOverlays';
import { LiveTogetherModal } from './components/features/LiveTogetherModal';
import { PrivateMessaging } from './components/features/PrivateMessaging';
import { TogetherMusic } from './components/features/TogetherMusic';
import { WatchTogether } from './components/features/WatchTogether';
import { OurMemories } from './components/features/OurMemories';
import { OurTimeCalendar } from './components/features/OurTimeCalendar';
import { SharedActivities } from './components/features/SharedActivities';
import { SecretDiary } from './components/features/SecretDiary';
import { LoveNotesModal } from './components/features/LoveNotesModal';
import { Heart, Home, MessageCircleHeart, Copy, Check, LockKeyhole, LogOut, Pencil } from 'lucide-react';
import { RoomAccess } from './components/RoomAccess';
import { RoomProfileModal } from './components/RoomProfileModal';
import type { RoomSession } from './types/room';

const MainKoiContent: React.FC<{
  session: RoomSession;
  onLogout: () => Promise<void>;
}> = ({ session, onLogout }) => {
  const { activeScreen, setActiveScreen, isChatOpen, setIsChatOpen, roomConnected, roomSyncError } = useKoi();
  const [copied, setCopied] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);

  const copyInviteLink = async () => {
    const inviteUrl = new URL(window.location.href);
    inviteUrl.searchParams.set('room', session.roomId);
    try {
      await navigator.clipboard.writeText(inviteUrl.toString());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setLogoutError('Could not copy the invite link. Copy the page URL and share it with your room code.');
    }
  };

  const leaveRoom = async () => {
    setLogoutError('');
    try {
      await onLogout();
    } catch (error) {
      setLogoutError(error instanceof Error ? error.message : 'Could not leave the room.');
    }
  };

  return (
    <div className="relative min-h-screen bg-[#090a16] text-white flex flex-col overflow-x-hidden">
      {/* Dynamic Animated Sakura & Star Canvas Background */}
      <SakuraCanvas weather="sakura" intensity="normal" />

      <div className="relative z-50 border-b border-pink-500/15 bg-slate-950/85 px-4 py-2 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-pink-200">
              <LockKeyhole className="h-3.5 w-3.5" />
              Private room <span className="font-mono tracking-wider text-white">{session.roomId}</span>
            </span>
            <span className={roomConnected ? 'text-emerald-300' : 'text-amber-300'}>
              <span className="mr-1">●</span>{roomConnected ? 'Live sync connected' : 'Connecting…'}
            </span>
            {(roomSyncError || logoutError) && (
              <span role="alert" className="text-rose-300">{roomSyncError || logoutError}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsProfileEditorOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-purple-400/20 bg-purple-500/10 px-2.5 py-1.5 text-xs font-semibold text-purple-100 transition hover:bg-purple-500/20"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit my side
            </button>
            <button
              type="button"
              onClick={copyInviteLink}
              className="flex items-center gap-1.5 rounded-lg border border-pink-400/20 bg-pink-500/10 px-2.5 py-1.5 text-xs font-semibold text-pink-100 transition hover:bg-pink-500/20"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Link copied' : 'Copy invite link'}
            </button>
            <button
              type="button"
              onClick={leaveRoom}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-slate-300 transition hover:border-rose-400/30 hover:text-rose-200"
            >
              <LogOut className="h-3.5 w-3.5" />
              Leave
            </button>
          </div>
        </div>
      </div>

      {/* Top Navbar */}
      <Header />

      {/* Main View Switching: Welcome Experience vs Shared Room */}
      <main className="flex-1 flex flex-col relative z-20">
        {activeScreen === 'welcome' ? <WelcomeHero /> : <RoomUniverse />}
      </main>

      {/* Floating Bottom Pill to toggle between Welcome & Room */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-slate-950/80 border border-pink-500/30 backdrop-blur-xl px-4 py-2 rounded-full shadow-2xl flex items-center gap-2">
        <button
          onClick={() => setActiveScreen('welcome')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeScreen === 'welcome'
              ? 'bg-pink-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>Welcome Home</span>
        </button>

        <span className="text-slate-600">•</span>

        <button
          onClick={() => setActiveScreen('room')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeScreen === 'room'
              ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Heart className="w-3.5 h-3.5 fill-pink-300 text-pink-300" />
          <span>Our Shared Universe</span>
        </button>
      </div>

      {/* Floating Chat Icon (if chat closed) */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white flex items-center justify-center shadow-[0_0_30px_rgba(255,117,151,0.5)] transition-all hover:scale-110 active:scale-95 border-2 border-white/30"
          title="Open THANUVERSE Chat"
        >
          <MessageCircleHeart className="w-6 h-6 animate-pulse" />
        </button>
      )}

      {/* Modals & Overlays */}
      <EmotionalOverlays />
      <LiveTogetherModal />
      <PrivateMessaging />
      <TogetherMusic />
      <WatchTogether />
      <OurMemories />
      <OurTimeCalendar />
      <SharedActivities />
      <SecretDiary />
      <LoveNotesModal />
      {isProfileEditorOpen && <RoomProfileModal onClose={() => setIsProfileEditorOpen(false)} />}
    </div>
  );
};

export function App() {
  const [session, setSession] = useState<RoomSession | null>(null);
  const handleAuthenticated = useCallback((nextSession: RoomSession) => {
    setSession(nextSession);
  }, []);

  const logout = useCallback(async () => {
    const response = await fetch('/api/logout', { method: 'POST' });
    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      throw new Error(result.error ?? 'Could not leave the room.');
    }
    const url = new URL(window.location.href);
    url.searchParams.delete('room');
    window.history.replaceState(null, '', url);
    setSession(null);
  }, []);

  if (!session) return <RoomAccess onAuthenticated={handleAuthenticated} />;

  return (
    <KoiProvider
      roomId={session.roomId}
      initialPerspective={session.perspective}
      initialProfile={session.profile}
    >
      <MainKoiContent session={session} onLogout={logout} />
    </KoiProvider>
  );
}

export default App;
