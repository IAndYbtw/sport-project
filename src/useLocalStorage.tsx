import { useState, useEffect } from "react";

function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [data, setData] = useState<T>(() => {
    const savedData = localStorage.getItem(key);
    return savedData ? JSON.parse(savedData) : initialValue;
    });

    useEffect(() => {
    localStorage.setItem(key, JSON.stringify(data));
    }, [key, data]);

    return [data, setData];
}

export default useLocalStorage;
