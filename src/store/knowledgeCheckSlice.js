import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { knowledgeCheckApi } from '../services/api';

const initialState = {
  knowledgeChecks: [],
  studentAttempts: [],
  loading: false,
  error: null,
  lastSubmission: null,
};

export const fetchKnowledgeChecks = createAsyncThunk(
  'knowledgeCheck/fetchAll',
  async (_, thunkAPI) => {
    try {
      return await knowledgeCheckApi.list();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createKnowledgeCheck = createAsyncThunk(
  'knowledgeCheck/create',
  async (payload, thunkAPI) => {
    try {
      return await knowledgeCheckApi.create(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateKnowledgeCheck = createAsyncThunk(
  'knowledgeCheck/update',
  async ({ id, data }, thunkAPI) => {
    try {
      return await knowledgeCheckApi.update(id, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const attachKnowledgeChecks = createAsyncThunk(
  'knowledgeCheck/attach',
  async (payload, thunkAPI) => {
    try {
      return await knowledgeCheckApi.attach(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteKnowledgeCheck = createAsyncThunk(
  'knowledgeCheck/delete',
  async (id, thunkAPI) => {
    try {
      await knowledgeCheckApi.remove(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const submitAttempt = createAsyncThunk(
  'knowledgeCheck/submitAttempt',
  async ({ id, answers }, thunkAPI) => {
    try {
      return await knowledgeCheckApi.submitAttempt(id, { answers });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const knowledgeCheckSlice = createSlice({
  name: 'knowledgeCheck',
  initialState,
  reducers: {
    clearLastSubmission(state) {
      state.lastSubmission = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchKnowledgeChecks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKnowledgeChecks.fulfilled, (state, action) => {
        state.loading = false;
        state.knowledgeChecks = action.payload.knowledgeChecks || [];
        state.studentAttempts = (action.payload.attempts || []).map((a) => ({
          ...a,
          timestamp: a.timestamp,
        }));
      })
      .addCase(fetchKnowledgeChecks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(createKnowledgeCheck.fulfilled, (state, action) => {
        state.knowledgeChecks.unshift(action.payload.knowledgeCheck);
      })
      .addCase(updateKnowledgeCheck.fulfilled, (state, action) => {
        const updated = action.payload.knowledgeCheck;
        state.knowledgeChecks = state.knowledgeChecks.map((kc) =>
          kc.id === updated.id || kc._id === updated.id ? updated : kc
        );
      })
      .addCase(attachKnowledgeChecks.fulfilled, (state, action) => {
        const updatedMap = Object.fromEntries(
          (action.payload.knowledgeChecks || []).map((kc) => [kc.id, kc])
        );
        state.knowledgeChecks = state.knowledgeChecks.map(
          (kc) => updatedMap[kc.id] || kc
        );
      })
      .addCase(deleteKnowledgeCheck.fulfilled, (state, action) => {
        state.knowledgeChecks = state.knowledgeChecks.filter(
          (kc) => kc.id !== action.payload && kc._id !== action.payload
        );
      })
      .addCase(submitAttempt.fulfilled, (state, action) => {
        state.lastSubmission = action.payload;
        if (action.payload.attempt) {
          state.studentAttempts.unshift(action.payload.attempt);
        }
      });
  },
});

export const { clearLastSubmission } = knowledgeCheckSlice.actions;
export default knowledgeCheckSlice.reducer;
