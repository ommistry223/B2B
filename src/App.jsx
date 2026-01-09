import React from 'react'
import Routes from './Routes'
import { UserProvider } from './context/UserContext'
import { DataProvider } from './context/DataContext'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <DataProvider>
          <Routes />
        </DataProvider>
      </UserProvider>
    </ThemeProvider>
  )
}

export default App
