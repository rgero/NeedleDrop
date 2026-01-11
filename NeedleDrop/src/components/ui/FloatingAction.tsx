import { Box, Fab } from "@mui/material"

import { ArrowBack } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"

const FloatingAction = ({slug} : {slug: string}) => {
  const navigate = useNavigate()
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
      <Fab onClick={ () => navigate(`/${slug}`)} size="small">
        <ArrowBack/>
      </Fab>
    </Box>
  )
}

export default FloatingAction
