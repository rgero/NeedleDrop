import { Box, Grid, Typography, useTheme, Button } from "@mui/material";

import { useEffect } from "react";
import type { FallbackProps } from "react-error-boundary";

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const theme = useTheme();

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVh();
    window.addEventListener("resize", setVh);

    return () => {
      window.removeEventListener("resize", setVh);
    };
  }, []);

  return (
    <>
      <Box display="flex" flexDirection="column" height="calc(var(--vh, 1vh) * 100)" bgcolor={theme.palette.background.default}>
        <Grid
          container
          sx={{ height: "100vh", paddingTop: "2rem" }}
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h6" align="center" component="h1">
            Something went wrong
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2, maxWidth: 520, px: 2 }}>
            {error.message}
          </Typography>
          <Button variant="contained" sx={{ mt: 3 }} onClick={resetErrorBoundary}>
            Try again
          </Button>
        </Grid>
      </Box>
    </>

  );
};

export default ErrorFallback;
