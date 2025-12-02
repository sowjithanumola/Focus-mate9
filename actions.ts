
'use server';

import {
  generateImprovementSuggestions,
} from '@/ai/flows/generate-improvement-suggestions';
import {
  summarizeMonthlyProgress,
} from '@/ai/flows/summarize-monthly-progress';
import { educationalTutor } from '@/ai/flows/educational-tutor';
import type { StudyLog, MonthlyReport } from './types';
import { Timestamp } from 'firebase-admin/firestore';
import { getFirebaseAdmin } from '@/firebase/server';
import { toDate } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';


export async function getAISuggestions(
  studyLogs: StudyLog[]
): Promise<string> {
  if (!studyLogs || studyLogs.length === 0) {
    return 'Not enough data to generate suggestions. Please add more study logs.';
  }

  const monthlyData = JSON.stringify(
    studyLogs.map(log => ({
      date: toDate(log.date).toLocaleDateString(),
      subjectName: log.subjectName,
      timeSpent: `${log.timeSpent} minutes`,
      focusLevel: log.focusLevel,
      mood: log.mood,
      goalStatus: log.goalStatus,
      remarks: log.remarks,
    })),
    null,
    2
  );

  try {
    const result = await generateImprovementSuggestions({ monthlyData });
    return result.suggestions;
  } catch (error) {
    console.error('Error generating AI suggestions:', error);
    return 'Sorry, there was an error generating suggestions. Please try again later.';
  }
}

export async function getMonthlySummary(
  studyLogs: StudyLog[]
): Promise<string> {
  if (!studyLogs || studyLogs.length === 0) {
    return 'No study logs for this month to summarize.';
  }
  const monthlyData = JSON.stringify(
    studyLogs.map(log => ({
      date: toDate(log.date).toLocaleDateString(),
      subjectName: log.subjectName,
      timeSpent: `${log.timeSpent} minutes`,
      focusLevel: log.focusLevel,
      mood: log.mood,
      goalStatus: log.goalStatus,
      remarks: log.remarks,
    })),
    null,
    2
  );

  try {
    const result = await summarizeMonthlyProgress({ monthlyData });
    return result.summary;
  } catch (error) {
    console.error('Error generating monthly summary:', error);
    return 'Sorry, there was an error generating the monthly summary. Please try again later.';
  }
}

export async function askTutor(userName: string, question: string, history: {role: string, content: string}[]): Promise<string> {
    try {
        const result = await educationalTutor({ userName, question, history });
        return result.answer;
    } catch (error) {
        console.error('Error asking tutor:', error);
        return 'Sorry, I am having trouble connecting to my knowledge base. Please try again later.';
    }
}

export async function getReportForMonth(userId: string, month: number, year: number): Promise<MonthlyReport | null> {
    const { firestore } = getFirebaseAdmin();
    const reportsRef = firestore.collection(`users/${userId}/monthlyReports`);
    const q = reportsRef.where('month', '==', month).where('year', '==', year);
    
    try {
        const querySnapshot = await q.get();
        if (!querySnapshot.empty) {
            const reportDoc = querySnapshot.docs[0];
            const data = reportDoc.data();
            // Convert Firestore Timestamps to JS Dates for serialization
            const lowFocusDays = (data.lowFocusDays || []).map((t: Timestamp) => t.toDate());
            return { id: reportDoc.id, ...data, lowFocusDays } as MonthlyReport;
        }
        return null;
    } catch (error) {
        console.error("Error fetching report:", error);
        return null;
    }
}

export async function generateAndSaveMonthlyReport(
    userId: string,
    month: number, // 1-12
    year: number,
    studyLogs: StudyLog[]
  ): Promise<MonthlyReport> {
    
    const { firestore } = getFirebaseAdmin();
    
    if (studyLogs.length === 0) {
      throw new Error('Cannot generate a report with no study logs.');
    }
  
    // 1. Prepare data for AI flows
    const logsForAI = studyLogs.map(log => ({
      date: toDate(log.date).toLocaleDateString(),
      subjectName: log.subjectName,
      timeSpent: log.timeSpent,
      focusLevel: log.focusLevel,
      mood: log.mood,
      goalStatus: log.goalStatus,
      remarks: log.remarks || '',
    }));
    const monthlyDataString = JSON.stringify(logsForAI, null, 2);
    
    const aiInput = { monthlyData: monthlyDataString };
  
    // 2. Call AI flows in parallel
    const [performanceResult, suggestionsResult] = await Promise.all([
      summarizeMonthlyProgress(aiInput),
      generateImprovementSuggestions(aiInput),
    ]);
  
    // 3. Identify low-focus days
    const lowFocusDays = studyLogs
      .filter(log => log.focusLevel === 'Low')
      .map(log => toDate(log.date)); // Convert to JS Date
  
    // 4. Consolidate achievements
    const totalTime = studyLogs.reduce((acc, log) => acc + log.timeSpent, 0);
    const goalsCompleted = studyLogs.filter(log => log.goalStatus === 'Completed').length;
    const achievementSummary = `You studied for a total of ${(totalTime / 60).toFixed(1)} hours and completed ${goalsCompleted} goals. Great job!`;
  
    // 5. Construct the report object
    const reportId = uuidv4();
    const newReportData: Omit<MonthlyReport, 'id'> = {
      userId: userId,
      month: month,
      year: year,
      performanceSummary: performanceResult.summary,
      achievementSummary: achievementSummary,
      improvementSuggestions: suggestionsResult.suggestions,
      lowFocusDays: lowFocusDays,
    };
  
    // 6. Save to Firestore
    const reportRef = firestore.doc(`users/${userId}/monthlyReports/${reportId}`);
    await reportRef.set(newReportData);
  
    return { id: reportId, ...newReportData };
  }
