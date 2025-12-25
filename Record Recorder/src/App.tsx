import { BrowserRouter, Route, Routes } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { AuthenticationProvider } from "./context/authentication/AuthenticationProvider"
import { CssBaseline } from "@mui/material"
import DarkModeProvider from "./context/theme/DarkModeProvider"
import { ErrorBoundary } from "react-error-boundary"
import ErrorFallback from "./components/ui/ErrorFallback"
import LandingPage from "./pages/LandingPage"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 1000,
    },
    mutations: {
      onError: (error) => {
        console.error(error);
      },
    },
  },
});

const App = () => {
  return (
    <DarkModeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthenticationProvider>
          <BrowserRouter>
            <ErrorBoundary FallbackComponent={ErrorFallback} onReset={()=> window.location.replace("/")}>
              <Routes>
                <Route path="/" element={<LandingPage/>} />
              </Routes>
            </ErrorBoundary>
          </BrowserRouter>
          <CssBaseline/>
        </AuthenticationProvider>
      </QueryClientProvider>
    </DarkModeProvider>
  )
}

export default App
