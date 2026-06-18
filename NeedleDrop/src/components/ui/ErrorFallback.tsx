import { Box, Button, Typography, useTheme } from "@mui/material";

import type { FallbackProps } from "react-error-boundary";
import { useEffect } from "react";

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

  const errorMessage = error instanceof Error ? error.message : typeof error === "string" ? error : "An unexpected error occurred.";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "calc(var(--vh, 1vh) * 100)",
        bgcolor: theme.palette.background.default,
        paddingTop: "2rem",
        px: 2
      }}
    >
      <Typography variant="h6" align="center" component="h1">
        Something went wrong
      </Typography>
      
      <Typography
        variant="body2"
        align="center"
        sx={{
          color: "text.secondary",
          mt: 2,
          maxWidth: 520
        }}
      >
        {errorMessage}
      </Typography>
      
      <Button 
        variant="contained" 
        sx={{ mt: 3 }} 
        onClick={resetErrorBoundary}
      >
        Try again
      </Button>
    </Box>
  );
};

export default ErrorFallback;