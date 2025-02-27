import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';

interface UserState {
    token: string | null;
    login: string;
    isAuthenticated: boolean;
    isAdmin: boolean;  // ✅ Теперь учитываем роль администратора
    error: string | null;
}

const initialState: UserState = {
    token: null,
    login: '',
    isAuthenticated: false,
    isAdmin: false,  // ✅ Начальное значение — false
    error: null,
};

// **Логин с получением роли**
export const loginUserAsync = createAsyncThunk(
    'user/loginUserAsync',
    async (credentials: { login: string; password: string }, { rejectWithValue }) => {
        try {
            console.log(credentials)

            const response = await api.user.loginCreate(credentials);

            return response.data; // Предполагаем, что ответ содержит { token, login, isAdmin }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка авторизации');
        }
    }
);

// **Выход из системы**
export const logoutUserAsync = createAsyncThunk(
    'user/logoutUserAsync',
    async (credentials: { login: string }, { rejectWithValue }) => {
        try {
            console.log("Отправляемый объект:", credentials);
            await api.user.logoutCreate(credentials); // Передаем credentials как body
            return true;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка при выходе');
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCredentials(state, action) {
            state.token = action.payload.token;
            state.login = action.payload.login;
            state.isAdmin = action.payload.isAdmin;  // ✅ Устанавливаем isAdmin
            state.isAuthenticated = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUserAsync.pending, (state) => {
                state.error = null;
            })
            .addCase(loginUserAsync.fulfilled, (state, action) => {
                // @ts-ignore
                const { token, login, isAdmin } = action.payload;
                state.token = token;
                state.login = login;
                state.isAdmin = Boolean(isAdmin);  // ✅ Преобразуем в булево
                state.isAuthenticated = true;
                state.error = null;

                localStorage.setItem('token', token);
                localStorage.setItem('login', login);
                localStorage.setItem('isAdmin', String(isAdmin));  // ✅ Сохраняем в localStorage
            })
            .addCase(loginUserAsync.rejected, (state, action) => {
                state.error = action.payload as string;
                state.token = null;
                state.login = '';
                state.isAdmin = false;  // ✅ Сбрасываем isAdmin
                state.isAuthenticated = false;
            })
            .addCase(logoutUserAsync.fulfilled, (state) => {
                state.token = null;
                state.login = '';
                state.isAuthenticated = false;
                state.isAdmin = false;  // ✅ Сбрасываем isAdmin
                state.error = null;

                localStorage.removeItem('token');
                localStorage.removeItem('login');
                localStorage.removeItem('isAdmin');  // ✅ Удаляем из localStorage
                localStorage.removeItem('resId');
            })
            .addCase(logoutUserAsync.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const { setCredentials } = userSlice.actions;
export default userSlice.reducer;
