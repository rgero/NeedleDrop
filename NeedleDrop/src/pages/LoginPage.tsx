import { Box, Button, Card, CardContent, Grid, Stack, Typography, useTheme } from "@mui/material";

import type { Theme } from "@mui/material/styles";
import { useEffect } from "react";

const LoginPage = () => {
  const theme: Theme = useTheme();
    
  useEffect(() => {
    document.body.style.background = `url('/background.jpg') center/cover no-repeat fixed`;
    document.body.style.backgroundColor = theme.palette.background.paper;
    document.body.style.color = theme.palette.primary.light;

    return () => {
      document.body.style.background = "";
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
    };
  }, [theme]);

  return (
    <Grid
      container
      sx={{
        alignItems: "center",
        justifyContent: "center",
        height: "100vh"
      }}>
      <Card sx={{ padding: "10px", borderColor: "grey", border: 2 }}>
        <CardContent>
          <Stack spacing={2}>
            <Box sx={{ alignSelf: "center" }}>
              <Typography variant="h5">The Needle Drop - Login</Typography>
            </Box>
            
            <Box>
              <Typography>A small social website where you can keep track of your vinyl collection.</Typography>
              <Typography>This is in active development and will be changing frequently.</Typography>
            </Box>
            
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button variant="contained" color="primary">Login</Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default LoginPage;