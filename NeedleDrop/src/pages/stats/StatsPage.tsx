import { Container, Stack, Typography } from "@mui/material";

import AlbumsStats from "@components/stats/AlbumsStats";
import LocationTable from "@components/stats/LocationTable";
import PlaylogsStats from "@components/stats/PlaylogsStats";

const StatsPage = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4">Stats!</Typography>
      <Stack spacing={3}>
        <AlbumsStats />
        <LocationTable/>
        <PlaylogsStats />
      </Stack>
    </Container>
  );
};

export default StatsPage;
