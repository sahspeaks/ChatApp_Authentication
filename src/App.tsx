import React from 'react'
import { Router } from './routes/Router'
import FirebaseContextProvider from './services/FirebaseContext'

const App = () => {
  return (
    <FirebaseContextProvider>
      <Router />
    </FirebaseContextProvider>
  )
}

export default App
