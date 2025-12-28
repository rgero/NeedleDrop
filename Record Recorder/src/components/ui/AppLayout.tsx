import { Box, Container } from "@mui/material"

import BottomNav from "@components/ui/BottomNav"
import HeaderBar from "./HeaderBar"
import { Outlet } from "react-router-dom"

const AppLayout = () => {
  return (
    <Box display="flex" flexDirection="column" height="calc(var(--vh, 1vh) * 100)">
      <HeaderBar/>
      <Box flexGrow={1} overflow="auto" display="flex" justifyContent="center" sx={{ mt: "1rem" }}>
        <Container disableGutters sx={{ width: { xs: "95%", md: "90%" } }}>
          <Outlet />
        </Container>
      </Box>
      <BottomNav/>
    </Box>
)
}

export default AppLayout
