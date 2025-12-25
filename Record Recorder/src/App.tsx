import { BrowserRouter, Route, Routes } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import AppLayout from "@components/ui/AppLayout"
import AuthenticatedRoute from "@components/AuthenticatedRoute"
import { AuthenticationProvider } from "./context/authentication/AuthenticationProvider"
import { CssBaseline } from "@mui/material"
import DarkModeProvider from "./context/theme/DarkModeProvider"
import DashboardPage from "@pages/DashboardPage"
import { ErrorBoundary } from "react-error-boundary"
import ErrorFallback from "./components/ui/ErrorFallback"
import LandingPage from "./pages/LandingPage"
import PageNotFound from "@pages/PageNotFound"

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
                <Route
                  element={
                    <AuthenticatedRoute>
                      <AppLayout />
                    </AuthenticatedRoute>
                  }
                >
                  <Route index element={<DashboardPage/>}/>
                </Route>
                <Route path='landing' element={<LandingPage/>} />
                <Route element={<AppLayout/>}>
                  <Route path="*" element={<PageNotFound />} />
                </Route>
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
