import { createSlice } from '@reduxjs/toolkit';
import type { ShopItem } from '../types';

interface ShopState {
    items: ShopItem[];
}

const initialState: ShopState = {
    items: [
        {
            id: 'avatar1',
            name: 'Рыжий спортсмен',
            description: 'Крутой рыжий человек',
            price: 100,
            previewSrc: '../character1.png',
        },
        {
            id: 'avatar2',
            name: 'Спортсмен на кондициях',
            description: 'На кондициях и амбициях',
            price: 150,
            previewSrc: '../character2.png',
        },
        {
            id: 'avatar3',
            name: 'Старый спортсмен',
            description: 'Прожил всю жизнь в спортивном зале',
            price: 200,
            previewSrc: '../character3.png',
        },
        {
            id: 'avatar4',
            name: 'Босс качалки',
            description: 'Стань боссом качалки!',
            price: 300,
            previewSrc: '/character4.png',
        },
        {
            id: 'avatar5',
            name: 'Спортсмен',
            description: 'Молодой и успешный',
            price: 50,
            previewSrc: '../character5.png'
        },
        {
            id: 'avatar6',
            name: 'Молодой человек',
            description: 'Выглядит опытным и уверенным в себе',
            price: 75,
            previewSrc: '../character6.png'
        }
        ]
    };

const shopSlice = createSlice({
    name: 'shop',
    initialState,
    reducers: {}
});

export default shopSlice.reducer;