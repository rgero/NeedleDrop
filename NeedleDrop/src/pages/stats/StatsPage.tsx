import {Container} from "@mui/material";
import HouseholdStats from "@components/stats/HouseholdStats";
import UserStats from "@components/stats/UserStats";

const StatsPage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <UserStats/>
      <HouseholdStats/>
    </Container>
  );
};

export default StatsPage;
