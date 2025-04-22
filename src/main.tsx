// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { App } from './App';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Create a basic MUI theme (customize as needed)
const customTheme = createTheme({
    palette: {
        primary: { main: '#6A1B9A' },
        secondary: { main: '#FF8F00' },
        background: { default: '#EDE7F6', paper: '#FFF' },
    },
    typography: {
        fontFamily: 'Poppins, sans-serif',
        h3: { fontWeight: 700, fontSize: '3rem' },
        h6: { fontWeight: 600 },
        body2: { fontSize: '0.9rem' },
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiInputBase-input:focus': {
                        color: '#6A1B9A',
                    },
                },
            },
        },
    },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider theme={customTheme}>
            <CssBaseline />
            <BrowserRouter>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </BrowserRouter>
        </ThemeProvider>
    </React.StrictMode>
);
