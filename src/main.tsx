
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { IncidentProvider } from './context/IncidentContext.tsx'

createRoot(document.getElementById("root")!).render(
  <IncidentProvider>
    <App />
  </IncidentProvider>
);
