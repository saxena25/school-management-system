import { useState } from 'react'
import './App.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/mainRouter'
import { AuthProvider } from './contexts/AuthContext'
import { NotificationsProvider } from './contexts/NotificationsContext'
import { KnowledgeCheckProvider } from './contexts/KnowledgeCheckContext'

function App() {

  return (
    <AuthProvider>
      <NotificationsProvider>
        <KnowledgeCheckProvider>
          <RouterProvider router={router} />
        </KnowledgeCheckProvider>
      </NotificationsProvider>
    </AuthProvider>
  )
}

export default App
