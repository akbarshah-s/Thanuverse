import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  PartnerId, 
  Partner, 
  LoveNote, 
  ChatMessage, 
  MemoryItem, 
  MusicTrack, 
  DiaryEntry, 
  CalendarEvent, 
  WishLantern 
} from '../types';
import { 
  PARTNERS, 
  RELATIONSHIP_START_DATE, 
  NEXT_MEETING_DATE, 
  INITIAL_LOVE_NOTES, 
  INITIAL_CHAT_MESSAGES, 
  MEMORIES, 
  MUSIC_PLAYLIST, 
  DIARY_ENTRIES, 
  CALENDAR_EVENTS, 
  INITIAL_WISH_LANTERNS 
} from '../data/mockData';
import { ambientSound } from '../audio/ambientAudio';
import type { RoomSharedState } from '../types/room';
import type { RoomProfile } from '../types/room';

interface TimeStats {
  relationshipDuration: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalDays: number;
  };
  nextMeetingCountdown: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  };
  partnerATime: string;
  partnerBTime: string;
  timeDifferenceHours: number;
}

interface KoiContextType {
  roomId: string;
  roomConnected: boolean;
  roomSyncError: string | null;
  updateMyProfile: (profile: RoomProfile) => Promise<void>;

  // Perspective & View
  currentPerspective: PartnerId;
  viewMode: 'perspective' | 'split';
  activeScreen: 'welcome' | 'room';
  setPerspective: (p: PartnerId) => void;
  setViewMode: (v: 'perspective' | 'split') => void;
  setActiveScreen: (s: 'welcome' | 'room') => void;
  
  // Partners info
  partners: Record<PartnerId, Partner>;
  partnerA: Partner; // Ren
  partnerB: Partner; // Aoi
  activePartner: Partner;
  otherPartner: Partner;
  distanceKm: number;
  distanceMiles: number;
  
  // Clocks & Countdowns
  timeStats: TimeStats;

  // LDR Interactive Specials
  isMoonConnected: boolean;
  connectMoon: () => void;
  isHeartbeatActive: boolean;
  heartbeatBpm: number;
  triggerHeartbeat: () => void;
  stopHeartbeat: () => void;

  // Hug & Kiss & Miss You Overlays
  activeOverlay: 'none' | 'hug' | 'kiss' | 'missyou';
  overlaySender: PartnerId | null;
  sendVirtualHug: () => void;
  sendVirtualKiss: () => void;
  sendMissYou: () => void;
  dismissOverlay: () => void;

  // Chat & Communication
  chatMessages: ChatMessage[];
  sendMessage: (text: string, type?: ChatMessage['type'], mediaUrl?: string) => void;
  toggleReaction: (msgId: string, emoji: string) => void;
  isChatOpen: boolean;
  setIsChatOpen: (o: boolean) => void;

  // Love Notes
  loveNotes: LoveNote[];
  selectedNote: LoveNote | null;
  openNote: (note: LoveNote) => void;
  closeNote: () => void;
  sendNewNote: (title: string, content: string, paperStyle?: LoveNote['paperStyle']) => void;

  // Music & Audio
  currentTrack: MusicTrack;
  isPlayingMusic: boolean;
  isRainPlaying: boolean;
  isCricketsPlaying: boolean;
  isMuted: boolean;
  playlist: MusicTrack[];
  toggleMusic: () => void;
  toggleRain: () => void;
  toggleCrickets: () => void;
  toggleMute: () => void;
  selectTrack: (track: MusicTrack) => void;
  dedicateTrack: (trackId: string, note: string) => void;

  // Memories
  memories: MemoryItem[];
  addMemory: (memory: Omit<MemoryItem, 'id'>) => void;

  // Diary
  diaryEntries: DiaryEntry[];
  addDiaryEntry: (entry: Omit<DiaryEntry, 'id'>) => void;
  addDiaryReply: (diaryId: string, text: string) => void;

  // Calendar
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;

  // Wish Lanterns
  wishLanterns: WishLantern[];
  releaseWishLantern: (text: string, color: string) => void;

