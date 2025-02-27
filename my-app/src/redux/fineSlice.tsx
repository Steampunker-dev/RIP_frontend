// src/redux/fineSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DsFines } from "../api/Api.ts";
import { api  } from "../api";
import { ALBUMS_MOCK } from "../modules/mock.ts";
import {fetchCart} from "./resolutionSlice.tsx";

export interface FinesState {
    searchValue: string;
    loading: boolean;
    fines: DsFines[];
    resCount: number;
    resId: number;
}

const initialState: FinesState = {
    searchValue: '',
    loading: false,
    fines: [],
    resCount: 0,
    resId: 0,
};


// ✅ Thunk для создания нового штрафа
export const createFine = createAsyncThunk(
    'fine/createFine',
    async (newFine: DsFines, { rejectWithValue, dispatch }) => {
        try {
            const response = await api.fine.createCreate(newFine);
            dispatch(getFinesList()); // ✅ Обновляем список штрафов после создания
            return response.data;
        } catch (error) {
            return rejectWithValue("Ошибка при создании штрафа");
        }
    }
);

export const getFinesList = createAsyncThunk(
    'fine/fineList',
    async (_, { getState, rejectWithValue }) => {
        // Правильно достаем состояние из store: обращаемся к fines
        const state = getState() as { fines: FinesState };
        const searchValue = state.fines.searchValue;


        try {
            const response = await api.fine.fineList({ minutesFrom: searchValue });
            await console.log(response.data)
            return response.data;

        } catch (error) {
            return rejectWithValue('Ошибка при загрузке данных');
        }
    }
);

export const deleteFine = createAsyncThunk(
    "fines/deleteFine",
    async (fineID: number, { rejectWithValue }) => {
    try {
        await api.fines.deleteDelete(fineID);
        return fineID;
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
    'fine/addFineToResolution',
    async (fineId: number, thunkAPI) => {
        try {
            const response = await api.fine.postFine(fineId);
            console.log(`✅ Задача ${fineId} добавлена в заявку:`, response.data);

            // ✅ Получаем новый `resId` от сервера
            // @ts-ignore
            let updatedResId = response.data?.resId || localStorage.getItem('resId');

            if (updatedResId && updatedResId !== '0') {
                console.log(`🔄 Обновляем resId: ${updatedResId}`);

                // ✅ Обновляем `localStorage`
                localStorage.setItem('resId', updatedResId);

                // ✅ Обновляем `Redux`
                thunkAPI.dispatch(finesSlice.actions.updateResId(updatedResId));

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
    'fine/updateFine',
    async ({ id, fine }: { id: number; fine: DsFines }, { rejectWithValue }) => {
        try {
            const response = await api.fine.updateUpdate(id, fine);
            return response.data;
        } catch (error) {
            return rejectWithValue('Ошибка при обновлении штрафа');
        }
    }
);

const finesSlice = createSlice({
    name: 'fines',
    initialState,
    reducers: {
        setSearchValue(state, action) {
            state.searchValue = action.payload;
        },
        updateResId(state, action) {
            state.resId = action.payload; // ✅ Обновляем `resId` в Redux
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getFinesList.pending, (state) => {
                state.loading = true;
            })
            .addCase(getFinesList.fulfilled, (state, action) => {
                state.loading = false;
                state.fines = action.payload?.fines ?? []; // Если fines нет, ставим пустой массив
                state.resCount = action.payload?.resCount ?? 0;
                state.resId = action.payload?.resId ?? 0;
                // @ts-ignore
                localStorage.setItem('resId', action.payload.resId);
            })
            .addCase(getFinesList.rejected, (state) => {
                state.loading = false;
                state.fines = ALBUMS_MOCK.fines.filter((item) =>
                    item.title.toLocaleLowerCase().startsWith(state.searchValue.toLocaleLowerCase())
                );
                state.resCount = ALBUMS_MOCK.resCount;
                state.resId = ALBUMS_MOCK.resId;
                console.log("error")
            })
            .addCase(updateFine.fulfilled, (state, action) => {
                state.fines = state.fines.map((fine) =>
                    fine.fineID === action.payload.fineID ? action.payload : fine
                );
            })
            .addCase(deleteFine.fulfilled, (state, action) => {
                state.fines = state.fines.filter((fine) => fine.fineID !== action.payload);
            })
            .addCase(uploadFineImage.fulfilled, (state, action) => {
                state.fines = state.fines.map((fine) =>
                    fine.fineID === action.payload.fineID
                        ? { ...fine, imge: action.payload.imageUrl }
                        : fine
                );
            })
            .addCase(createFine.fulfilled, (state, action) => {
                state.fines.push(action.payload); // ✅ Добавляем новый штраф в список
            });
    },
});

export const { setSearchValue } = finesSlice.actions;
export default finesSlice.reducer;