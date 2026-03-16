import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import { PluginProvider } from './PluginContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <PluginProvider>
            <App />
        </PluginProvider>
    </React.StrictMode>
);