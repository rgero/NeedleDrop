import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import AlbumIcon from "@mui/icons-material/Album";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SearchIcon from "@mui/icons-material/Search";
import { grey } from "@mui/material/colors";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to determine which tab should be active
  const getActiveValue = () => {
    const path = location.pathname;
    if (path.startsWith("/vinyls") || path === "/") return "/vinyls";
    if (path.startsWith("/locations")) return "/locations";
    if (path.startsWith("/wantlist")) return "/wantlist";
    if (path.startsWith("/playlog")) return "/playlog";
    return path;
  };
  

  return (
    <Paper sx={{ position: "sticky", bottom: 0, left: 0, right: 0, zIndex: 1000}} elevation={3}>
      <BottomNavigation
        showLabels
        value={getActiveValue()}
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
          icon={<LocationOnIcon />}
        />
        <BottomNavigationAction
          label="Wanted"
          value="/wantlist"
          icon={<SearchIcon />}
        />
        <BottomNavigationAction
          label="Plays"
          value="/plays"
          icon={<PlayArrowIcon />}
        />
      </BottomNavigation>
    </Paper>
  );
}
