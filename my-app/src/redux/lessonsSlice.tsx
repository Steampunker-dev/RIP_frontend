// lessonsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api'; // Или путь к вашему API-клиенту

//
// 1. Определяем интерфейсы (при желании можно расширять или упростить):
//
export interface Lesson {
    id: number;
    lesson: string;         // "2025-02-26", например
    date_created: string;   // "0001-01-01T00:00:00Z"
    date_formed: string;    // "0001-01-01T00:00:00Z"
    date_accepted: string;  // "0001-01-01T00:00:00Z"
    status: string;         // "черновик"
    lesson_date: string;    // "2025-02-26T17:25:32.821842Z"
    lesson_type: string;    // "Обычное занятие"
}

interface LessonsFilters {
    dateFrom: string;
    dateTo: string;
    status: string;
}

interface LessonsState {
    lessons: Lesson[];
    qrs: string[];
    filters: LessonsFilters;
    isPolling: boolean;
    pollingTimeout: ReturnType<typeof setTimeout> | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

//
// 2. Начальное состояние
//
const initialState: LessonsState = {
    lessons: [],
    qrs: [],

    filters: {
        dateFrom: '',
        dateTo: '',
        status: '',
    },
    isPolling: false,
    pollingTimeout: null,
    status: 'idle',
    error: null,
};

//
// 3. Асинхронный thunk для получения списка "уроков" (lessons)
//    - если нужно передавать фильтры date_from / date_to / status
//      на бэкенд, формируем query-объект.
//
export const fetchLessons = createAsyncThunk(
    'lessons/fetchLessons',
    async (filters: Partial<LessonsFilters>, { rejectWithValue }) => {
        try {
            const query: Record<string, string> = {};
            if (filters.dateFrom) query.date_from = filters.dateFrom;
            if (filters.dateTo)   query.date_to   = filters.dateTo;
            if (filters.status)   query.status    = filters.status;

            // Предполагаем, что ваш API возвращает объект вида:
            // {
            //   "lessons": [ { ... }, { ... } ]
            // }
            const response = await api.resolution.lessonsList(query);
            return response.data; // => { lessons: [... массив уроков ...] }
        } catch (error: any) {
            return rejectWithValue("Ничего не найдено")
        }
    }
);

//
// 4. Запуск "polling" (регулярного опроса)
//    - каждые 2 секунды мы обновляем список lessons
//
export const startPollingLessons = () => async (dispatch: any, getState: any) => {
    const { filters, isPolling } = getState().lessons;
    if (!isPolling) return;

    await dispatch(fetchLessons(filters));

    // Если за время запроса флаг isPolling не сбросили — ставим следующий таймер
    if (getState().lessons.isPolling) {
        const timeoutId = setTimeout(() => {
            dispatch(startPollingLessons());
        }, 2000);
        dispatch(setPollingTimeout(timeoutId));
    }
};

//
// 5. Остановка "polling"
//    - убиваем таймер и ставим флаг isPolling=false
//
export const stopPollingLessons = () => (dispatch: any, getState: any) => {
    const { pollingTimeout } = getState().lessons;
    if (pollingTimeout) {
        clearTimeout(pollingTimeout);
        dispatch(clearPollingTimeout());
    }
    dispatch(setIsPolling(false));
};

//
// 6. Создаём сам "slice" (хранилище) для lessons
//
const lessonsSlice = createSlice({
    name: 'lessons',
    initialState,
    reducers: {
        setFilters(state, action) {
            state.filters = {
                ...state.filters,
                ...action.payload,
            };
        },
        setIsPolling(state, action) {
            state.isPolling = action.payload;
        },
        setPollingTimeout(state, action) {
            state.pollingTimeout = action.payload;
        },
        clearPollingTimeout(state) {
            state.pollingTimeout = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLessons.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchLessons.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Предполагается, что action.payload = { lessons: [...], qrs: [...] }
                state.lessons = action.payload.lessons;
                state.qrs = action.payload.qrs; // <-- это нужно явно прописать
            })
            .addCase(fetchLessons.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});
// Экспорт экшенов:
export const {
    setFilters,
    setIsPolling,
    setPollingTimeout,
    clearPollingTimeout,
} = lessonsSlice.actions;

// Экспорт редьюсера, чтобы добавить его в store:
export default lessonsSlice.reducer;