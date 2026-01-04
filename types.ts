
export enum Page {
  Home = 'home',
  Registration = 'registration',
  Credentials = 'credentials',
  Schedule = 'schedule',
  Speakers = 'speakers',
  Gallery = 'gallery',
  PressReleases = 'press',
  Admin = 'admin'
}

export interface Delegate {
  id: string;
  name: string;
  district: string;
  phone: string;
  email: string;
  role: string;
  isPresent: boolean;
}

export interface Speaker {
  id: string;
  name: string;
  designation: string;
  bio: string;
  photoUrl: string;
}

export interface ScheduleItem {
  date: string;
  time: string;
  event: string;
  speaker: string;
  speakerDesignation?: string;
  venue: string;
}

export interface GalleryImage {
  url: string;
  name: string;
  thumb: string;
}

export interface AdminStats {
  total: number;
  present: number;
  byDistrict: Record<string, number>;
  recent: Array<{
    name: string;
    email: string;
    timestamp: string;
  }>;
}

export interface PressRelease {
  date: string;
  title: string;
  summary: string;
  pdfUrl: string;
}
