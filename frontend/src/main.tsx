import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {MsalProvider} from "@azure/msal-react";
import {msalInstance} from "./auth/msalInstance.ts";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <MsalProvider instance={msalInstance}>
          <App />
      </MsalProvider>
  </StrictMode>,
)
