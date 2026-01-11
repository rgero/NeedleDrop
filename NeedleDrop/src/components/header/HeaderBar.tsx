import { AppBar, Grid, Typography } from "@mui/material"

import AlbumIcon from '@mui/icons-material/Album';
import { Link } from "react-router-dom"
import UserAvatar from "./UserAvatar";

const HeaderBar = () => {
  return (
    <AppBar position="static">
      <Grid container alignItems="center" justifyContent="space-between" paddingRight={"15px"}>
        <Grid padding={1}>
          <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "inherit" }}>
            <AlbumIcon sx={{ marginRight: 1 }} />
            <Typography variant="h5">Vinyl Drop</Typography>
          </Link>
        </Grid>
      <UserAvatar/>
      </Grid>
    </AppBar>
  )
}

export default HeaderBar
