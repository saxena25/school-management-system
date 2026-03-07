import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Assignment Due',
      message: 'Mathematics assignment is due tomorrow',
      type: 'assignment',
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      priority: 'high'
    },
    {
      id: 2,
      title: 'Exam Schedule',
      message: 'Science exam scheduled for next week',
      type: 'exam',
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Grade Posted',
      message: 'Your English grade has been posted',
      type: 'grade',
      read: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      priority: 'low'
    },
    {
      id: 4,
      title: 'Class Cancelled',
      message: 'History class is cancelled today',
      type: 'announcement',
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      priority: 'high'
    },
    {
      id: 5,
      title: 'Parent Meeting',
      message: 'Parent-teacher meeting scheduled for Friday',
      type: 'meeting',
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      priority: 'medium'
    },
    {
      id: 6,
      title: 'Fee Payment Reminder',
      message: 'School fees payment is due',
      type: 'fee',
      read: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
      priority: 'high'
    },
    {
      id: 7,
      title: 'Sports Event',
      message: 'Annual sports day registration open',
      type: 'event',
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
      priority: 'low'
    },
    {
      id: 8,
      title: 'Library Book Due',
      message: 'Your borrowed book is due tomorrow',
      type: 'library',
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), // 2 weeks ago
      priority: 'medium'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const getRecentNotifications = (count = 5) => {
    return notifications
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, count);
  };

  const getNotificationsByType = (type) => {
    if (type === 'all') return notifications;
    return notifications.filter(n => n.type === type);
  };

  const getNotificationTypes = () => {
    const types = [...new Set(notifications.map(n => n.type))];
    return types;
  };

  return (
    <NotificationsContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      getRecentNotifications,
      getNotificationsByType,
      getNotificationTypes
    }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};