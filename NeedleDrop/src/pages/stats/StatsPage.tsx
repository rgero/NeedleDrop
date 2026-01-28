import { Container, Divider, Typography } from "@mui/material";

import UserStats from "@components/stats/user/UserStats";

const StatsPage = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4">Stats!</Typography>
      <UserStats/>
      <Divider/>
    </Container>
  );
};

export default StatsPage;
