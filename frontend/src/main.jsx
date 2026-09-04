import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Toaster 
  position="top-center"
  toastOptions={{
    // Default styling for all toasts
    style: {
      background: '#333',
      color: '#fff',
      padding: '12px 20px',
      borderRadius: '8px',
      fontSize: '14px',
    },
    // Custom Success Toast Colors
    success: {
      duration: 3000,
      style: {
        background: '#10B981', // Emerald green
        color: '#FFFFFF',
      },
      iconTheme: {
        primary: '#FFFFFF',
        secondary: '#10B981',
      },
    },
    // Custom Error Toast Colors
    error: {
      duration: 4000,
      style: {
        background: '#EF4444', // Bright red
        color: '#FFFFFF',
      },
      iconTheme: {
        primary: '#FFFFFF',
        secondary: '#EF4444',
      },
    },
  }}
/>
    <App />
  </React.StrictMode>
);
