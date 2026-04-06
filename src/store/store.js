import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import notificationsReducer from './notificationsSlice';
import knowledgeCheckReducer from './knowledgeCheckSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationsReducer,
    knowledgeCheck: knowledgeCheckReducer
  }
});

export default store;
