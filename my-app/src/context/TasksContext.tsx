import { createContext, useReducer, useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Api } from "../api/Api";
import { DsTasks } from "../api/Api";
import { setResId, setResCount } from "../redux/taskSlice"; // ✅ Импортируем экшены Redux

const api = new Api();

interface TasksState {
    tasks: DsTasks[];
    loading: boolean;
    filter: string;
}

const initialState: TasksState = {
    tasks: [],
    loading: false,
    filter: localStorage.getItem("tasksFilter") || "", // Загружаем фильтр из localStorage
};

// Определяем возможные действия
type Action =
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_TASKS"; payload: DsTasks[] }
    | { type: "SET_FILTER"; payload: string };

// Редьюсер
const tasksReducer = (state: TasksState, action: Action): TasksState => {
    switch (action.type) {
        case "SET_LOADING":
            return { ...state, loading: action.payload };
        case "SET_TASKS":
            return { ...state, tasks: action.payload || [] };
        case "SET_FILTER":
            return { ...state, filter: action.payload };
        default:
            return state;
    }
};

// Создаём контекст
const TasksContext = createContext<{
    state: TasksState;
    dispatch: React.Dispatch<Action>;
    applyFilter: (newFilter: string) => void;
}>({
    state: initialState,
    dispatch: () => null,
    applyFilter: () => {},
});

// Провайдер
export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(tasksReducer, initialState);
    const reduxDispatch = useDispatch(); // ✅ Диспатч Redux

    useEffect(() => {
        loadTasks(state.filter);
    }, [state.filter]);

    // Функция загрузки задач
    const loadTasks = async (filter: string) => {
        dispatch({ type: "SET_LOADING", payload: true });

        try {
            const response = await api.task.fineList({ minutesFrom: filter });

            // ✅ Обновляем Redux после получения данных
            reduxDispatch(setResId(response.data.resId || 0));
            reduxDispatch(setResCount(response.data.resCount || 0));

            dispatch({ type: "SET_TASKS", payload: response.data.tasks || [] });
        } catch (error) {
            console.error("Ошибка загрузки задач:", error);
            dispatch({ type: "SET_TASKS", payload: [] });
        }

        dispatch({ type: "SET_LOADING", payload: false });
    };

    // Фильтрация БЕЗ перезагрузки страницы
    const applyFilter = async (newFilter: string) => {
        localStorage.setItem("tasksFilter", newFilter); // ✅ Сохраняем фильтр в localStorage
        dispatch({ type: "SET_FILTER", payload: newFilter }); // ✅ Запускает useEffect → загружает новые задачи
    };

    return (
        <TasksContext.Provider value={{ state, dispatch, applyFilter }}>
            {children}
        </TasksContext.Provider>
    );
};

// Хук для использования контекста
export const useTasks = () => {
    return useContext(TasksContext);
};