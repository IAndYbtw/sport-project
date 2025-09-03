import { createSlice } from '@reduxjs/toolkit';
import type { Achievement } from '../types';

interface AchievementsState {
    items: Achievement[];
}

const initialState: AchievementsState = {
    items: [
    {
        id: 'workout-beginner',
        name: 'Спортсмен',
        description: 'Заверши 5 тренировок',
        icon: 'dumbbell',
        requirement: 5,
        type: 'workouts',
        reward: 100
    },
    {
        id: 'workout-enthusiast',
        name: 'Энтузиаст тренировок',
        description: 'Заверши 20 тренировок',
        icon: 'dumbbell',
        requirement: 20,
        type: 'workouts',
        reward: 300
    },
    {
        id: 'exercise-master',
        name: 'Мастер упражнений',
        description: 'Заверши 100 упражнений',
        icon: 'trophy',
        requirement: 100,
        type: 'exercises',
        reward: 500
    },
    {
        id: 'point-collector',
        name: 'Сборщик очков',
        description: 'Заработай 1000 очков',
        icon: 'coins',
        requirement: 1000,
        type: 'points',
        reward: 200
    }
    ]
};

const achievementsSlice = createSlice({
    name: 'achievements',
    initialState,
    reducers: {}
});

export default achievementsSlice.reducer;