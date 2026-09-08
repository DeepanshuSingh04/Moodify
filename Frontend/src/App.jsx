import React from 'react'
import FaceExpression from './features/Expression/components/FaceExpression'
import { router } from './app.routes.jsx'
import { RouterProvider } from 'react-router-dom'
import './shared/styles/global.scss'
import { AuthProvider } from './features/auth/auth.context.jsx'
import { SongContextProvider } from './features/home/song.context.jsx'


const App = () => {
  return (
    <AuthProvider>
      <SongContextProvider>
        <RouterProvider router={router} />
      </SongContextProvider>
    </AuthProvider>

  )
}

export default App
