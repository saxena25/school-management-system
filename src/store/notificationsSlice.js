import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [
    {
      id: 1,
      title: 'Assignment Due',
      message: 'Mathematics assignment is due tomorrow',
      type: 'assignment',
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      priority: 'high'
    },
    {
      id: 2,
      title: 'Exam Schedule',
      message: 'Science exam scheduled for next week',
      type: 'exam',
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Grade Posted',
      message: 'Your English grade has been posted',
      type: 'grade',
      read: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      priority: 'low'
    },
    {
      id: 4,
      title: 'Class Cancelled',
      message: 'History class is cancelled today',
      type: 'announcement',
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      priority: 'high'
    },
    {
      id: 5,
      title: 'Parent Meeting',
      message: 'Parent-teacher meeting scheduled for Friday',
      type: 'meeting',
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      priority: 'medium'
    },
    {
      id: 6,
      title: 'Fee Payment Reminder',
      message: 'School fees payment is due',
      type: 'fee',
      read: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      priority: 'high'
    },
    {
      id: 7,
      title: 'Sports Event',
      message: 'Annual sports day registration open',
      type: 'event',
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
      priority: 'low'
    },
    {
      id: 8,
      title: 'Library Book Due',
      message: 'Your borrowed book is due tomorrow',
      type: 'library',
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
      priority: 'medium'
    }
  ]
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    markAsRead(state, action) {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) notification.read = true;
    },
    markAllAsRead(state) {
      state.notifications.forEach((notification) => {
        notification.read = true;
      });
    }
  }
});

export const { markAsRead, markAllAsRead } = notificationsSlice.actions;
export default notificationsSlice.reducer;
