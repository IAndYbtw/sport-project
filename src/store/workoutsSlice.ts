import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Workout } from '../types';

interface WorkoutsState {
  items: Workout[];
}

const initialState: WorkoutsState = {
  items: [
    {
      id: '1',
      name: 'Базовая тренировка',
      description: 'Сбалансированная тренировка, нацеленная на все основные группы мышц.',
      exercises: [
        { exerciseId: '1', sets: 3, value: 12 },
        { exerciseId: '2', sets: 3, value: 8 }, 
        { exerciseId: '3', sets: 3, value: 15 },
        { exerciseId: '4', sets: 3, value: 45 }, 
      ],
      difficulty: 'средне',
      estimatedDuration: 45,
    },
    {
      id: '2',
      name: 'Стань сильнее',
      description: 'Сосредоточьтесь на развитии силы верхней части тела.',
      exercises: [
        { exerciseId: '6', sets: 4, value: 60 },
        { exerciseId: '5', sets: 3, value: 12 }, 
        { exerciseId: '8', sets: 3, value: 10 }, 
        { exerciseId: '12', sets: 3, value: 12 },
      ],
      difficulty: 'тяжело',
      estimatedDuration: 50,
    },
    {
      id: '3',
      name: 'Пресс',
      description: 'Интенсивная тренировка корпуса для укрепления пресса',
      exercises: [
        { exerciseId: '4', sets: 3, value: 60 },
        { exerciseId: '9', sets: 3, value: 20 }, 
        { exerciseId: '15', sets: 3, value: 45 }, 
      ],
      difficulty: 'средне',
      estimatedDuration: 30,
    },
  ]
};

const workoutsSlice = createSlice({
  name: 'workouts',
  initialState,
  reducers: {
    addWorkout: (state, action: PayloadAction<Workout>) => {
      state.items.push(action.payload);
    },
    updateWorkout: (state, action: PayloadAction<Workout>) => {
      const index = state.items.findIndex(w => w.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteWorkout: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(w => w.id !== action.payload);
    }
  }
});

export const { addWorkout, updateWorkout, deleteWorkout } = workoutsSlice.actions;
export default workoutsSlice.reducer;