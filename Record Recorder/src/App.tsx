import { BrowserRouter, Route, Routes } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import AppLayout from "@components/ui/AppLayout"
import AuthenticatedRoute from "@components/AuthenticatedRoute"
import { AuthenticationProvider } from "./context/authentication/AuthenticationProvider"
import { CssBaseline } from "@mui/material"
import CustomToaster from "@components/ui/CustomToaster"
import DarkModeProvider from "./context/theme/DarkModeProvider"
import DashboardPage from "@pages/DashboardPage"
import { ErrorBoundary } from "react-error-boundary"
import ErrorFallback from "./components/ui/ErrorFallback"
import LandingPage from "./pages/LandingPage"
import { LocationProvider } from "@context/location/LocationProvider"
import LocationsPage from "@pages/LocationsPage"
import PageNotFound from "@pages/PageNotFound"
import { VinylProvider } from "@context/vinyl/VinylProvider"
import VinylsPage from "@pages/VinylsPage"

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
          <LocationProvider>
            <VinylProvider>
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
                      <Route path='vinyls' element={<VinylsPage/>} />
                      <Route path='locations' element={<LocationsPage/>} />
                      <Route path='wantlist' element={<div>Wantlist Page</div>} />
                      <Route path='playlog' element={<div>Play Log Page</div>} />
                    </Route>
                    <Route path='landing' element={<LandingPage/>} />
                    <Route element={<AppLayout/>}>
                      <Route path="*" element={<PageNotFound />} />
                    </Route>
                  </Routes>
                </ErrorBoundary>
              </BrowserRouter>
              <CssBaseline/>
            </VinylProvider>
          </LocationProvider>
        </AuthenticationProvider>
      </QueryClientProvider>
      <CustomToaster/>
    </DarkModeProvider>
  )
}

export default App
