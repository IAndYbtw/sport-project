import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, ListOrdered, User, Store, Coins, Moon, Sun, Menu, X, ShoppingBag } from 'lucide-react';
import useUser from '../hook/user';
import React from 'react';


function Navbar() {
  const user = useUser();
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDark.toString());
  }, [isDark]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold flex items-center gap-2">
            <Dumbbell className="h-6 w-6" />
            SportTracker
          </Link>

          <div className="flex items-center space-x-6">
            <button
              onClick={() => setIsDark((prev) => !prev)}
              className="p-2 rounded-full hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <div className="flex items-center gap-2 bg-indigo-700 dark:bg-indigo-800 px-3 py-1.5 rounded-full">
              <Coins className="h-5 w-5 text-yellow-400" />
              <span className="font-medium">{user?.points || 0}</span>
            </div>

            {}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="sm:hidden p-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-800"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <div className="flex space-x-4">
              <Link to="/exercises" className="flex items-center gap-1 hover:text-indigo-200">
                <ListOrdered className="h-5 w-5" />
                Упражнения
              </Link>
              <Link to="/workouts" className="flex items-center gap-1 hover:text-indigo-200">
                <Dumbbell className="h-5 w-5" />
                Тренировки
              </Link>
              <Link to="/shop" className="flex items-center gap-1 hover:text-indigo-200">
                <Store className="h-5 w-5" />
                Магазин
              </Link>
              <Link to="/profile" className="flex items-center gap-1 hover:text-indigo-200">
                <User className="h-5 w-5" />
                Профиль
              </Link>
            </div>
          </div>
        </div>
        {}
        {isMenuOpen && (
          <div className="sm:hidden py-4 space-y-2">
            <div className="flex items-center gap-2 bg-indigo-700 dark:bg-indigo-800 px-3 py-1.5 rounded-full w-fit mb-4">
              <Coins className="h-5 w-5 text-yellow-400" />
              <span className="font-medium">{user?.points || 0}</span>
            </div>
            <Link 
              to="/exercises" 
              className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-700 dark:hover:bg-indigo-800 rounded-lg"
              onClick={closeMenu}
            >
              <ListOrdered className="h-5 w-5" />
              Exercises
            </Link>
            <Link 
              to="/workouts" 
              className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-700 dark:hover:bg-indigo-800 rounded-lg"
              onClick={closeMenu}
            >
              <Dumbbell className="h-5 w-5" />
              Workouts
            </Link>
            <Link 
              to="/shop" 
              className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-700 dark:hover:bg-indigo-800 rounded-lg"
              onClick={closeMenu}
            >
              <ShoppingBag className="h-5 w-5" />
              Shop
            </Link>
            <Link 
              to="/profile" 
              className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-700 dark:hover:bg-indigo-800 rounded-lg"
              onClick={closeMenu}
            >
              <User className="h-5 w-5" />
              Profile
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;