  // Modals & Panels
  activeModal: 'none' | 'video-call' | 'voice-call' | 'watch-together' | 'activity' | 'calendar' | 'memories' | 'diary' | 'music' | 'notes';
  setActiveModal: (m: 'none' | 'video-call' | 'voice-call' | 'watch-together' | 'activity' | 'calendar' | 'memories' | 'diary' | 'music' | 'notes') => void;
}

export const KoiContext = createContext<KoiContextType | undefined>(undefined);

function isRoomSharedState(value: unknown): value is RoomSharedState {
  if (!value || typeof value !== 'object') return false;
  const state = value as Record<string, unknown>;
  return typeof state.isMoonConnected === 'boolean'
    && Array.isArray(state.chatMessages)
    && Array.isArray(state.loveNotes)
    && Array.isArray(state.playlist)
    && !!state.currentTrack && typeof state.currentTrack === 'object'
    && Array.isArray(state.memories)
    && Array.isArray(state.diaryEntries)
    && Array.isArray(state.calendarEvents)
    && Array.isArray(state.wishLanterns);
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== 'object') return false;
  const message = value as Record<string, unknown>;
  return typeof message.id === 'string'
    && (message.senderId === 'ren' || message.senderId === 'aoi')
    && typeof message.text === 'string'
    && typeof message.timestamp === 'string'
    && typeof message.isRead === 'boolean';
}

function isWishLantern(value: unknown): value is WishLantern {
  if (!value || typeof value !== 'object') return false;
  const wish = value as Record<string, unknown>;
  return typeof wish.id === 'string'
    && (wish.authorId === 'ren' || wish.authorId === 'aoi')
    && typeof wish.text === 'string'
    && typeof wish.color === 'string'
    && typeof wish.createdAt === 'string'
    && typeof wish.released === 'boolean';
}

