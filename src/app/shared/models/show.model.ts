export interface Show {
  id: number;
  name: string;
  summary?: string;
  image?: {
    medium: string;
    original: string;
  };
  genres: string[];
  rating: {
    average: number;
  };
  premiered: string;
  status: string;
}

export interface ShowWithActors extends Show {
  actors: Actor[];
}

export interface Actor {
  id: number;
  name: string;
  character: {
    name: string;
  };
  person: {
    id: number;
    name: string;
    image?: {
      medium: string;
    };
  };
}

export interface ShowSearchResult {
  show: Show;
  score: number;
}

export interface ApiResponse<T> {
  data: T;
  loading: boolean;
  error: string | null;
}
