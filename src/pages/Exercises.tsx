import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { Equipment, MuscleGroup, Difficulty, Exercise, ExerciseType } from '../types';
import { Filter, ChevronDown, ChevronUp, Play, Plus, Minus, X, Trophy, Trash2 } from 'lucide-react';
import { updateUser } from '../store/userSlice';
import useUser from '../hook/user';
import { addExercise, addExerciseToLocalStorage, deleteExercise } from '../store/exercisesSlice';
import useExercises from '../hook/exercises';

function Exercises() {
  const dispatch = useDispatch();
  const exercises = useExercises();
  const user = useUser();
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<MuscleGroup[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | ''>('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [exerciseSettings, setExerciseSettings] = useState({
    sets: 3,
    value: 10,
    restTime: 60,
  });
  const [isTraining, setIsTraining] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExercise, setNewExercise] = useState({
    id: "",
    name: "",
    description: "",
    imageUrl: "",
    difficulty: "лекго",
    equipment: [] as Equipment[],
    muscleGroups: [] as MuscleGroup[],
    type: "повторы",
    defaultValue: 0,
  } as unknown as Exercise);

  const muscleGroups: MuscleGroup[] = ['ноги', 'руки', 'грудь', 'мышцы спины', 'мышцы спереди', 'плечи']
  const equipment: Equipment[] = ['нету', 'гантель', 'штанга', 'верёвка', 'мат', 'перекладина'];
  const difficulties: Difficulty[] = ['легко', 'средне', 'тяжело'];

  const filteredExercises = exercises.filter(exercise => {
    const matchesMuscleGroups = selectedMuscleGroups.length === 0 || 
      exercise.muscleGroups.some(group => selectedMuscleGroups.includes(group));
    const matchesEquipment = selectedEquipment.length === 0 ||
      exercise.equipment.some(eq => selectedEquipment.includes(eq));
    const matchesDifficulty = !selectedDifficulty || exercise.difficulty === selectedDifficulty;

    return matchesMuscleGroups && matchesEquipment && matchesDifficulty;
  });

  React.useEffect(() => {
    let interval: number | undefined;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            clearInterval(interval);
            if (isResting) {
              setIsResting(false);
              setIsActive(false);
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

  const toggleMuscleGroup = (group: MuscleGroup) => {
    setSelectedMuscleGroups(prev =>
      prev.includes(group)
        ? prev.filter(g => g !== group)
        : [...prev, group]
    );
  };

  const toggleEquipment = (eq: Equipment) => {
    setSelectedEquipment(prev =>
      prev.includes(eq)
        ? prev.filter(e => e !== eq)
        : [...prev, eq]
    );
  };

  const startSingleExercise = () => {
    if (!selectedExercise) return;
    setIsTraining(true);
    if (selectedExercise.type === 'время') {
      setTimeLeft(exerciseSettings.value);
      setIsActive(true);
    }
  };

  const handleSetComplete = () => {
    if (currentSet < exerciseSettings.sets) {
      setCurrentSet(prev => prev + 1);
      setIsResting(true);
      setTimeLeft(exerciseSettings.restTime);
      setIsActive(true);
    } else {
      setShowCompletion(true);
    }
  };

  const completeExercise = () => {
    if (user) {
      dispatch(updateUser({
        ...user,
        points: user.points + 50,
        exercisesCompleted: (user.exercisesCompleted || 0) + 1
      }));
    }
    setIsTraining(false);
    setCurrentSet(1);
    setIsResting(false);
    setIsActive(false);
    setShowCompletion(false);
    setSelectedExercise(null);
  };

  const handleCreateExercise = () => {
    if (!newExercise.name || !newExercise.description || newExercise.equipment.length === 0) {
        alert('Please fill in all required fields and add at least one piece of equipment');
        return;
    }

    dispatch(addExercise({
        ...newExercise,
        id: Date.now().toString(),
    }));

    dispatch(addExerciseToLocalStorage({
      ...newExercise,
      id: Date.now().toString(),
  }));

    setIsModalOpen(false);
    setNewExercise({
        id: "",
        name: "",
        description: "",
        imageUrl: "",
        difficulty: "легко",
        equipment: [],
        muscleGroups: [],
        type: "повторы",
        defaultValue: 0,
        canDelete: true
    });
  };


  const adjustRestTime = (amount: number) => {
    setExerciseSettings(prev => ({
      ...prev,
      restTime: Math.max(10, prev.restTime + amount)
    }));
    if (isResting) {
      setTimeLeft(Math.max(10, exerciseSettings.restTime + amount));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Каталог упражнений</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <Plus className="w-5 h-5" />
          Добавить упражнение
        </button>
        {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Создать новое упражнение</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
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
                    value={newExercise.name}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Название упражнения"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ссылка на картинку</label>
                  <input
                    type="text"
                    value={newExercise.imageUrl}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, imageUrl: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Ссылка"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Описание</label>
                  <textarea
                    value={newExercise.description}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    rows={3}
                    placeholder="Описание упражнения"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Сложность</label>
                  <select
                    value={newExercise.difficulty}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="easy">Легко</option>
                    <option value="medium">Средне</option>
                    <option value="hard">Тяжело</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Группа мышц</label>
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    {muscleGroups.map((muscleGroup) => (
                      <label key={muscleGroup} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={muscleGroup}
                          checked={newExercise.muscleGroups.includes(muscleGroup)}
                          onChange={(e) => {
                            setNewExercise(prev => ({
                              ...prev,
                              muscleGroups: e.target.checked
                                ? [...prev.muscleGroups, muscleGroup]
                                : prev.muscleGroups.filter(mg => mg !== muscleGroup)
                            }));
                          }}
                          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <span>{muscleGroup}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Оборудование</label>
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    {equipment.map((item) => (
                      <label key={item} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={item}
                          checked={newExercise.equipment.includes(item)}
                          onChange={(e) => {
                            setNewExercise(prev => ({
                              ...prev,
                              equipment: e.target.checked
                                ? [...prev.equipment, item]
                                : prev.equipment.filter(eq => eq !== item)
                            }));
                          }}
                          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Тип</label>
                  <select
                    value={newExercise.type}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, type: e.target.value as ExerciseType }))}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="reps">Повторения</option>
                    <option value="time">Время</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Количество</label>
                  <input
                    type="number"
                    value={newExercise.defaultValue}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, defaultValue: parseInt(e.target.value, 10) }))}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Стандартное значение"
                  />
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleCreateExercise}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  >
                    Добавить упражнение
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
        {!isTraining && (
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Filter className="w-5 h-5" />
            Фильтры
            {isFiltersOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>
      
      <div className={`grid ${!isTraining && 'md:grid-cols-[300px,1fr]'} gap-6`}>
        {}
        {!isTraining && (
          <div className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md h-fit ${isFiltersOpen ? 'block' : 'hidden md:block'}`}>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Фильтры</h2>
            
            {}
            <div className="mb-6">
              <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Группа мышц</h3>
              <div className="space-y-2">
                {muscleGroups.map(group => (
                  <label key={group} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedMuscleGroups.includes(group)}
                      onChange={() => toggleMuscleGroup(group)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="capitalize text-gray-700 dark:text-gray-300">{group}</span>
                  </label>
                ))}
              </div>
            </div>

            {}
            <div className="mb-6">
              <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Оборудование</h3>
              <div className="space-y-2">
                {equipment.map(eq => (
                  <label key={eq} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedEquipment.includes(eq)}
                      onChange={() => toggleEquipment(eq)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="capitalize text-gray-700 dark:text-gray-300">{eq.replace('-', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            {}
            <div>
              <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Сложность</h3>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value as Difficulty | '')}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Все сложности</option>
                {difficulties.map(diff => (
                  <option key={diff} value={diff} className="capitalize">
                    {diff}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {}
        <div className={`grid gap-4 ${isTraining && 'max-w-2xl mx-auto w-full'}`}>
          {selectedExercise ? (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{selectedExercise.name}</h2>
                <button
                  onClick={() => {
                    setSelectedExercise(null);
                    setIsTraining(false);
                    setCurrentSet(1);
                    setIsResting(false);
                    setIsActive(false);
                    setShowCompletion(false);
                  }}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {isTraining ? (
                <div className="space-y-6">
                  <div className="aspect-video mb-6 rounded-lg overflow-hidden">
                    <img 
                      src={selectedExercise.imageUrl} 
                      alt={selectedExercise.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {showCompletion ? (
                    <div className="text-center">
                      <div className="flex justify-center mb-4">
                        <Trophy className="w-16 h-16 text-yellow-500" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
                        Упражнение завершено!
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Хорошая работа! Ты получил 50 очков.
                      </p>
                      <button
                        onClick={completeExercise}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Получить награду
                      </button>
                    </div>
                  ) : isResting ? (
                    <div className="text-center">
                      <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Время отдыха</h3>
                      <div className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">{formatTime(timeLeft)}</div>
                      <div className="flex items-center justify-center gap-4 mb-6">
                        <button
                          onClick={() => adjustRestTime(-10)}
                          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          <Minus className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        </button>
                        <span className="text-xl font-medium text-gray-900 dark:text-white">{exerciseSettings.restTime}s</span>
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
                    <div className="text-center">
                      <div className="text-xl mb-4 text-gray-700 dark:text-gray-300">
                        Set {currentSet} of {exerciseSettings.sets}
                      </div>
                      {selectedExercise.type === 'время' ? (
                        <>
                          <div className="text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                            {formatTime(timeLeft)}
                          </div>
                          <p className="text-gray-600 dark:text-gray-400">
                            {isActive ? 'Осталось времени' : `${exerciseSettings.value} секунд`}
                          </p>
                          {!isActive && (
                            <button
                              onClick={() => {
                                setTimeLeft(exerciseSettings.value);
                                setIsActive(true);
                              }}
                              className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                              Запустить таймер
                            </button>
                          )}
                          {timeLeft === 0 && (
                            <button
                              onClick={handleSetComplete}
                              className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                              Complete Set
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                            {exerciseSettings.value}
                          </div>
                          <p className="text-gray-600 dark:text-gray-400">reps</p>
                          <button
                            onClick={handleSetComplete}
                            className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                          >
                            Завершить подход
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="aspect-video mb-6 rounded-lg overflow-hidden">
                    <img 
                      src={selectedExercise.imageUrl} 
                      alt={selectedExercise.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-6">{selectedExercise.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Sets
                      </label>
                      <input
                        type="number"
                        value={exerciseSettings.sets}
                        onChange={(e) => setExerciseSettings(prev => ({
                          ...prev,
                          sets: Math.max(1, parseInt(e.target.value) || 1)
                        }))}
                        className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {selectedExercise.type === 'время' ? 'секунд' : 'повторов'} за подход
                      </label>
                      <input
                        type="number"
                        value={exerciseSettings.value}
                        onChange={(e) => setExerciseSettings(prev => ({
                          ...prev,
                          value: Math.max(1, parseInt(e.target.value) || 1)
                        }))}
                        className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        min="1"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Время отдыха (секунд)
                      </label>
                      <input
                        type="number"
                        value={exerciseSettings.restTime}
                        onChange={(e) => setExerciseSettings(prev => ({
                          ...prev,
                          restTime: Math.max(10, parseInt(e.target.value) || 10)
                        }))}
                        className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        min="10"
                      />
                    </div>
                  </div>

                  <button
                    onClick={startSingleExercise}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    <Play className="w-5 h-5" />
                    Начать упражнение
                  </button>
                </>
              )}
            </div>
          ) : (
            filteredExercises.map(exercise => (
              <div key={exercise.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <div className="flex gap-4">
                  <img 
                    src={exercise.imageUrl} 
                    alt={exercise.name}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{exercise.name}</h3>
                      <span className={`px-2 py-1 rounded text-sm capitalize ${
                        exercise.difficulty === 'легко' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        exercise.difficulty === 'средне' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {exercise.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">{exercise.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {exercise.muscleGroups.map(group => (
                        <span key={group} className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded text-sm capitalize">
                          {group}
                        </span>
                      ))}
                      {exercise.equipment.map(eq => (
                        <span key={eq} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-sm capitalize">
                          {eq.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                    <div className='flex justify-between'>
                      <button
                        onClick={() => {
                          setSelectedExercise(exercise);
                          setExerciseSettings({
                            sets: 3,
                            value: exercise.defaultValue,
                            restTime: 60,
                          });
                        }}
                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        <Play className="w-4 h-4" />
                        Начать упражнение
                      </button> 
                      <div>{exercise.canDelete}</div>
                      {exercise.canDelete && (
                        <button
                          onClick={() => dispatch(deleteExercise(exercise.id))}
                          className="mt-4 flex items-end gap-2 px-4 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Exercises;