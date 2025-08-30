import type { LessonProgress } from '../models/progress';

const PROGRESS_STORAGE_KEY = 'kooka_sing_progress';

export async function getProgress(userId: string): Promise<LessonProgress[]> {
  try {
    const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!stored) return [];
    
    const allProgress = JSON.parse(stored) as LessonProgress[];
    return allProgress
      .filter(p => p.userId === userId)
      .map(p => ({
        ...p,
        completedDate: new Date(p.completedDate)
      }));
  } catch (error) {
    console.error('Error loading progress:', error);
    return [];
  }
}

export async function saveProgress(progress: LessonProgress): Promise<void> {
  try {
    const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
    const allProgress = stored ? JSON.parse(stored) as LessonProgress[] : [];
    
    // Find existing progress for this user/lesson combo
    const existingIndex = allProgress.findIndex(
      p => p.userId === progress.userId && p.lessonId === progress.lessonId
    );
    
    if (existingIndex >= 0) {
      allProgress[existingIndex] = progress;
    } else {
      allProgress.push(progress);
    }
    
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(allProgress));
  } catch (error) {
    console.error('Error saving progress:', error);
    throw error;
  }
}

export async function clearProgress(userId: string): Promise<void> {
  try {
    const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!stored) return;
    
    const allProgress = JSON.parse(stored) as LessonProgress[];
    const filteredProgress = allProgress.filter(p => p.userId !== userId);
    
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(filteredProgress));
  } catch (error) {
    console.error('Error clearing progress:', error);
    throw error;
  }
}