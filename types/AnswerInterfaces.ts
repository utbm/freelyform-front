export interface AnswerRequest {
  answers: object[];
}

export interface Answer {
  id: string;
  prefabId: string;
  user: AnswerUser;
  createdAt: string;
  answers: object[];
}

export interface AnswerUser {
  name: string;
  email: string | null;
  isGuest: boolean;
}

export interface AnswerGeolocation {
  lat: number;
  lng: number;
  distance: number;
}
