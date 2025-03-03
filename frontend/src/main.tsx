import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './pages/App.tsx';
import './index.css';
import {MsalProvider} from "@azure/msal-react";
import {msalInstance} from "./auth/msalInstance.ts";


ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <MsalProvider instance={msalInstance}>
                <App />
            </MsalProvider>
        </BrowserRouter>
    </React.StrictMode>,
);