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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "calc(var(--vh, 1vh) * 100)",
          bgcolor: theme.palette.background.default
        }}>
        <Grid
          container
          direction="column"
          sx={{
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            paddingTop: "2rem"
          }}>
          <Typography variant="h6" align="center" component="h1">
            Something went wrong
          </Typography>
          <Typography
            variant="body2"
            align="center"
            sx={{
              color: "text.secondary",
              mt: 2,
              maxWidth: 520,
              px: 2
            }}>
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
