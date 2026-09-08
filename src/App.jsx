import { useEffect } from 'react';
import './App.css';
import { RouterProvider } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { router } from './routes/mainRouter';
import { store } from './store/store';
import { fetchCurrentUser } from './store/authSlice';
import { fetchNotifications } from './store/notificationsSlice';

function AppBootstrap({ children }) {
  const dispatch = useDispatch();
  const { token, bootstrapping, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, isAuthenticated]);

  if (token && bootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="font-medium text-gray-600">Starting EduMS...</p>
        </div>
      </div>
    );
  }

  return children;
}

function App() {
  return (
    <Provider store={store}>
      <AppBootstrap>
        <RouterProvider router={router} />
      </AppBootstrap>
    </Provider>
  );
}

export default App;
