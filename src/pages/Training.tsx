import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Play, SkipForward, Plus, Minus, CheckCircle2, Trophy } from 'lucide-react';
import type { RootState } from '../store';
import { updateUser } from '../store/userSlice';
import useUser from '../hook/user';
import useExercises from '../hook/exercises';

function Training() {
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const workout = useSelector((state: RootState) => 
    state.workouts.items.find(w => w.id === workoutId)
  );
  const exercises = useExercises();
  const user = useUser();

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [workoutStats, setWorkoutStats] = useState({
    startTime: 0,
    completedExercises: 0,
    totalReps: 0,
    totalTime: 0,
  });
  const [showCompletion, setShowCompletion] = useState(false);

  useEffect(() => {
    if (!workout) {
      navigate('/workouts');
      return;
    }
  }, [workout, navigate]);

  useEffect(() => {
    let interval: number | undefined;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            clearInterval(interval);
            if (isResting) {
              setIsResting(false);
              setIsActive(false);
            } else {
              handleExerciseComplete();
            }
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, isResting]);

  if (!workout || !exercises) return null;

  const currentExercise = workout.exercises[currentExerciseIndex];
  const exerciseDetails = exercises.find(e => e.id === currentExercise?.exerciseId);

  const startExercise = () => {
    if (!workoutStats.startTime) {
      setWorkoutStats(prev => ({ ...prev, startTime: Date.now() }));
    }
    
    if (exerciseDetails?.type === 'время') {
      setTimeLeft(currentExercise.value);
      setIsActive(true);
    }
  };

  const handleExerciseComplete = () => {
    setWorkoutStats(prev => ({
      ...prev,
      completedExercises: prev.completedExercises + 1,
      totalReps: prev.totalReps + (exerciseDetails?.type === 'повторы' ? currentExercise.value : 0),
      totalTime: prev.totalTime + (exerciseDetails?.type === 'время' ? currentExercise.value : 0),
    }));

    if (currentExerciseIndex < workout.exercises.length - 1) {
      setIsResting(true);
      setTimeLeft(restTime);
      setIsActive(true);
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      setShowCompletion(true);
    }
  };

  const completeWorkout = () => {
    if (user) {
      console.log(user)
      dispatch(updateUser({
        ...user,
        points: user.points + 100,
        completedWorkouts: (user.completedWorkouts || 0) + 1
      }));
    }
    navigate('/workouts');
  };

  const adjustRestTime = (amount: number) => {
    const newTime = Math.max(10, restTime + amount);
    setRestTime(newTime);
    if (isResting) {
      setTimeLeft(newTime);
    }
  };

  const skipExercise = () => {
    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setIsActive(false);
      setIsResting(false);
      setTimeLeft(0);
    } else {
      setShowCompletion(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showCompletion) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Trophy className="w-20 h-20 text-yellow-500" />
            </div>
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Тренировка завершена! 🎉</h1>
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                <h2 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-4">Статистика тренировки</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Общее время</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatTime(workoutStats.totalTime)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Упражнений выполнено</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{workoutStats.completedExercises}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Reps</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{workoutStats.totalReps}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Очков получено</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">+100</p>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={completeWorkout}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Забрать награду
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{workout.name}</h1>
          <div className="text-gray-600 dark:text-gray-400">
            Упражнение {currentExerciseIndex + 1} из {workout.exercises.length}
          </div>
        </div>

        {isResting ? (
          <div className="text-center py-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Время отдыха</h2>
            <div className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">{formatTime(timeLeft)}</div>
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={() => adjustRestTime(-10)}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <Minus className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </button>
              <span className="text-xl font-medium text-gray-900 dark:text-white">{restTime}s</span>
              <button
                onClick={() => adjustRestTime(10)}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <Plus className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            <button
              onClick={() => {
                setIsResting(false);
                setIsActive(false);
                setTimeLeft(0);
              }}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Пропустить отдых
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">{exerciseDetails?.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{exerciseDetails?.description}</p>
            </div>

            <div className="aspect-video mb-6 rounded-lg overflow-hidden">
              <img
                src={exerciseDetails?.imageUrl}
                alt={exerciseDetails?.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-center mb-6">
              {exerciseDetails?.type === 'время' ? (
                <>
                  <div className="text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                    {formatTime(timeLeft)}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {isActive ? 'осталось времени' : `${currentExercise.value} секунд`}
                  </p>
                </>
              ) : (
                <>
                  <div className="text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                    {currentExercise.value}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">reps</p>
                </>
              )}
            </div>

            <div className="flex gap-4">
              {!isActive && exerciseDetails?.type === 'время' && (
                <button
                  onClick={startExercise}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Play className="w-5 h-5" />
                  Запустить таймер
                </button>
              )}
              
              {exerciseDetails?.type === 'повторы' && (
                <button
                  onClick={handleExerciseComplete}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Завершить упражнение
                </button>
              )}
              
              <button
                onClick={skipExercise}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <SkipForward className="w-5 h-5" />
                Пропустить
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Training;
