export interface User {
  id: number;
  name: string;
  email: string;
  bio?: string | null;
  avatar?: string | null;
  role: string;
  createdAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export type SearchMode = 'event' | 'person' | 'dynasty' | 'period';

export interface HistoryEvent {
  id: string;
  title: string;
  year: string;
  location: string;
  dynasty: string;
  description: string;
  figures: string[];
  category: string;
  image?: string;
}

export interface HistoryPerson {
  id: string;
  name: string;
  alias?: string;
  birthYear: string;
  deathYear: string;
  dynasty: string;
  role: string;
  description: string;
  works?: string[];
  image?: string;
}

export interface Dynasty {
  id: string;
  name: string;
  startYear: string;
  endYear: string;
  capital: string;
  description: string;
  achievements: string[];
}

export interface Note {
  id: string;
  content: string;
  targetId: string;
  targetType: string;
  targetTitle: string;
  createdAt: string;
}

export interface Bookmark {
  id: string;
  targetId: string;
  targetType: string;
  targetTitle: string;
  targetDynasty?: string;
  createdAt: string;
}
