import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { User } from "../types";
import { setUser } from "../store/userSlice";
import { RootState } from "../store";

const useUser =(): User | null => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.data);


        useEffect(() => {
        const savedUser = localStorage.getItem('userData');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            dispatch(setUser(parsedUser));
        } else {
            const newUser: User = {
                name: '',
                height: 170,
                weight: 70,
                goal: '',
                points: 0,
                level: 1,
                completedWorkouts: 0,
                ownedItems: ['default.png'],
                exercisesCompleted: 0,
                achievements: undefined,
                avatarNow: ""
            };
            dispatch(setUser(newUser));
            localStorage.setItem('userData', JSON.stringify(newUser));
        }
        }, [dispatch]);

    return user;
    };
export default useUser;