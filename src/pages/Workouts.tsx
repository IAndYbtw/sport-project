import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../store';
import { addWorkout } from '../store/workoutsSlice';
import { Dumbbell, Clock, Plus, X } from 'lucide-react';
import type { Exercise, WorkoutExercise } from '../types';
import useExercises from '../hook/exercises';

function Workouts() {
  const dispatch = useDispatch();
  const workouts = useSelector((state: RootState) => state.workouts.items);
  const exercises = useExercises();
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    description: '',
    exercises: [] as WorkoutExercise[],
    difficulty: 'средне' as const,
    estimatedDuration: 30,
  });

  const handleAddExercise = (exercise: Exercise) => {
    setNewWorkout(prev => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        {
          exerciseId: exercise.id,
          sets: 3,
          value: exercise.defaultValue,
        },
      ],
    }));
  };

  const handleRemoveExercise = (index: number) => {
    setNewWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index),
    }));
  };

  const handleCreateWorkout = () => {
    if (!newWorkout.name || newWorkout.exercises.length === 0) {
      alert('Please fill in all required fields and add at least one exercise');
      return;
    }

    dispatch(addWorkout({
      ...newWorkout,
      id: Date.now().toString(),
    }));

    setIsCreating(false);
    setNewWorkout({
      name: '',
      description: '',
      exercises: [],
      difficulty: 'средне',
      estimatedDuration: 30,
    });
  };

  const getExerciseName = (exerciseId: string) => {
    return exercises.find(ex => ex.id === exerciseId)?.name || 'Unknown Exercise';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Тренировки</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <Plus className="w-5 h-5" />
          Создать тренировку
        </button>
      </div>

      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Создать новую тренировку</h2>
                <button
                  onClick={() => setIsCreating(false)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Название</label>
                  <input
                    type="text"
                    value={newWorkout.name}
                    onChange={(e) => setNewWorkout(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Название тренировки"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Описание</label>
                  <textarea
                    value={newWorkout.description}
                    onChange={(e) => setNewWorkout(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    rows={3}
                    placeholder="Описание тренировки"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Сложность</label>
                  <select
                    value={newWorkout.difficulty}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="easy">Легко</option>
                    <option value="medium">Средне</option>
                    <option value="hard">Тяжело</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Продолжительность (минуты)</label>
                  <input
                    type="number"
                    value={newWorkout.estimatedDuration}
                    onChange={(e) => setNewWorkout(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) }))}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Упражнения</label>
                  <div className="space-y-2">
                    {newWorkout.exercises.map((ex, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <span className="text-gray-900 dark:text-white">{getExerciseName(ex.exerciseId)}</span>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600 dark:text-gray-300">Подходы:</label>
                            <input
                              type="number"
                              value={ex.sets}
                              onChange={(e) => {
                                const newExercises = [...newWorkout.exercises];
                                newExercises[index].sets = parseInt(e.target.value);
                                setNewWorkout(prev => ({ ...prev, exercises: newExercises }));
                              }}
                              className="w-16 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                              min="1"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600 dark:text-gray-300">
                              {exercises.find(e => e.id === ex.exerciseId)?.type === 'время' ? 'секунд:' : ' повторы:'}
                            </label>
                            <input
                              type="number"
                              value={ex.value}
                              onChange={(e) => {
                                const newExercises = [...newWorkout.exercises];
                                newExercises[index].value = parseInt(e.target.value);
                                setNewWorkout(prev => ({ ...prev, exercises: newExercises }));
                              }}
                              className="w-16 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                              min="1"
                            />
                          </div>
                          <button
                            onClick={() => handleRemoveExercise(index)}
                            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Добавить упражнение</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {exercises.map(exercise => (
                        <button
                          key={exercise.id}
                          onClick={() => handleAddExercise(exercise)}
                          className="text-left px-3 py-2 border dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          {exercise.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleCreateWorkout}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  >
                    Создать
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workouts.map(workout => (
          <div key={workout.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{workout.name}</h2>
              <span className={`px-2 py-1 rounded text-sm capitalize ${
                workout.difficulty === 'легко' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                workout.difficulty === 'средне' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {workout.difficulty}
              </span>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">{workout.description}</p>
            
            <div className="space-y-2 mb-4">
              {workout.exercises.map((ex, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-900 dark:text-white">{getExerciseName(ex.exerciseId)}</span>
                  <span className="text-gray-600 dark:text-gray-400">{ex.sets} подхода × {ex.value} {
                    exercises.find(e => e.id === ex.exerciseId)?.type === 'время' ? 'сек' : 'повторы'
                  }</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{workout.estimatedDuration} мин</span>
              </div>
              <Link
                to={`/training/${workout.id}`}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                <Dumbbell className="w-4 h-4" />
                Начать
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Workouts;
