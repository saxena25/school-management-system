import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const loadStoredUser = () => {
  const storedUser = localStorage.getItem('user');
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    localStorage.removeItem('user');
    return null;
  }
};

const initialState = {
  user: loadStoredUser(),
  isAuthenticated: Boolean(loadStoredUser()),
  loading: false,
  error: null
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, thunkAPI) => {
    const emailPrefix = email.split('@')[0];
    let role;

    if (emailPrefix === 'student') {
      role = 'student';
    } else if (emailPrefix === 'teacher') {
      role = 'teacher';
    } else if (emailPrefix === 'principal') {
      role = 'principal';
    } else if (emailPrefix === 'admin') {
      role = 'admin';
    }

    if (!role) {
      return thunkAPI.rejectWithValue('Invalid email. Use format: role@school.com');
    }

    const userData = {
      email,
      role,
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      joinDate: new Date().toISOString()
    };

    if (role === 'admin') {
      userData.permissions = [
        'manage_timetable',
        'manage_exams',
        'manage_students',
        'manage_teachers',
        'manage_fees',
        'manage_profiles'
      ];
    }

    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('user');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.loading = false;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
