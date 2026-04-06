import React, { useState } from 'react';
import {
  Bell,
  Filter,
  CheckCircle,
  CheckCircle2,
  AlertCircle,
  Calendar,
  BookOpen,
  DollarSign,
  Users,
  Trophy,
  Library,
  X
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { markAsRead, markAllAsRead } from '../store/notificationsSlice';
import Container from '../components/ui-components/container';

export const NotificationsScreen = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.notifications);

  const [selectedType, setSelectedType] = useState('all');
  const [showRead, setShowRead] = useState(true);

  const getNotificationsByType = (type) => {
    if (type === 'all') return notifications;
    return notifications.filter((n) => n.type === type);
  };

  const getNotificationTypes = () => {
    const types = [...new Set(notifications.map((n) => n.type))];
    return types;
  };

  const notificationTypes = getNotificationTypes();
  const filteredNotifications = getNotificationsByType(selectedType)
    .filter(notification => showRead || !notification.read)
    .sort((a, b) => b.timestamp - a.timestamp);

  const getTypeIcon = (type) => {
    const icons = {
      assignment: BookOpen,
      exam: AlertCircle,
      grade: Trophy,
      announcement: Bell,
      meeting: Users,
      fee: DollarSign,
      event: Calendar,
      library: Library
    };
    return icons[type] || Bell;
  };

  const getTypeColor = (type) => {
    const colors = {
      assignment: 'text-blue-600 bg-blue-100',
      exam: 'text-red-600 bg-red-100',
      grade: 'text-green-600 bg-green-100',
      announcement: 'text-purple-600 bg-purple-100',
      meeting: 'text-indigo-600 bg-indigo-100',
      fee: 'text-orange-600 bg-orange-100',
      event: 'text-pink-600 bg-pink-100',
      library: 'text-teal-600 bg-teal-100'
    };
    return colors[type] || 'text-gray-600 bg-gray-100';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <Container className="space-y-6 py-6">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Bell className="w-10 h-10" />
          Notifications
        </h1>
        <p className="text-blue-100">
          Stay updated with all your school activities and announcements
        </p>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filter by type:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                {notificationTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={showRead}
                  onChange={(e) => setShowRead(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Show read notifications
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => dispatch(markAllAsRead())}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark All as Read
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {selectedType === 'all' ? 'All Notifications' : `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Notifications`}
            <span className="ml-2 text-sm font-normal text-gray-600">
              ({filteredNotifications.length})
            </span>
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-600">
                {selectedType === 'all'
                  ? "You don't have any notifications yet."
                  : `No ${selectedType} notifications found.`
                }
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const TypeIcon = getTypeIcon(notification.type);
              return (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Type Icon */}
                    <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                      <TypeIcon className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {notification.title}
                          </h3>
                          <p className="text-gray-700 mb-3">{notification.message}</p>

                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                                {notification.priority.toUpperCase()}
                              </span>
                            </span>
                            <span>{formatTimeAgo(notification.timestamp)}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(notification.type)}`}>
                              {notification.type}
                            </span>
                          </div>
                        </div>

                        {/* Mark as Read Button */}
                        {!notification.read && (
                          <button
                            onClick={() => dispatch(markAsRead(notification.id))}
                            className="ml-4 p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Container>
  );
};

export default NotificationsScreen;