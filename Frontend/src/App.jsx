import React from 'react'
import FaceExpression from './features/Expression/components/FaceExpression'
import { router } from './app.routes.jsx'
import { RouterProvider } from 'react-router-dom'
import './shared/styles/global.scss'
import { AuthProvider } from './features/auth/auth.context.jsx'


const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>

  )
}

export default App
