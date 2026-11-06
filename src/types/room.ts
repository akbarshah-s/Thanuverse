import type { PartnerId } from './index';

export interface RoomSession {
  roomId: string;
  perspective: PartnerId;
  displayName: string;
  profile: RoomProfile;
}

export interface RoomProfile {
  name: string;
  city: string;
  country: string;
  timezone: string;
}

export interface RoomSharedState {
  isMoonConnected: boolean;
  chatMessages: import('./index').ChatMessage[];
  loveNotes: import('./index').LoveNote[];
  playlist: import('./index').MusicTrack[];
  currentTrack: import('./index').MusicTrack;
  memories: import('./index').MemoryItem[];
  diaryEntries: import('./index').DiaryEntry[];
  calendarEvents: import('./index').CalendarEvent[];
  wishLanterns: import('./index').WishLantern[];
}
