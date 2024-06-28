import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { AuthContextProvider } from './context/AuthContext.tsx';
import { ThemeProvider } from './context/ThemeProvider.tsx';
import './index.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AuthContextProvider>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Suspense fallback={<>loading</>}>
        <QueryClientProvider client={queryClient}>
          <App />
          {/* <ReactQueryDevtools /> */}
        </QueryClientProvider>
      </Suspense>
    </ThemeProvider>
  </AuthContextProvider>,
);
