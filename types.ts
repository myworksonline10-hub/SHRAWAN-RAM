
export interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface BankQuestion extends Question {
  subject: string;
  classLevel: string;
}

export interface Test {
  id: string;
  title: string;
  subject: string;
  classLevel: string;
  durationMinutes: number;
  questions: Question[];
}

export interface UserAnswer {
  questionId: string;
  selectedOption: number | null;
  isCorrect: boolean;
}

export interface TestResult {
  testId: string;
  score: number;
  totalQuestions: number;
  answers: UserAnswer[];
  timestamp: number;
}
