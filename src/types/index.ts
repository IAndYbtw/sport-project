export type Difficulty = 'легко' | 'средне' | 'тяжело';
export type Equipment = 'нету' | 'гантель' | 'штанга' | 'верёвка' | 'мат' | 'перекладина' ;
export type MuscleGroup = 'ноги' | 'руки' | 'грудь' | 'мышцы спины' | 'мышцы спереди' | 'плечи';
export type ExerciseType = 'повторы' | 'время' | 'вес';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  difficulty: Difficulty;
  equipment: Equipment[];
  muscleGroups: MuscleGroup[];
  type: ExerciseType;
  defaultValue: number;
  canDelete: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  type: 'workouts' | 'points' | 'exercises';
  reward: number;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  modelUrl?: string;
  previewSrc: string;
}

export interface User {
  name: string;
  height: number;
  weight: number;
  goal: string;
  points: number;
  level: number;
  completedWorkouts: number;
  exercisesCompleted: number;
  ownedItems: string [];
  achievements: any;
  avatarNow: string;
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  value: number; 
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  exercises: WorkoutExercise[];
  difficulty: Difficulty;
  estimatedDuration: number;
}