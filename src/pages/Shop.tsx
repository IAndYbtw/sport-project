import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { updateUser } from '../store/userSlice';
import { ShoppingBag, Coins } from 'lucide-react';
import useUser from '../hook/user';

function Shop() {
    const dispatch = useDispatch();
    const shopItems = useSelector((state: RootState) => state.shop.items);
    const user = useUser();
    
    const handlePurchase = (itemId: string, price: number, ) => {
        if (!user) return;

        if (user.points < price) {
            alert('Не хватает очков!');
            return;
        }

        if (user.ownedItems.includes(itemId)) {
            alert('Ты уже купил эту вещь');
            return;
        }

        const updatedUser = {
            ...user,
            points: user.points - price,
            ownedItems: [...user.ownedItems, itemId],
        };

        dispatch(updateUser(updatedUser));
        localStorage.setItem('userData', JSON.stringify(updatedUser));
    };

    return (
    <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Магазин</h1>
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
            <Coins className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold text-gray-900 dark:text-white">{user?.points || 0} Очки</span>
        </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {shopItems.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6 sm:p-6">
                <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                <span className="flex items-center gap-1 text-yellow-500">
                    <Coins className="w-4 h-4" />
                    {item.price}
                </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{item.description}</p>
                <div className="flex items-center justify-between">
                <button
                    onClick={() => handlePurchase(item.id, item.price)}
                    disabled={!user || user.points < item.price || user.ownedItems.includes(item.name)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium ${
                    !user || user.points < item.price
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : user.ownedItems.includes(item.name)
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                >
                    <ShoppingBag className="w-4 h-4" />
                    {user && user?.ownedItems.includes(item.name)
                    ? 'Приобретено'
                    : user?.points && user?.points > item.price
                    ? 'Купить'
                    : 'Купить'}
                </button>
                </div>
            </div>
            </div>
        ))}
        </div>
    </div>
    );
}

export default Shop;