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
import { PlaylogProvider } from "@context/playlogs/PlaylogProvider"
import PlaylogsPage from "@pages/PlaylogsPage"
import { UserProvider } from "@context/users/UserProvider"
import { VinylProvider } from "@context/vinyl/VinylProvider"
import VinylsPage from "@pages/VinylsPage"
import WantItemPresentation from "@components/wanted/WantItemPresentation"
import { WantedItemProvider } from "@context/wanted/WantedItemProvider"
import WantedItemsPage from "@pages/WantedItemPage"

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
          <UserProvider>
            <LocationProvider>
              <VinylProvider>
                <WantedItemProvider>
                  <PlaylogProvider>
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
                            <Route path="vinyls">
                              <Route index element={<VinylsPage/>} />
                            </Route>
                            <Route path="locations">
                              <Route index element={<LocationsPage/>} />
                            </Route>
                            <Route path="wantlist">
                              <Route index element={<WantedItemsPage/>} />
                              <Route path=':id' element={<WantItemPresentation/>} />
                            </Route>
                            <Route path='playlog' element={<PlaylogsPage/>} />
                          </Route>
                          <Route path='landing' element={<LandingPage/>} />
                          <Route element={<AppLayout/>}>
                            <Route path="*" element={<PageNotFound />} />
                          </Route>
                        </Routes>
                      </ErrorBoundary>
                    </BrowserRouter>
                    <CssBaseline/>
                  </PlaylogProvider>
                </WantedItemProvider>
              </VinylProvider>
            </LocationProvider>
          </UserProvider>
        </AuthenticationProvider>
      </QueryClientProvider>
      <CustomToaster/>
    </DarkModeProvider>
  )
}

export default App
