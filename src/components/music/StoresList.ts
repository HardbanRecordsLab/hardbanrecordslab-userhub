// HardbanRecords Lab partner stores and streaming platforms
export interface MusicStore {
  id: string;
  name: string;
  category: 'streaming' | 'download' | 'social' | 'other';
  icon?: string;
}

export const MUSIC_STORES: MusicStore[] = [
  // Major Streaming
  { id: 'spotify', name: 'Spotify', category: 'streaming' },
  { id: 'apple_music', name: 'Apple Music', category: 'streaming' },
  { id: 'youtube_music', name: 'YouTube Music', category: 'streaming' },
  { id: 'amazon_music', name: 'Amazon Music', category: 'streaming' },
  { id: 'deezer', name: 'Deezer', category: 'streaming' },
  { id: 'tidal', name: 'Tidal', category: 'streaming' },
  { id: 'pandora', name: 'Pandora', category: 'streaming' },
  { id: 'soundcloud', name: 'SoundCloud', category: 'streaming' },
  { id: 'napster', name: 'Napster', category: 'streaming' },
  { id: 'kkbox', name: 'KKBOX', category: 'streaming' },
  { id: 'anghami', name: 'Anghami', category: 'streaming' },
  { id: 'boomplay', name: 'Boomplay', category: 'streaming' },
  { id: 'jiosaavn', name: 'JioSaavn', category: 'streaming' },
  { id: 'netease', name: 'NetEase Cloud Music', category: 'streaming' },
  { id: 'qobuz', name: 'Qobuz', category: 'streaming' },
  { id: 'audiomack', name: 'Audiomack', category: 'streaming' },
  { id: 'gaana', name: 'Gaana', category: 'streaming' },
  { id: 'iheartradio', name: 'iHeartRadio', category: 'streaming' },

  // Download Stores
  { id: 'itunes', name: 'iTunes', category: 'download' },
  { id: 'amazon_store', name: 'Amazon Store', category: 'download' },
  { id: 'google_play', name: 'Google Play', category: 'download' },
  { id: 'beatport', name: 'Beatport', category: 'download' },
  { id: 'juno', name: 'Juno Download', category: 'download' },
  { id: 'traxsource', name: 'Traxsource', category: 'download' },
  { id: '7digital', name: '7digital', category: 'download' },
  { id: 'medianet', name: 'MediaNet', category: 'download' },

  // Social & Video
  { id: 'tiktok', name: 'TikTok', category: 'social' },
  { id: 'instagram_reels', name: 'Instagram/Facebook', category: 'social' },
  { id: 'snapchat', name: 'Snapchat', category: 'social' },
  { id: 'youtube_content_id', name: 'YouTube Content ID', category: 'social' },
  { id: 'triller', name: 'Triller', category: 'social' },
  { id: 'capcut', name: 'CapCut', category: 'social' },

  // Other
  { id: 'shazam', name: 'Shazam', category: 'other' },
  { id: 'gracenote', name: 'Gracenote', category: 'other' },
  { id: 'peloton', name: 'Peloton', category: 'other' },
  { id: 'tencent', name: 'Tencent Music', category: 'other' },
  { id: 'claro', name: 'Claro Música', category: 'other' },
  { id: 'saavn', name: 'Saavn', category: 'other' },
];

export const TERRITORIES = [
  { id: 'worldwide', name: 'Cały Świat (zalecane)' },
  { id: 'europe', name: 'Europa' },
  { id: 'north_america', name: 'Ameryka Północna' },
  { id: 'south_america', name: 'Ameryka Południowa' },
  { id: 'asia', name: 'Azja' },
  { id: 'africa', name: 'Afryka' },
  { id: 'oceania', name: 'Oceania' },
  { id: 'poland', name: 'Polska' },
  { id: 'uk', name: 'Wielka Brytania' },
  { id: 'germany', name: 'Niemcy' },
  { id: 'usa', name: 'USA' },
  { id: 'japan', name: 'Japonia' },
];

export const GENRE_LIST = [
  'Pop', 'Rock', 'Hip-Hop/Rap', 'R&B/Soul', 'Electronic/Dance',
  'Jazz', 'Classical', 'Country', 'Blues', 'Reggae',
  'Latin', 'Metal', 'Punk', 'Folk', 'Indie',
  'Alternative', 'Ambient', 'Trap', 'Drill', 'Lo-fi',
  'House', 'Techno', 'Drum & Bass', 'Dubstep', 'Trance',
  'Gospel', 'Funk', 'Disco', 'New Age', 'World',
  'Soundtrack', 'Instrumental', 'Experimental', 'Spoken Word', 'Podcast',
];

export const LANGUAGE_LIST = [
  { code: 'pl', name: 'Polski' },
  { code: 'en', name: 'Angielski' },
  { code: 'es', name: 'Hiszpański' },
  { code: 'de', name: 'Niemiecki' },
  { code: 'fr', name: 'Francuski' },
  { code: 'it', name: 'Włoski' },
  { code: 'pt', name: 'Portugalski' },
  { code: 'ja', name: 'Japoński' },
  { code: 'ko', name: 'Koreański' },
  { code: 'zh', name: 'Chiński' },
  { code: 'ru', name: 'Rosyjski' },
  { code: 'ar', name: 'Arabski' },
  { code: 'hi', name: 'Hindi' },
  { code: 'other', name: 'Inny' },
];
