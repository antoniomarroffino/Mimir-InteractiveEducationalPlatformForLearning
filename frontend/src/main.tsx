import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import App from './pages/App.tsx';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {MsalProvider} from "@azure/msal-react";
import {msalInstance} from "./auth/msalInstance.ts";


ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <MsalProvider instance={msalInstance}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </MsalProvider>
    </React.StrictMode>,
);