export const KoiProvider: React.FC<{
  children: React.ReactNode;
  roomId: string;
  initialPerspective: PartnerId;
  initialProfile: RoomProfile;
}> = ({ children, roomId, initialPerspective, initialProfile }) => {
  const [currentPerspective, setCurrentPerspective] = useState<PartnerId>(initialPerspective);
  const [viewMode, setViewMode] = useState<'perspective' | 'split'>('perspective');
  const [activeScreen, setActiveScreen] = useState<'welcome' | 'room'>('welcome');

  const [partners, setPartners] = useState(() => ({
    ...PARTNERS,
    [initialPerspective === 'ren' ? 'aoi' : 'ren']: {
      ...PARTNERS[initialPerspective === 'ren' ? 'aoi' : 'ren'],
      name: 'Your person'
    },
    [initialPerspective]: {
      ...PARTNERS[initialPerspective],
      name: initialProfile.name,
      city: initialProfile.city,
      country: initialProfile.country,
      timezone: initialProfile.timezone
    }
  }));
  const [isMoonConnected, setIsMoonConnected] = useState(true);
  const [isHeartbeatActive, setIsHeartbeatActive] = useState(false);
  const [heartbeatBpm] = useState(72);

  const [activeOverlay, setActiveOverlay] = useState<'none' | 'hug' | 'kiss' | 'missyou'>('none');
  const [overlaySender, setOverlaySender] = useState<PartnerId | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(`koi_${roomId}_chat_messages`);
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [loveNotes, setLoveNotes] = useState<LoveNote[]>(() => {
    const saved = localStorage.getItem(`koi_${roomId}_love_notes`);
    return saved ? JSON.parse(saved) : INITIAL_LOVE_NOTES;
  });
  const [selectedNote, setSelectedNote] = useState<LoveNote | null>(null);

  const [playlist, setPlaylist] = useState<MusicTrack[]>(MUSIC_PLAYLIST);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack>(MUSIC_PLAYLIST[0]);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isRainPlaying, setIsRainPlaying] = useState(false);
  const [isCricketsPlaying, setIsCricketsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const [memories, setMemories] = useState<MemoryItem[]>(() => {
    const saved = localStorage.getItem(`koi_${roomId}_memories`);
    return saved ? JSON.parse(saved) : MEMORIES;
  });

  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(() => {
    const saved = localStorage.getItem(`koi_${roomId}_diary`);
    return saved ? JSON.parse(saved) : DIARY_ENTRIES;
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem(`koi_${roomId}_calendar`);
    return saved ? JSON.parse(saved) : CALENDAR_EVENTS;
  });

  const [wishLanterns, setWishLanterns] = useState<WishLantern[]>(() => {
    const saved = localStorage.getItem(`koi_${roomId}_wishes`);
    return saved ? JSON.parse(saved) : INITIAL_WISH_LANTERNS;
  });

  const [activeModal, setActiveModal] = useState<'none' | 'video-call' | 'voice-call' | 'watch-together' | 'activity' | 'calendar' | 'memories' | 'diary' | 'music' | 'notes'>('none');
  const [roomConnected, setRoomConnected] = useState(false);
  const [roomReady, setRoomReady] = useState(false);
  const [roomSyncError, setRoomSyncError] = useState<string | null>(null);
  const roomSocket = useRef<WebSocket | null>(null);
  const roomReadyRef = useRef(false);
  const lastSyncedRoomState = useRef<string | null>(null);

  // Persistence sync
  useEffect(() => {
    localStorage.setItem(`koi_${roomId}_chat_messages`, JSON.stringify(chatMessages));
  }, [roomId, chatMessages]);

  useEffect(() => {
    localStorage.setItem(`koi_${roomId}_love_notes`, JSON.stringify(loveNotes));
  }, [roomId, loveNotes]);

  useEffect(() => {
    localStorage.setItem(`koi_${roomId}_memories`, JSON.stringify(memories));
  }, [roomId, memories]);

  useEffect(() => {
    localStorage.setItem(`koi_${roomId}_diary`, JSON.stringify(diaryEntries));
  }, [roomId, diaryEntries]);

  useEffect(() => {
    localStorage.setItem(`koi_${roomId}_calendar`, JSON.stringify(calendarEvents));
  }, [roomId, calendarEvents]);

  useEffect(() => {
    localStorage.setItem(`koi_${roomId}_wishes`, JSON.stringify(wishLanterns));
  }, [roomId, wishLanterns]);

  const handleIncomingRoomEvent = useCallback((type: string, payload: unknown) => {
    if (!payload || typeof payload !== 'object') return;
    const data = payload as Record<string, unknown>;

    if (type === 'NEW_MESSAGE' && isChatMessage(payload)) {
      setChatMessages(prev => prev.some(message => message.id === data.id)
        ? prev
        : [...prev, payload]);
      ambientSound.playMissYouPing();
    } else if (type === 'VIRTUAL_HUG' && (data.senderId === 'ren' || data.senderId === 'aoi')) {
      setOverlaySender(data.senderId);
      setActiveOverlay('hug');
      ambientSound.playHugChime();
    } else if (type === 'VIRTUAL_KISS' && (data.senderId === 'ren' || data.senderId === 'aoi')) {
      setOverlaySender(data.senderId);
      setActiveOverlay('kiss');
      ambientSound.playKissSparkle();
    } else if (type === 'MISS_YOU' && (data.senderId === 'ren' || data.senderId === 'aoi')) {
      setOverlaySender(data.senderId);
      setActiveOverlay('missyou');
      ambientSound.playMissYouPing();
    } else if (type === 'HEARTBEAT_SYNC' && typeof data.active === 'boolean') {
      setIsHeartbeatActive(data.active);
      if (data.active) ambientSound.playHeartbeatPulse();
    } else if (type === 'RELEASE_WISH' && isWishLantern(payload)) {
      setWishLanterns(prev => prev.some(wish => wish.id === data.id)
        ? prev
        : [payload, ...prev]);
    }
  }, []);

  const broadcastRoomEvent = (type: string, payload: unknown, sendRemotely = true) => {
    const channel = new BroadcastChannel(`koi_sync_${roomId}`);
    channel.postMessage({ type, payload });
    channel.close();

    const socket = roomSocket.current;
    if (sendRemotely && socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'event', eventType: type, payload }));
    }
  };

  useEffect(() => {
    let reconnectTimer: number | undefined;
    let disposed = false;

    const connect = () => {
      if (disposed) return;
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const socket = new WebSocket(`${protocol}//${window.location.host}/sync`);
      roomSocket.current = socket;

      socket.onopen = () => {
        setRoomConnected(true);
        setRoomSyncError(null);
      };

      socket.onmessage = (event) => {
        let message: { type?: string; payload?: unknown; eventType?: string; message?: string };
        try {
          message = JSON.parse(event.data);
        } catch {
          setRoomSyncError('Received an unreadable update from the room server.');
          return;
        }

        if (message.type === 'state') {
          if (message.payload === null) {
            lastSyncedRoomState.current = null;
            roomReadyRef.current = true;
            setRoomReady(true);
            return;
          }
          if (!isRoomSharedState(message.payload)) {
            setRoomSyncError('The room data could not be read. Please refresh or contact the room owner.');
            return;
          }

          const sharedState = message.payload;
          lastSyncedRoomState.current = JSON.stringify(sharedState);
          setIsMoonConnected(sharedState.isMoonConnected);
          setChatMessages(sharedState.chatMessages);
          setLoveNotes(sharedState.loveNotes);
          setPlaylist(sharedState.playlist);
          setCurrentTrack(sharedState.currentTrack);
          setMemories(sharedState.memories);
          setDiaryEntries(sharedState.diaryEntries);
          setCalendarEvents(sharedState.calendarEvents);
          setWishLanterns(sharedState.wishLanterns);
          roomReadyRef.current = true;
          setRoomReady(true);
        } else if (message.type === 'participants' && message.payload && typeof message.payload === 'object') {
          const profiles = message.payload as Partial<Record<PartnerId, unknown>>;
          setPartners(prev => ({
            ...prev,
            ...(['ren', 'aoi'] as const).reduce((updates, side) => {
              const profile = profiles[side];
              if (!profile || typeof profile !== 'object') return updates;
              const next = profile as Partial<RoomProfile>;
              if (typeof next.name !== 'string' || typeof next.city !== 'string'
                || typeof next.country !== 'string' || typeof next.timezone !== 'string') return updates;
              updates[side] = {
                ...prev[side],
                name: next.name,
                city: next.city,
                country: next.country,
                timezone: next.timezone
              };
              return updates;
            }, {} as Partial<Record<PartnerId, Partner>>)
          }));
        } else if (message.type === 'event' && message.eventType) {
          handleIncomingRoomEvent(message.eventType, message.payload);
        } else if (message.type === 'error') {
          setRoomSyncError(message.message || 'The room server could not save an update.');
        }
      };

      socket.onerror = () => {
        setRoomSyncError('Could not connect to the room server. Reconnecting…');
      };

      socket.onclose = (event) => {
        setRoomConnected(false);
        setRoomReady(false);
        roomReadyRef.current = false;
        lastSyncedRoomState.current = null;
        if (event.code === 4003) {
          setRoomSyncError('This room already has two connected people. Close another room tab and try again.');
          return;
        }
        if (!disposed) reconnectTimer = window.setTimeout(connect, 2000);
      };
    };

    reconnectTimer = window.setTimeout(connect, 0);
    return () => {
      disposed = true;
      if (reconnectTimer !== undefined) window.clearTimeout(reconnectTimer);
      roomReadyRef.current = false;
      roomSocket.current?.close();
      roomSocket.current = null;
    };
  }, [roomId, handleIncomingRoomEvent]);

  const roomStateJson = JSON.stringify({
    isMoonConnected,
    chatMessages,
    loveNotes,
    playlist,
    currentTrack,
    memories,
    diaryEntries,
    calendarEvents,
    wishLanterns
  });

  useEffect(() => {
    if (!roomReady || !roomConnected || roomStateJson === lastSyncedRoomState.current) return;
    const socket = roomSocket.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    const timer = window.setTimeout(() => {
      if (socket.readyState !== WebSocket.OPEN) return;
      socket.send(JSON.stringify({ type: 'state', payload: JSON.parse(roomStateJson) }));
      lastSyncedRoomState.current = roomStateJson;
    }, 150);
    return () => window.clearTimeout(timer);
  }, [roomReady, roomConnected, roomStateJson]);

  // Cross-tab synchronization via BroadcastChannel
  useEffect(() => {
    const channel = new BroadcastChannel(`koi_sync_${roomId}`);
    channel.onmessage = (event) => {
      const { type, payload } = event.data;
      handleIncomingRoomEvent(type, payload);
    };

    return () => channel.close();
  }, [handleIncomingRoomEvent, roomId]);

  // Real-time ticking time stats
  const [timeStats, setTimeStats] = useState<TimeStats>(calculateTimeStats);

  function calculateTimeStats(): TimeStats {
    const now = new Date();
    
    // Relationship Duration
    const startDate = new Date(RELATIONSHIP_START_DATE);
    const diffMs = Math.max(0, now.getTime() - startDate.getTime());
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
    const seconds = Math.floor((diffMs / 1000) % 60);

    // Next Meeting
    const meetingDate = new Date(NEXT_MEETING_DATE);
    const meetDiffMs = meetingDate.getTime() - now.getTime();
    const isPast = meetDiffMs <= 0;
    const mDays = Math.max(0, Math.floor(meetDiffMs / (1000 * 60 * 60 * 24)));
    const mHours = Math.max(0, Math.floor((meetDiffMs / (1000 * 60 * 60)) % 24));
    const mMinutes = Math.max(0, Math.floor((meetDiffMs / (1000 * 60)) % 60));
    const mSeconds = Math.max(0, Math.floor((meetDiffMs / 1000) % 60));

    // Tokyo time (Ren)
    const partnerAFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: partners.ren.timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    // Paris time (Aoi)
    const partnerBFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: partners.aoi.timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    return {
      relationshipDuration: {
        days: totalDays,
        hours,
        minutes,
        seconds,
        totalDays
      },
      nextMeetingCountdown: {
        days: mDays,
        hours: mHours,
        minutes: mMinutes,
        seconds: mSeconds,
        isPast
      },
      partnerATime: partnerAFormatter.format(now),
      partnerBTime: partnerBFormatter.format(now),
      timeDifferenceHours: (getTimeZoneOffsetMinutes(partners.ren.timezone, now)
        - getTimeZoneOffsetMinutes(partners.aoi.timezone, now)) / 60
    };
  }

  function getTimeZoneOffsetMinutes(timezone: string, date: Date): number {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23'
    }).formatToParts(date);
    const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
    const localAsUtc = Date.UTC(
      Number(values.year),
      Number(values.month) - 1,
      Number(values.day),
      Number(values.hour),
      Number(values.minute),
      Number(values.second)
    );
    return Math.round((localAsUtc - date.getTime()) / 60000);
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStats(calculateTimeStats());
    }, 1000);
    return () => clearInterval(timer);
  }, [partners.ren.timezone, partners.aoi.timezone]);

  const partnerA = partners.ren;
  const partnerB = partners.aoi;
  const activePartner = partners[currentPerspective];
  const otherPartner = currentPerspective === 'ren' ? partnerB : partnerA;
  const distanceKm = 9712;
  const distanceMiles = 6035;

  const updateMyProfile = async (profile: RoomProfile) => {
    const response = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Could not update your side.');

    setPartners(prev => ({
      ...prev,
      [currentPerspective]: {
        ...prev[currentPerspective],
        name: result.profile.name,
        city: result.profile.city,
        country: result.profile.country,
        timezone: result.profile.timezone
      }
    }));
  };

  // LDR Interactive Actions
  const connectMoon = () => {
    setIsMoonConnected(true);
    ambientSound.playMoonHarmonize();
    confetti({
      particleCount: 50,
      spread: 80,
      origin: { y: 0.4 },
      colors: ['#ff7597', '#c084fc', '#38bdf8', '#fef08a']
    });
  };

  const triggerHeartbeat = () => {
    setIsHeartbeatActive(true);
    ambientSound.playHeartbeatPulse();
    const interval = setInterval(() => {
      ambientSound.playHeartbeatPulse();
    }, 833); // ~72 BPM

    (window as any)._hbInterval = interval;

    broadcastRoomEvent('HEARTBEAT_SYNC', { active: true });
  };

  const stopHeartbeat = () => {
    setIsHeartbeatActive(false);
    if ((window as any)._hbInterval) {
      clearInterval((window as any)._hbInterval);
    }
    broadcastRoomEvent('HEARTBEAT_SYNC', { active: false });
  };

  const sendVirtualHug = () => {
    setOverlaySender(currentPerspective);
    setActiveOverlay('hug');
    ambientSound.playHugChime();

    confetti({
      particleCount: 60,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#ffa6c1', '#f472b6', '#fb7185']
    });

    broadcastRoomEvent('VIRTUAL_HUG', { senderId: currentPerspective });

    // Auto dismiss after 4.5s
    setTimeout(() => {
      setActiveOverlay('none');
    }, 4500);
  };

  const sendVirtualKiss = () => {
    setOverlaySender(currentPerspective);
    setActiveOverlay('kiss');
    ambientSound.playKissSparkle();

    broadcastRoomEvent('VIRTUAL_KISS', { senderId: currentPerspective });

    setTimeout(() => {
      setActiveOverlay('none');
    }, 3800);
  };

  const sendMissYou = () => {
    setOverlaySender(currentPerspective);
    setActiveOverlay('missyou');
    ambientSound.playMissYouPing();

    broadcastRoomEvent('MISS_YOU', { senderId: currentPerspective });

    setTimeout(() => {
      setActiveOverlay('none');
    }, 3000);
  };

  const dismissOverlay = () => {
    setActiveOverlay('none');
  };

  // Chat
  const sendMessage = (text: string, type: ChatMessage['type'] = 'text', mediaUrl?: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentPerspective,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type,
      mediaUrl,
      isRead: false
    };

    setChatMessages(prev => [...prev, newMsg]);
    ambientSound.playMissYouPing();

    broadcastRoomEvent('NEW_MESSAGE', newMsg, false);
  };

  const toggleReaction = (msgId: string, emoji: string) => {
    setChatMessages(prev => prev.map(m => {
      if (m.id !== msgId) return m;
      const reactions = { ...(m.reactions || {}) };
      reactions[emoji] = (reactions[emoji] || 0) + 1;
      return { ...m, reactions };
    }));
  };

  // Love Notes
  const openNote = (note: LoveNote) => {
    setSelectedNote(note);
    if (!note.isRead) {
      setLoveNotes(prev => prev.map(n => n.id === note.id ? { ...n, isRead: true } : n));
    }
    ambientSound.playKissSparkle();
  };

  const closeNote = () => {
    setSelectedNote(null);
  };

  const sendNewNote = (title: string, content: string, paperStyle: LoveNote['paperStyle'] = 'sakura') => {
    const note: LoveNote = {
      id: `note-${Date.now()}`,
      fromId: currentPerspective,
      toId: otherPartner.id,
      date: 'Just now',
      title,
      content,
      paperStyle,
      waxColor: currentPerspective === 'ren' ? '#38bdf8' : '#ff4d6d',
      isRead: false
    };

    setLoveNotes(prev => [note, ...prev]);
    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Music Controls
  const toggleMusic = () => {
    const state = ambientSound.toggleMusic();
    setIsPlayingMusic(state);
  };

  const toggleRain = () => {
    const state = ambientSound.toggleRain();
    setIsRainPlaying(state);
  };

  const toggleCrickets = () => {
    const state = ambientSound.toggleCrickets();
    setIsCricketsPlaying(state);
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    ambientSound.setMasterMute(nextMute);
  };

  const selectTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    if (!isPlayingMusic) {
      toggleMusic();
    }
  };

  const dedicateTrack = (trackId: string, note: string) => {
    setPlaylist(prev => prev.map(t => {
      if (t.id === trackId) {
        return {
          ...t,
          dedicatedBy: currentPerspective,
          dedicatedNote: note
        };
      }
      return t;
    }));
    confetti({
      particleCount: 30,
      spread: 50,
      colors: ['#ff7597', '#c084fc']
    });
  };

  // Memories
  const addMemory = (memory: Omit<MemoryItem, 'id'>) => {
    const newMem: MemoryItem = {
      ...memory,
      id: `mem-${Date.now()}`
    };
    setMemories(prev => [newMem, ...prev]);
    confetti({
      particleCount: 50,
      spread: 80,
      origin: { y: 0.5 }
    });
  };

  // Diary
  const addDiaryEntry = (entry: Omit<DiaryEntry, 'id'>) => {
    const newEntry: DiaryEntry = {
      ...entry,
      id: `diary-${Date.now()}`
    };
    setDiaryEntries(prev => [newEntry, ...prev]);
  };

  const addDiaryReply = (diaryId: string, text: string) => {
    setDiaryEntries(prev => prev.map(d => {
      if (d.id !== diaryId) return d;
      return {
        ...d,
        replies: [
          ...(d.replies || []),
          {
            authorId: currentPerspective,
            text,
            date: 'Just now'
          }
        ]
      };
    }));
  };

  // Calendar
  const addCalendarEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEv: CalendarEvent = {
      ...event,
      id: `cal-${Date.now()}`
    };
    setCalendarEvents(prev => [...prev, newEv]);
  };

  // Wish Lanterns
  const releaseWishLantern = (text: string, color: string) => {
    const wish: WishLantern = {
      id: `wish-${Date.now()}`,
      authorId: currentPerspective,
      text,
      color,
      createdAt: 'Just now',
      released: true
    };
    setWishLanterns(prev => [wish, ...prev]);

    confetti({
      particleCount: 45,
      spread: 100,
      origin: { y: 0.7 },
      colors: [color, '#ffffff', '#fef08a']
    });

    broadcastRoomEvent('RELEASE_WISH', wish, false);
  };

  return (
    <KoiContext.Provider
      value={{
        roomId,
        roomConnected,
        roomSyncError,
        updateMyProfile,

        currentPerspective,
        viewMode,
        activeScreen,
        setPerspective: setCurrentPerspective,
        setViewMode,
        setActiveScreen,

        partners,
        partnerA,
        partnerB,
        activePartner,
        otherPartner,
        distanceKm,
        distanceMiles,

        timeStats,

        isMoonConnected,
        connectMoon,
        isHeartbeatActive,
        heartbeatBpm,
        triggerHeartbeat,
        stopHeartbeat,

        activeOverlay,
        overlaySender,
        sendVirtualHug,
        sendVirtualKiss,
        sendMissYou,
        dismissOverlay,

        chatMessages,
        sendMessage,
        toggleReaction,
        isChatOpen,
        setIsChatOpen,

        loveNotes,
        selectedNote,
        openNote,
        closeNote,
        sendNewNote,

        currentTrack,
        isPlayingMusic,
        isRainPlaying,
        isCricketsPlaying,
        isMuted,
        playlist,
        toggleMusic,
        toggleRain,
        toggleCrickets,
        toggleMute,
        selectTrack,
        dedicateTrack,

        memories,
        addMemory,

        diaryEntries,
        addDiaryEntry,
        addDiaryReply,

        calendarEvents,
        addCalendarEvent,

        wishLanterns,
        releaseWishLantern,

        activeModal,
        setActiveModal
      }}
    >
      {children}
    </KoiContext.Provider>
  );
};

export const useKoi = () => {
  const context = useContext(KoiContext);
  if (!context) throw new Error('useKoi must be used within KoiProvider');
  return context;
};
