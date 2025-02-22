import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import DataContextProvider from './stores/dataContextIProvider.tsx'
import { AppProviders } from './stores/providers.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <DataContextProvider>
        <App />
      </DataContextProvider>
    </AppProviders>
  </StrictMode>,
)
