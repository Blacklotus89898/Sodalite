import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import DataContextProvider from './stores/dataContextIProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DataContextProvider>
    <App />
    </DataContextProvider>
  </StrictMode>,
)
