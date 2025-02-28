// src/redux/fineSlice.ts
import {createAsyncThunk, createSlice,PayloadAction} from '@reduxjs/toolkit';
import {DsTasks} from "../api/Api.ts";
import {api} from "../api";
import {ALBUMS_MOCK} from "../modules/mock.ts";
import {fetchCart} from "./resolutionSlice.tsx";

export interface TaskState {
    searchValue: string;
    loading: boolean;
    tasks: DsTasks[];
    resCount: number;
    resId: number;
}

const initialState: TaskState = {
    searchValue: '',
    loading: false,
    tasks: [],
    resCount: 0,
    resId: 0,
};


// ✅ Thunk для создания нового штрафа
export const createFine = createAsyncThunk(
    'task/createFine',
    async (newFine: DsTasks, { rejectWithValue, dispatch }) => {
        try {
            const response = await api.task.createCreate(newFine);
            dispatch(getFinesList()); // ✅ Обновляем список штрафов после создания
            return response.data;
        } catch (error) {
            return rejectWithValue("Ошибка при создании штрафа");
        }
    }
);

export const getFinesList = createAsyncThunk(
    'task/fineList',
    async (_, { getState, rejectWithValue }) => {
        // Правильно достаем состояние из store: обращаемся к fines
        const state = getState() as { tasks: TaskState };
        const searchValue = state.tasks.searchValue;


        try {
            const response = await api.task.fineList({ minutesFrom: searchValue });
            await console.log(response.data)
            return response.data;

        } catch (error) {
            return rejectWithValue('Ошибка при загрузке данных');
        }
    }
);

export const deleteFine = createAsyncThunk(
    "tasks/deleteFine",
    async (taskID: number, { rejectWithValue }) => {
    try {
        await api.tasks.deleteDelete(taskID);
        return taskID;
    } catch (error) {
        return rejectWithValue("Ошибка при удалении штрафа");
    }
});

export const uploadFineImage = createAsyncThunk(
    "fine/uploadFineImage",
    async ({ fineID, formData }: { fineID: number; formData: FormData }, { rejectWithValue }) => {
        try {
            // @ts-ignore
            await api.fine.postFine2(fineID, formData);
            return { fineID, imageUrl: URL.createObjectURL(formData.get("image") as File) };
        } catch (error) {
            return rejectWithValue("Ошибка при загрузке изображения");
        }
    }
);

export const addFineToResolution = createAsyncThunk(
    'task/addFineToResolution',
    async (fineId: number, thunkAPI) => {
        try {
            const response = await api.task.postFine(fineId);
            console.log(`✅ Задача ${fineId} добавлена в заявку:`, response.data);

            // ✅ Получаем новый `resId` от сервера
            // @ts-ignore
            let updatedResId = response.data?.resId || localStorage.getItem('resId');

            if (updatedResId && updatedResId !== '0') {
                console.log(`🔄 Обновляем resId: ${updatedResId}`);

                // ✅ Обновляем `localStorage`
                localStorage.setItem('resId', updatedResId);

                // ✅ Обновляем `Redux`
                thunkAPI.dispatch(taskSlice.actions.updateResId(updatedResId));

                // ✅ Дожидаемся обновления Redux перед `fetchCart()`
                await new Promise((resolve) => setTimeout(resolve, 10));

                // ✅ Загружаем обновленную корзину
                await thunkAPI.dispatch(fetchCart());
            } else {
                console.error("⚠ Ошибка: resId не обновился.");
            }

            return fineId;
        } catch (error) {
            console.error("❌ Ошибка добавления штрафа:", error);
            return thunkAPI.rejectWithValue("Ошибка при добавлении штрафа");
        }
    }
);

export const updateFine = createAsyncThunk(
    'task/updateFine',
    async ({ id, task }: { id: number; task: DsTasks }, { rejectWithValue }) => {
        try {
            const response = await api.task.updateUpdate(id, task);
            return response.data;
        } catch (error) {
            return rejectWithValue('Ошибка при обновлении штрафа');
        }
    }
);

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setSearchValue(state, action) {
            state.searchValue = action.payload;
        },
        updateResId(state, action) {
            state.resId = action.payload; // ✅ Обновляем `resId` в Redux
        },
        setResId(state, action: PayloadAction<number>) {
            state.resId = action.payload;
        },
        setResCount(state, action: PayloadAction<number>) {
            state.resCount = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getFinesList.pending, (state) => {
                state.loading = true;
            })
            .addCase(getFinesList.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload?.tasks ?? []; // Если fines нет, ставим пустой массив
                state.resCount = action.payload?.resCount ?? 0;
                state.resId = action.payload?.resId ?? 0;
                // @ts-ignore
                localStorage.setItem('resId', action.payload.resId);
            })
            .addCase(getFinesList.rejected, (state) => {
                state.loading = false;
                state.tasks = ALBUMS_MOCK.tasks.filter((item) =>
                    item.title.toLocaleLowerCase().startsWith(state.searchValue.toLocaleLowerCase())
                );
                state.resCount = ALBUMS_MOCK.resCount;
                state.resId = ALBUMS_MOCK.resId;
                console.log("error")
            })
            .addCase(updateFine.fulfilled, (state, action) => {
                state.tasks = state.tasks.map((task) =>
                    task.id === action.payload.id ? action.payload : task
                );
            })
            .addCase(deleteFine.fulfilled, (state, action) => {
                state.tasks = state.tasks.filter((task) => task.id !== action.payload);
            })
            .addCase(uploadFineImage.fulfilled, (state, action) => {
                state.tasks = state.tasks.map((task) =>
                    task.id === action.payload.fineID
                        ? { ...task, imge: action.payload.imageUrl }
                        : task
                );
            })
            .addCase(createFine.fulfilled, (state, action) => {
                state.tasks.push(action.payload); // ✅ Добавляем новый штраф в список
            });
    },
});

export const { setSearchValue,setResId, setResCount } = taskSlice.actions;
export default taskSlice.reducer;