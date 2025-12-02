
import type { Timestamp } from 'firebase/firestore';

export type StudyLog = {
  id: string;
  userId: string;
  date: Date | Timestamp | string; // Allow string for server action serialization
  subjectId: string;
  subjectName: string;
  subjectColor: string;
  timeSpent: number; // in minutes
  focusLevel: 'Low' | 'Medium' | 'High';
  mood: 'Happy' | 'Neutral' | 'Sad' | 'Stressed' | 'Productive';
  goalStatus: 'Completed' | 'In Progress' | 'Not Started';
  remarks?: string;
};

export type Subject = {
    id: string;
    userId: string;
    name: string;
    color: string;
};

export type WeeklyGoal = {
    id: string;
    userId: string;
    subjectId: string;
    weekStartDate: Date | Timestamp;
    targetTime: number; // in minutes
};

export type MonthlyReport = {
    id: string;
    userId: string;
    month: number; // 1-12
    year: number;
    performanceSummary: string;
    achievementSummary: string;
    improvementSuggestions: string;
    lowFocusDays: (Date | Timestamp | string)[];
};
