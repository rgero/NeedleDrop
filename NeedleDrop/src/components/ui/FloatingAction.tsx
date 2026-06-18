import { Box, Fab } from "@mui/material"

import { ArrowBack } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"

const FloatingAction = ({ fallbackPath }: { fallbackPath: string }) => {
  const navigate = useNavigate()

  const handleBack = () => {
    const historyState = window.history.state as { idx?: number } | null;
    const canGoBackInApp = typeof historyState?.idx === "number" && historyState.idx > 0;

    if (canGoBackInApp) {
      navigate(-1);
      return;
    }

    navigate(fallbackPath);
  };

  return (
    <Box 
      sx={{ 
        position: 'fixed', 
        bottom: 64,
        right: 24,
        zIndex: 1050,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        '& > :not(style)': { m: 1 },
      }}
    >
      <Fab onClick={handleBack} size="small">
        <ArrowBack/>
      </Fab>
    </Box>
  )
}

export default FloatingAction
