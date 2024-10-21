export interface AnswerRequest {
  answers: object[];
}

export interface Answers {
  id: string;
  prefabId: string;
  user: AnswerUser;
  createdAt: string;
  answers: object[];
}

export interface AnswerUser {
  name: string;
  email: string | null;
}
