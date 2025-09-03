import { configureStore } from '@reduxjs/toolkit';
import exercisesReducer from './exercisesSlice';
import userReducer from './userSlice';
import workoutsReducer from './workoutsSlice';
import shopReducer from './shopSlice';
import achievementsReducer from './achievementsSlice.ts';

export type Difficulty = 'легко' | 'средне' | 'тяжело';
export type Equipment = 'нету' | 'гантель' | 'штанга' | 'верёвка' | 'мат' | 'перекладина' ;
export type MuscleGroup = 'ноги' | 'руки' | 'грудь' | 'мышцы спины' | 'мышцы спереди' | 'плечи';
export type ExerciseType = 'повторы' | 'время' | 'вес';


export const store = configureStore({
  reducer: {
    exercises: exercisesReducer,
    user: userReducer,
    workouts: workoutsReducer,
    shop: shopReducer,
    achievements: achievementsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

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
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
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
  ownedItems: ['default.png'];
  achievements: any;
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