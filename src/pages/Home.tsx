import { Link } from 'react-router-dom';
import { Dumbbell, ListOrdered, User, Store } from 'lucide-react';

function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">Добро пожаловать в SportTracker</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Link 
          to="/exercises" 
          className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <ListOrdered className="h-6 sm:h-8 w-6 sm:w-8 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">Каталог упражнений</h2>
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Просмотрите нашу коллекцию упражнений, отфильтруйте их по группам мышц и найдите идеальные движения для вашей тренировки.
          </p>
        </Link>

        <Link 
          to="/workouts" 
          className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <Dumbbell className="h-6 sm:h-8 w-6 sm:w-8 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">Тренировки</h2>
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Создавайте собственные тренировки или используйте наши готовые планы для достижения своих целей в фитнесе.
          </p>
        </Link>

        <Link 
          to="/shop" 
          className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <Store className="h-6 sm:h-8 w-6 sm:w-8 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">Магазин</h2>
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Покупай скины и одежду для своего персонажа.
          </p>
        </Link>

        <Link 
          to="/profile" 
          className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <User className="h-6 sm:h-8 w-6 sm:w-8 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">Профиль</h2>
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Отслеживайте свой прогресс, настраивайте своего персонажа и просматривайте свои достижения.
          </p>
        </Link>
      </div>
    </div>
  );
}

export default Home;