import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import WordProvider from './storage/WordProvider';


const queryClient = new QueryClient()

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <WordProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WordProvider>
  </React.StrictMode>
);

