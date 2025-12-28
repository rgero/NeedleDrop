import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import AlbumIcon from "@mui/icons-material/Album";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SearchIcon from "@mui/icons-material/Search";
import { grey } from "@mui/material/colors";

export default function BottomNav() {

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0}} elevation={3}>
      <BottomNavigation
        showLabels
        value={location.pathname}
        onChange={(_, newValue) => navigate(newValue)}
        sx={{ backgroundColor: grey[900] }}
      >
        <BottomNavigationAction
          label="Vinyls"
          value="/vinyls"
          icon={<AlbumIcon />}
        />
        <BottomNavigationAction
          label="Locations"
          value="/locations"
          icon={<SearchIcon />}
        />
        <BottomNavigationAction
          label="Wanted"
          value="/wantlist"
          icon={<SearchIcon />}
        />
        <BottomNavigationAction
          label="Play Log"
          value="/playlog"
          icon={<PlayArrowIcon />}
        />
      </BottomNavigation>
    </Paper>
  );
}
