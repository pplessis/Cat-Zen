export enum AppMode {
  HOME = 'HOME',
  LASER = 'LASER',
  SOUNDS = 'SOUNDS',
  ZEN_SAGE = 'ZEN_SAGE'
}

export interface SoundTrack {
  id: string;
  title: string;
  src: string; // URL to audio file
  icon: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
