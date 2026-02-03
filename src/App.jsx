import React from 'react'
import Routes from './Routes'
import { UserProvider } from './context/UserContext'
import { DataProvider } from './context/DataContext'
import { ThemeProvider } from './context/ThemeContext'
import { HelmetProvider } from 'react-helmet-async'

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <UserProvider>
          <DataProvider>
            <Routes />
          </DataProvider>
        </UserProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}

export default App
