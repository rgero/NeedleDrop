import { BrowserRouter, Route, Routes } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import AppLayout from "@components/ui/AppLayout"
import AuthenticatedRoute from "@components/AuthenticatedRoute"
import { AuthenticationProvider } from "./context/authentication/AuthenticationProvider"
import { CssBaseline } from "@mui/material"
import CustomToaster from "@components/ui/CustomToaster"
import DarkModeProvider from "./context/theme/DarkModeProvider"
import DashboardPage from "@pages/DashboardPage"
import { DialogProvider } from "@context/dialog/DialogProvider"
import { ErrorBoundary } from "react-error-boundary"
import ErrorFallback from "./components/ui/ErrorFallback"
import LandingPage from "./pages/LandingPage"
import LocationDetailsPage from "@pages/locations/LocationDetailsPage"
import { LocationProvider } from "@context/location/LocationProvider"
import LocationsPage from "@pages/locations/LocationsPage"
import PageNotFound from "@pages/PageNotFound"
import PlaylogForm from "@components/playlog/PlaylogForm"
import { PlaylogProvider } from "@context/playlogs/PlaylogProvider"
import PlaylogsPage from "@pages/PlaylogsPage"
import { UserProvider } from "@context/users/UserProvider"
import { VinylProvider } from "@context/vinyl/VinylProvider"
import VinylsForm from "@components/vinyls/VinylsForm"
import VinylsPage from "@pages/VinylsPage"
import WantedItemDetailsPage from "@pages/wanted/WantedItemDetailsPage"
import { WantedItemProvider } from "@context/wanted/WantedItemProvider"
import WantedItemsPage from "@pages/wanted/WantedItemsPage"

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
                    <DialogProvider>
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
                                <Route path="create" element={<VinylsForm/>} />
                                <Route path=':id' element={<VinylsForm/>} />
                              </Route>
                              <Route path="locations">
                                <Route index element={<LocationsPage/>} />
                                <Route path="create" element={<LocationDetailsPage/>} />
                                <Route path=':id' element={<LocationDetailsPage/>} />
                              </Route>
                              <Route path="wantlist">
                                <Route index element={<WantedItemsPage/>} />
                                <Route path='create' element={<WantedItemDetailsPage/>} />
                                <Route path=':id' element={<WantedItemDetailsPage/>} />
                              </Route>
                              <Route path="plays">
                                <Route index element={<PlaylogsPage/>} /> 
                                <Route path='create' element={<PlaylogForm/>} />
                                <Route path=':id' element={<PlaylogForm/>} />
                              </Route>
                            </Route>
                            <Route path='landing' element={<LandingPage/>} />
                            <Route element={<AppLayout/>}>
                              <Route path="*" element={<PageNotFound />} />
                            </Route>
                          </Routes>
                        </ErrorBoundary>
                      </BrowserRouter>
                      <CssBaseline/>
                    </DialogProvider>
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
