import { Trophy, Dumbbell, Coins } from 'lucide-react';
import type { Achievement } from '../types';

interface AchievementCardProps {
    achievement: Achievement;
    progress: number;
    completed: boolean;
}

function AchievementCard({ achievement, progress, completed }: AchievementCardProps) {
  const progressPercent = Math.min((progress / achievement.requirement) * 100, 100);

    const icons = {
    trophy: Trophy,
    dumbbell: Dumbbell,
    coins: Coins,
    };

    const Icon = icons[achievement.icon as keyof typeof icons] || Trophy;

    return (
    <div className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md ${
        completed ? 'border-2 border-green-500 dark:border-green-600' : ''
    }`}>
        <div className="flex items-start gap-4">
        <div className={`p-3 rounded-full ${
            completed 
            ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
        }`}>
            <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {achievement.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            {achievement.description}
            </p>
            <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                Прогресс: {progress}/{achievement.requirement}
                </span>
                <span>
                    <Coins className="w-4 h-4 " />
                {achievement.reward}
                </span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                className={`h-full rounded-full ${
                    completed 
                    ? 'bg-green-500 dark:bg-green-600' 
                    : 'bg-indigo-500 dark:bg-indigo-600'
                }`}
                style={{ width: `${progressPercent}%` }}
                />
            </div>
            </div>
        </div>
        </div>
    </div>
);
}

export default AchievementCard;