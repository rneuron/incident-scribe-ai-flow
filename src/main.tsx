
import { createRoot } from 'react-dom/client'
import React from 'react'
import App from './App.tsx'
import './index.css'
import { IncidentProvider } from './context/IncidentContext.tsx'

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <IncidentProvider>
      <App />
    </IncidentProvider>
  </React.StrictMode>
);
