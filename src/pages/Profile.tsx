import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User } from '../types';
import { updateUser } from '../store/userSlice';
import { User2, Weight, Ruler, Trophy, Dumbbell, Edit2, BarChart2 } from 'lucide-react';
import useUser from '../hook/user';
import { RootState } from '../store';
import AchievementCard from '../components/AchievementsCard';
import defaultPicture from '../character/default.png';


function Profile() {
  const dispatch = useDispatch();
  const user = useUser();
  const achievements = useSelector((state: RootState) => state.achievements.items);  
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'achievements' | 'customization'>('info');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    height: user?.height || 170,
    weight: user?.weight || 70,
    goal: user?.goal || '',
    avatarNow: user?.avatarNow || defaultPicture
  });

  const avatarImages: { [key: string]: string } = {
    avatar1: '/src/character/character1.png',
    avatar2: '/src/character/character2.png',
    avatar3: '/src/character/character3.png',
    avatar4: '/src/character/character4.png',
    avatar5: '/src/character/character5.png',
    avatar6: '/src/character/character6.png',
    defaultPicture: '/src/character/default.png',
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'height' || name === 'weight' ? Number(value) : value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAvatar = e.target.value;
    setFormData(prev => ({
      ...prev,
      avatarNow: selectedAvatar
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: User = {
      ...user!,
      ...formData
    };
    dispatch(updateUser(updatedUser));
    localStorage.setItem('userData', JSON.stringify(updatedUser));
    setIsEditing(false);
  };
  
  const imt = user ? Math.floor(user.weight / ((user.height / 100) ** 2)) : 0;

  const getIMTCategory = (imt: number): string => {
    if (imt <= 16) return "Выраженный дефицит массы тела";
    if (imt > 16 && imt <= 18.5) return "Недостаточная (дефицит) масса тела";
    if (imt > 18.5 && imt <= 25) return "Норма";
    if (imt > 25 && imt <= 30) return "Избыточная масса тела (предожирение)";
    if (imt > 30 && imt <= 35) return "Ожирение первой степени";
    if (imt > 35 && imt <= 40) return "Ожирение второй степени";
    return "Ожирение третьей степени (морбидное)";
  };

  const category = getIMTCategory(imt);
  const completedWorkouts = user?.completedWorkouts || 0;
  const exercisesCompleted = user?.exercisesCompleted || 0;
  const totalPoints = user?.points || 0;
  const level = user?.level || 1;

  
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-6">
        {}
        <div className="md:w-1/3 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Твой персонаж</h2>
            <img src={user?.avatarNow ? avatarImages[user.avatarNow] : defaultPicture}/>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-900 dark:text-white">Уровень {level}</span>
              </div>
              <div className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-gray-900 dark:text-white">{completedWorkouts} тренировки</span>
              </div>
            </div>
            <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full" 
                style={{ width: `${(totalPoints % 100)}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{totalPoints} очки</p>
          </div>
        </div>

        {}
        <div className="md:w-2/3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            {}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('info')}
                className={`flex-1 py-4 px-6 text-center ${
                  activeTab === 'info'
                    ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Персональная информация
              </button>
              <button
                onClick={() => setActiveTab('achievements')}
                className={`flex-1 py-4 px-6 text-center ${
                  activeTab === 'achievements'
                    ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Достижения
              </button>
            </div>

            {}
            <div className="p-6">
              {activeTab === 'info' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Персональная информация</h2>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
                      >
                        <Edit2 className="w-4 h-4" />
                        Изменить профиль
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Имя
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                            <User2 className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                          </div>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            placeholder="Имя"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Рост (см)
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                            <Ruler className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                          </div>
                          <input
                            type="number"
                            name="height"
                            id="height"
                            value={formData.height}
                            onChange={handleInputChange}
                            className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Вес (кг)
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                            <Weight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                          </div>
                          <input
                            type="number"
                            name="weight"
                            id="weight"
                            value={formData.weight}
                            onChange={handleInputChange}
                            className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="goal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Цель тренировок
                        </label>
                        <input
                          name="goal"
                          id="goal"
                          value={formData.goal}
                          onChange={handleInputChange}
                          placeholder="Цель"
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                        >
                        </input>
                      </div>

                      <div>
                        <label htmlFor="avatarNow" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Выберите персонажа
                        </label>
                        <select
                          name="avatarNow"
                          id="avatarNow"
                          value={formData.avatarNow}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                          onChange={handleAvatarChange}
                        >
                          {user && user.ownedItems.map((item, index) => (
                            <option key={index} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex gap-4">
                        <button
                          type="submit"
                          className="flex-1 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                        >
                          Сохранить
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="flex-1 justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                        >
                          Отмена
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <User2 className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Имя</p>
                          <p className="font-medium text-gray-900 dark:text-white">{user?.name || 'Not set'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Ruler className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Рост</p>
                          <p className="font-medium text-gray-900 dark:text-white">{user?.height || 'Not set'} см</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Weight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Вес</p>
                          <p className="font-medium text-gray-900 dark:text-white">{user?.weight || 'Not set'} кг</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Dumbbell className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Цель тренировок</p>
                          <p className="font-medium text-gray-900 dark:text-white capitalize">
                            {user?.goal?.replace('-', ' ') || 'Not set'}
                          </p>
                        </div>
                      </div>

                      <div className='flex items-center gap-3'>
                        <BarChart2 className="w-5 h-5 text-gray-400 dark:text-gray-500"/>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">ИМТ</p>
                          <p className="font-medium text-gray-900 dark:text-white capitalize">
                            {imt}
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white capitalize">
                            {category}
                          </p>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              )}

              {activeTab === 'achievements' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    {achievements.map(achievement => {
                      let progress = 0;
                      if (achievement.type === 'workouts') {
                        progress = completedWorkouts;
                      } else if (achievement.type === 'exercises') {
                        progress = exercisesCompleted;
                      } else if (achievement.type === 'points') {
                        progress = totalPoints;
                      }

                      const completed = user?.achievements?.includes(achievement.id) || false;

                      return (
                        <AchievementCard
                          key={achievement.id}
                          achievement={achievement}
                          progress={progress}
                          completed={completed}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;