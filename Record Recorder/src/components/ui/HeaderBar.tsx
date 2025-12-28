import { AppBar, Grid, Typography } from "@mui/material"

import AlbumIcon from '@mui/icons-material/Album';
import { Link } from "react-router-dom"

const HeaderBar = () => {
  return (
    <AppBar position="static">
      <Grid padding={1}>
        <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "inherit" }}>
          <AlbumIcon sx={{ marginRight: 1 }} />
          <Typography variant="h5">Record Recorder</Typography>
        </Link>
      </Grid>
      
    </AppBar>
  )
}

export default HeaderBar
