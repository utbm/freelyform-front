// types/AnswerInterfaces.ts

// Interface used to cast result of a questionnaire to the API Service
import { InputType } from "@/types/FormEnums";

export interface AnswerRequest {
  answers: object[];
}

// Interface to represent a unique answer of an user to a prefab
export interface Answer {
  id: string;
  prefabId: string;
  user: AnswerUser;
  createdAt: string;
  answers: object[];
}

// Interface to represent data of an user for Answser Interface
export interface AnswerUser {
  name: string;
  email: string | null;
  isGuest: boolean;
}

// Interface to cast a geolocation point to search and pass it as a parameter to the Service
export interface AnswerGeolocation {
  lat: number;
  lng: number;
  distance?: number;
}

export interface AnswerGroup {
  group: string;
  questions: AnswerQuestion[];
}

export interface AnswerQuestion {
  question: string;
  type: InputType;
  answer: string | string[] | AnswerGeolocation;
}
