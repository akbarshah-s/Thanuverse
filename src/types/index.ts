export type PartnerId = 'ren' | 'aoi';

export interface Partner {
  id: PartnerId;
  name: string;
  nativeName: string;
  avatar: string;
  role: string;
  city: string;
  country: string;
  flag: string;
  timezone: string;
  bio: string;
  currentStatus: string;
  isOnline: boolean;
  themeColor: string;
  accentColor: string;
  roomTheme: 'tokyo-balcony' | 'paris-terrace' | 'cozy-bedroom' | 'celestial-portal' | 'rainy-loft';
}

export interface LoveNote {
  id: string;
  fromId: PartnerId;
  toId: PartnerId;
  date: string;
  title: string;
  content: string;
  paperStyle: 'sakura' | 'parchment' | 'midnight' | 'lavender';
  waxColor: string;
  isRead: boolean;
  isDailySpecial?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: PartnerId;
  text: string;
  timestamp: string;
  type?: 'text' | 'photo' | 'sticker' | 'voice' | 'heart' | 'hug' | 'kiss';
  mediaUrl?: string;
  voiceDuration?: number;
  reactions?: { [emoji: string]: number };
  isRead: boolean;
}

export interface MemoryItem {
  id: string;
  title: string;
  date: string;
  location: string;
  imageUrl: string;
  description: string;
  category: 'trip' | 'call' | 'milestone' | 'letter' | 'gift';
  pinned?: boolean;
  tags: string[];
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  durationSec: number;
  coverUrl: string;
  dedicatedBy?: PartnerId;
  dedicatedNote?: string;
  lofiMood: 'rainy' | 'stargazing' | 'romantic' | 'nostalgic' | 'dreamy';
  synthPreset: string;
}

export interface DiaryEntry {
  id: string;
  authorId: PartnerId;
  date: string;
  mood: 'Missing You' | 'Happy' | 'Warm & Cozy' | 'Counting Days' | 'Dreamy';
  moodEmoji: string;
  title: string;
  content: string;
  photoUrl?: string;
  replies?: {
    authorId: PartnerId;
    text: string;
    date: string;
  }[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  type: 'next-meeting' | 'anniversary' | 'date-night' | 'call' | 'flight';
  location?: string;
  notes?: string;
  countdown?: boolean;
}

export interface WishLantern {
  id: string;
  authorId: PartnerId;
  text: string;
  color: string;
  createdAt: string;
  released: boolean;
}
