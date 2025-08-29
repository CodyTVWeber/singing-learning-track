export interface LessonProgress {
  userId: string;
  lessonId: string;
  completed: boolean;
  score: number;
  completedDate: Date;
}