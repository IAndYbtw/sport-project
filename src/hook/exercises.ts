import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Exercise } from "../types";
import { addExercise } from "../store/exercisesSlice";
import { RootState } from "../store";


const useExercises =(): Exercise [] => {
	const dispatch = useDispatch();
	const exercises = useSelector((state: RootState) => state.exercises.items);


		useEffect(() => {
		const savedExercises = localStorage.getItem('exercisesData');
		if (savedExercises) {
			const parsedExercises = JSON.parse(savedExercises) as Exercise[];
			parsedExercises.forEach((exercise) => dispatch(addExercise(exercise)))
		}		}, [dispatch]);

	return exercises;
	};
export default useExercises;